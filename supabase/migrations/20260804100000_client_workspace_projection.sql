drop policy if exists proposals_member_select on public.proposals;
create policy proposals_qira_select
on public.proposals for select to authenticated
using ((select private.has_active_membership(proposals.organization_id, array['qira_consultant','qira_admin'])));
create policy proposals_client_shared_select
on public.proposals for select to authenticated
using (
  status = 'shared'
  and (select private.has_active_membership(proposals.organization_id, array['client_viewer','client_member']))
);

drop policy if exists proposal_versions_member_select on public.proposal_versions;
create policy proposal_versions_qira_select
on public.proposal_versions for select to authenticated
using ((select private.has_active_membership(proposal_versions.organization_id, array['qira_consultant','qira_admin'])));

drop policy if exists discovery_snapshots_member_select on public.discovery_snapshots;
create policy discovery_snapshots_qira_select
on public.discovery_snapshots for select to authenticated
using ((select private.has_active_membership(discovery_snapshots.organization_id, array['qira_consultant','qira_admin'])));

drop policy if exists memberships_member_select on public.memberships;
create policy memberships_own_select
on public.memberships for select to authenticated
using (user_id = (select auth.uid()));
create policy memberships_qira_select
on public.memberships for select to authenticated
using ((select private.has_active_membership(memberships.organization_id, array['qira_consultant','qira_admin'])));

drop policy if exists discoveries_member_select on public.discoveries;
create policy discoveries_qira_select
on public.discoveries for select to authenticated
using ((select private.has_active_membership(discoveries.organization_id, array['qira_consultant','qira_admin'])));
create policy discoveries_prospect_own_select
on public.discoveries for select to authenticated
using (
  created_by = (select auth.uid())
  and (select private.has_active_membership(discoveries.organization_id, array['prospect_member']))
);
