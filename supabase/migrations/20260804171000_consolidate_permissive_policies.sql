-- Consolidate equivalent permissive policies so Postgres evaluates one policy
-- per role/action while preserving the union of the existing access rules.

drop policy if exists discoveries_qira_select on public.discoveries;
drop policy if exists discoveries_prospect_own_select on public.discoveries;
create policy discoveries_member_select
on public.discoveries for select to authenticated
using (
  (select private.has_active_membership(
    discoveries.organization_id,
    array['qira_consultant', 'qira_admin']
  ))
  or (
    created_by = (select auth.uid())
    and (select private.has_active_membership(
      discoveries.organization_id,
      array['prospect_member']
    ))
  )
);

drop policy if exists memberships_own_select on public.memberships;
drop policy if exists memberships_qira_select on public.memberships;
create policy memberships_member_select
on public.memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or (select private.has_active_membership(
    memberships.organization_id,
    array['qira_consultant', 'qira_admin']
  ))
);

drop policy if exists proposals_qira_select on public.proposals;
drop policy if exists proposals_client_shared_select on public.proposals;
create policy proposals_member_select
on public.proposals for select to authenticated
using (
  (select private.has_active_membership(
    proposals.organization_id,
    array['qira_consultant', 'qira_admin']
  ))
  or (
    status = 'shared'
    and (select private.has_active_membership(
      proposals.organization_id,
      array['client_viewer', 'client_member']
    ))
  )
);

drop policy if exists invitations_admin_all on public.invitations;
drop policy if exists invitations_recipient_select on public.invitations;
drop policy if exists invitations_recipient_update on public.invitations;

create policy invitations_member_select
on public.invitations for select to authenticated
using (
  (select private.has_active_membership(
    invitations.organization_id,
    array['qira_admin']
  ))
  or (
    lower(email) = lower((select auth.jwt()) ->> 'email')
    and status = 'pending'
    and expires_at > now()
  )
);

create policy invitations_admin_insert
on public.invitations for insert to authenticated
with check (
  invited_by = (select auth.uid())
  and (select private.has_active_membership(
    invitations.organization_id,
    array['qira_admin']
  ))
);

create policy invitations_member_update
on public.invitations for update to authenticated
using (
  (select private.has_active_membership(
    invitations.organization_id,
    array['qira_admin']
  ))
  or (
    lower(email) = lower((select auth.jwt()) ->> 'email')
    and status = 'pending'
    and expires_at > now()
  )
)
with check (
  (
    invited_by = (select auth.uid())
    and (select private.has_active_membership(
      invitations.organization_id,
      array['qira_admin']
    ))
  )
  or (
    accepted_by = (select auth.uid())
    and status = 'accepted'
  )
);

create policy invitations_admin_delete
on public.invitations for delete to authenticated
using ((select private.has_active_membership(
  invitations.organization_id,
  array['qira_admin']
)));
