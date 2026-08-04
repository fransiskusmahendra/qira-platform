create table if not exists public.proposal_exports (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id),
  organization_id uuid not null references public.organizations(id),
  proposal_version integer not null check (proposal_version > 0),
  format text not null default 'pdf' check (format = 'pdf'),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  generated_by uuid not null references auth.users(id),
  generated_at timestamptz not null default now(),
  unique (proposal_id, proposal_version, checksum_sha256)
);

create index if not exists proposal_exports_organization_id_idx on public.proposal_exports (organization_id);
alter table public.proposal_exports enable row level security;
grant select, insert on public.proposal_exports to authenticated;
revoke update, delete on public.proposal_exports from authenticated, anon;

create policy proposal_exports_qira_select
on public.proposal_exports for select to authenticated
using ((select private.has_active_membership(proposal_exports.organization_id, array['qira_consultant','qira_admin'])));

create policy proposal_exports_qira_insert
on public.proposal_exports for insert to authenticated
with check (
  generated_by = (select auth.uid())
  and (select private.has_active_membership(proposal_exports.organization_id, array['qira_consultant','qira_admin']))
);

create or replace function public.record_proposal_export(target_proposal_id uuid, pdf_checksum_sha256 text)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_proposal public.proposals;
  export_id uuid;
begin
  select * into current_proposal from public.proposals where id = target_proposal_id;
  if current_proposal.id is null then raise exception 'Proposal not found'; end if;
  if current_proposal.status not in ('approved','shared') then raise exception 'Only approved proposals can be exported'; end if;
  if current_proposal.approved_by is null or current_proposal.approved_at is null then raise exception 'Human approval is required'; end if;
  if pdf_checksum_sha256 !~ '^[a-f0-9]{64}$' then raise exception 'Invalid PDF checksum'; end if;
  if not (select private.has_active_membership(current_proposal.organization_id, array['qira_consultant','qira_admin'])) then raise exception 'Export permission denied'; end if;

  insert into public.proposal_exports (proposal_id, organization_id, proposal_version, checksum_sha256, generated_by)
  values (current_proposal.id, current_proposal.organization_id, current_proposal.version, pdf_checksum_sha256, (select auth.uid()))
  on conflict (proposal_id, proposal_version, checksum_sha256)
  do nothing
  returning id into export_id;
  if export_id is null then
    select id into export_id from public.proposal_exports
    where proposal_id = current_proposal.id and proposal_version = current_proposal.version and checksum_sha256 = pdf_checksum_sha256;
  end if;

  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (current_proposal.organization_id, (select auth.uid()), 'proposal.exported.pdf', 'proposal', current_proposal.id, 'success', pdf_checksum_sha256);
  return export_id;
end;
$$;

revoke all on function public.record_proposal_export(uuid, text) from public, anon;
grant execute on function public.record_proposal_export(uuid, text) to authenticated;
