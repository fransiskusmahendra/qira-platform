alter table public.proposals
  add column recipient_email text;

alter table public.proposals
  add constraint proposals_recipient_email_format
  check (recipient_email is null or recipient_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');

create table public.proposal_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  proposal_id uuid not null references public.proposals(id),
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (proposal_id)
);

create index proposal_email_deliveries_org_created_idx
  on public.proposal_email_deliveries (organization_id, created_at desc);

alter table public.proposal_email_deliveries enable row level security;
grant select, insert, update on public.proposal_email_deliveries to authenticated;
revoke delete on public.proposal_email_deliveries from authenticated, anon;

create policy proposal_email_deliveries_qira_select
on public.proposal_email_deliveries for select to authenticated
using ((select private.has_active_membership(proposal_email_deliveries.organization_id, array['qira_consultant','qira_admin'])));

create policy proposal_email_deliveries_qira_insert
on public.proposal_email_deliveries for insert to authenticated
with check ((select private.has_active_membership(proposal_email_deliveries.organization_id, array['qira_consultant','qira_admin'])));

create policy proposal_email_deliveries_qira_update
on public.proposal_email_deliveries for update to authenticated
using ((select private.has_active_membership(proposal_email_deliveries.organization_id, array['qira_consultant','qira_admin'])))
with check ((select private.has_active_membership(proposal_email_deliveries.organization_id, array['qira_consultant','qira_admin'])));

drop function public.create_proposal(uuid, uuid, text, text, text, date, date, jsonb);

create function public.create_proposal(
  target_organization_id uuid,
  source_discovery_id uuid,
  proposal_no text,
  client text,
  recipient text,
  recipient_email_address text,
  issued_on date,
  valid_through date,
  terms jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_id uuid;
  actor uuid := (select auth.uid());
  proposal_row jsonb;
  source_version integer;
  source_snapshot_id uuid;
begin
  if actor is null then raise exception 'Authentication required'; end if;
  if valid_through < issued_on then raise exception 'Invalid validity period'; end if;
  if length(trim(coalesce(recipient_email_address, ''))) = 0 then raise exception 'Recipient email is required'; end if;
  if not (select private.has_active_membership(target_organization_id, array['qira_consultant','qira_admin'])) then raise exception 'Proposal permission denied'; end if;

  select d.version, s.id into source_version, source_snapshot_id
  from public.discoveries d
  join public.discovery_snapshots s on s.discovery_id = d.id and s.discovery_version = d.version
  where d.id = source_discovery_id
    and d.organization_id = target_organization_id
    and d.status = 'approved';
  if source_version is null then raise exception 'An approved Discovery snapshot is required'; end if;

  insert into public.proposals (
    organization_id, discovery_id, discovery_snapshot_id, proposal_number, status, version, client_name,
    recipient_name, recipient_email, issue_date, valid_until, commercial_terms, created_by
  ) values (
    target_organization_id, source_discovery_id, source_snapshot_id, proposal_no, 'draft', 1, trim(client),
    trim(recipient), lower(trim(recipient_email_address)), issued_on, valid_through, terms, actor
  ) returning id, to_jsonb(public.proposals.*) into new_id, proposal_row;

  insert into public.proposal_versions (proposal_id, organization_id, version, snapshot, created_by)
  values (new_id, target_organization_id, 1, proposal_row, actor);
  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (target_organization_id, actor, 'proposal.created', 'proposal', new_id, 'success', 'discovery_version=' || source_version);
  return new_id;
end;
$$;

revoke all on function public.create_proposal(uuid, uuid, text, text, text, text, date, date, jsonb) from public, anon;
grant execute on function public.create_proposal(uuid, uuid, text, text, text, text, date, date, jsonb) to authenticated;
