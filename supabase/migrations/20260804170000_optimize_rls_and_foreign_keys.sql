-- Cache the authenticated email lookup once per statement instead of once per row.
-- The policy predicates and permissions remain unchanged.
drop policy if exists invitations_recipient_select on public.invitations;
create policy invitations_recipient_select
on public.invitations for select to authenticated
using (
  lower(email) = lower((select auth.jwt()) ->> 'email')
  and status = 'pending'
  and expires_at > now()
);

drop policy if exists invitations_recipient_update on public.invitations;
create policy invitations_recipient_update
on public.invitations for update to authenticated
using (
  lower(email) = lower((select auth.jwt()) ->> 'email')
  and status = 'pending'
  and expires_at > now()
)
with check (
  accepted_by = (select auth.uid())
  and status = 'accepted'
);

drop policy if exists memberships_invited_insert on public.memberships;
create policy memberships_invited_insert
on public.memberships for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'active'
  and exists (
    select 1
    from public.invitations i
    where i.organization_id = memberships.organization_id
      and lower(i.email) = lower((select auth.jwt()) ->> 'email')
      and i.role = memberships.role
      and i.status = 'pending'
      and i.expires_at > now()
  )
);

-- Index every referencing foreign-key column reported by the database advisor.
create index if not exists discovery_snapshots_approved_by_idx
  on public.discovery_snapshots (approved_by);
create index if not exists evidence_discovery_id_idx
  on public.evidence (discovery_id);
create index if not exists evidence_organization_id_idx
  on public.evidence (organization_id);
create index if not exists evidence_scanned_by_idx
  on public.evidence (scanned_by);
create index if not exists evidence_uploaded_by_idx
  on public.evidence (uploaded_by);
create index if not exists invitations_accepted_by_idx
  on public.invitations (accepted_by);
create index if not exists invitations_invited_by_idx
  on public.invitations (invited_by);
create index if not exists notifications_proposal_id_idx
  on public.notifications (proposal_id);
create index if not exists proposal_client_decisions_decided_by_idx
  on public.proposal_client_decisions (decided_by);
create index if not exists proposal_client_events_actor_id_idx
  on public.proposal_client_events (actor_id);
create index if not exists proposal_client_events_organization_id_idx
  on public.proposal_client_events (organization_id);
create index if not exists proposal_exports_generated_by_idx
  on public.proposal_exports (generated_by);
create index if not exists proposals_discovery_snapshot_id_idx
  on public.proposals (discovery_snapshot_id);
