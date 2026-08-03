create table if not exists public.discovery_snapshots (
  id uuid primary key default gen_random_uuid(),
  discovery_id uuid not null references public.discoveries(id),
  organization_id uuid not null references public.organizations(id),
  discovery_version integer not null check (discovery_version > 0),
  snapshot jsonb not null,
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  approved_by uuid not null references auth.users(id),
  approved_at timestamptz not null default now(),
  unique (discovery_id, discovery_version)
);

create index if not exists discovery_snapshots_organization_id_idx
  on public.discovery_snapshots (organization_id);

alter table public.proposals
  add column if not exists discovery_snapshot_id uuid references public.discovery_snapshots(id);

alter table public.discovery_snapshots enable row level security;
grant select, insert on public.discovery_snapshots to authenticated;
revoke update, delete on public.discovery_snapshots from authenticated, anon;

create policy discovery_snapshots_member_select
on public.discovery_snapshots for select
to authenticated
using ((select private.has_active_membership(discovery_snapshots.organization_id)));

create policy discovery_snapshots_qira_insert
on public.discovery_snapshots for insert
to authenticated
with check (
  approved_by = (select auth.uid())
  and (select private.has_active_membership(discovery_snapshots.organization_id, array['qira_consultant','qira_admin']))
);

create or replace function public.transition_discovery(
  target_discovery_id uuid,
  target_status text,
  transition_reason text default null
)
returns setof public.discoveries
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_discovery public.discoveries;
  permitted boolean := false;
  approved_snapshot jsonb;
begin
  select * into current_discovery from public.discoveries where id = target_discovery_id;
  if current_discovery.id is null then raise exception 'Discovery not found'; end if;

  if current_discovery.status = 'draft' and target_status = 'submitted' then
    permitted := (select private.has_active_membership(current_discovery.organization_id, array['qira_consultant','qira_admin']));
    if coalesce((current_discovery.responses -> '_consent' ->> 'accepted')::boolean, false) is not true then raise exception 'Explicit consent is required'; end if;
  elsif current_discovery.status = 'submitted' and target_status = 'approved' then
    permitted := (select private.has_active_membership(current_discovery.organization_id, array['qira_consultant','qira_admin']));
  elsif current_discovery.status in ('submitted','approved') and target_status = 'draft' then
    permitted := (select private.has_active_membership(current_discovery.organization_id, array['qira_consultant','qira_admin']));
    if length(trim(coalesce(transition_reason, ''))) = 0 then raise exception 'Reopen reason is required'; end if;
  end if;
  if not permitted then raise exception 'Discovery transition is not permitted'; end if;

  update public.discoveries
     set status = target_status,
         version = case when target_status = 'draft' then version + 1 else version end,
         updated_at = now()
   where id = target_discovery_id
  returning * into current_discovery;

  if target_status = 'approved' then
    approved_snapshot := to_jsonb(current_discovery);
    insert into public.discovery_snapshots (
      discovery_id, organization_id, discovery_version, snapshot, checksum_sha256, approved_by
    ) values (
      current_discovery.id,
      current_discovery.organization_id,
      current_discovery.version,
      approved_snapshot,
      encode(sha256(convert_to(approved_snapshot::text, 'UTF8')), 'hex'),
      (select auth.uid())
    );
  end if;

  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (current_discovery.organization_id, (select auth.uid()), 'discovery.' || target_status, 'discovery', current_discovery.id, 'success', transition_reason);
  return next current_discovery;
end;
$$;

create or replace function public.create_proposal(
  target_organization_id uuid,
  source_discovery_id uuid,
  proposal_no text,
  client text,
  recipient text,
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
  if not (select private.has_active_membership(target_organization_id, array['qira_consultant','qira_admin'])) then raise exception 'Proposal permission denied'; end if;

  select d.version, s.id into source_version, source_snapshot_id
  from public.discoveries d
  join public.discovery_snapshots s on s.discovery_id = d.id and s.discovery_version = d.version
  where d.id = source_discovery_id
    and d.organization_id = target_organization_id
    and d.status = 'approved';
  if source_version is null then raise exception 'An approved Discovery snapshot is required'; end if;

  insert into public.proposals (
    organization_id, discovery_id, discovery_snapshot_id, proposal_number, status, version, client_name, recipient_name,
    issue_date, valid_until, commercial_terms, created_by
  ) values (
    target_organization_id, source_discovery_id, source_snapshot_id, proposal_no, 'draft', 1, trim(client), trim(recipient),
    issued_on, valid_through, terms, actor
  ) returning id, to_jsonb(public.proposals.*) into new_id, proposal_row;

  insert into public.proposal_versions (proposal_id, organization_id, version, snapshot, created_by)
  values (new_id, target_organization_id, 1, proposal_row, actor);
  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (target_organization_id, actor, 'proposal.created', 'proposal', new_id, 'success', 'discovery_version=' || source_version);
  return new_id;
end;
$$;

revoke all on function public.create_proposal(uuid, uuid, text, text, text, date, date, jsonb) from public, anon;
grant execute on function public.create_proposal(uuid, uuid, text, text, text, date, date, jsonb) to authenticated;
revoke all on function public.create_proposal(uuid, text, text, text, date, date, jsonb) from public, anon, authenticated;
