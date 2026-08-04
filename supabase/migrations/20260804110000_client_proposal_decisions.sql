create table public.proposal_client_decisions (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id),
  organization_id uuid not null references public.organizations(id),
  proposal_version integer not null check (proposal_version > 0),
  decision text not null check (decision in ('accepted', 'revision_requested')),
  comment text,
  decided_by uuid not null references auth.users(id),
  decided_at timestamptz not null default now(),
  unique (proposal_id, proposal_version),
  check (decision = 'accepted' or nullif(btrim(comment), '') is not null)
);

create index proposal_client_decisions_organization_id_idx
on public.proposal_client_decisions (organization_id, decided_at desc);

alter table public.proposal_client_decisions enable row level security;
grant select, insert on public.proposal_client_decisions to authenticated;
revoke update, delete on public.proposal_client_decisions from authenticated, anon;

create policy proposal_client_decisions_select
on public.proposal_client_decisions for select to authenticated
using (
  decided_by = (select auth.uid())
  or (select private.has_active_membership(
    proposal_client_decisions.organization_id,
    array['qira_consultant', 'qira_admin']
  ))
);

create policy proposal_client_decisions_insert
on public.proposal_client_decisions for insert to authenticated
with check (
  decided_by = (select auth.uid())
  and (select private.has_active_membership(
    proposal_client_decisions.organization_id,
    array['client_viewer', 'client_member']
  ))
  and exists (
    select 1 from public.proposals
    where proposals.id = proposal_client_decisions.proposal_id
      and proposals.organization_id = proposal_client_decisions.organization_id
      and proposals.version = proposal_client_decisions.proposal_version
      and proposals.status = 'shared'
  )
);

create table public.proposal_client_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id),
  organization_id uuid not null references public.organizations(id),
  proposal_version integer not null check (proposal_version > 0),
  event_type text not null check (event_type = 'pdf_downloaded'),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  actor_id uuid not null references auth.users(id),
  occurred_at timestamptz not null default now()
);

create index proposal_client_events_proposal_id_idx
on public.proposal_client_events (proposal_id, occurred_at desc);

alter table public.proposal_client_events enable row level security;
grant select, insert on public.proposal_client_events to authenticated;
revoke update, delete on public.proposal_client_events from authenticated, anon;

create policy proposal_client_events_select
on public.proposal_client_events for select to authenticated
using (
  actor_id = (select auth.uid())
  or (select private.has_active_membership(
    proposal_client_events.organization_id,
    array['qira_consultant', 'qira_admin']
  ))
);

create policy proposal_client_events_insert
on public.proposal_client_events for insert to authenticated
with check (
  actor_id = (select auth.uid())
  and (select private.has_active_membership(
    proposal_client_events.organization_id,
    array['client_viewer', 'client_member']
  ))
  and exists (
    select 1 from public.proposals
    where proposals.id = proposal_client_events.proposal_id
      and proposals.organization_id = proposal_client_events.organization_id
      and proposals.version = proposal_client_events.proposal_version
      and proposals.status = 'shared'
  )
);
