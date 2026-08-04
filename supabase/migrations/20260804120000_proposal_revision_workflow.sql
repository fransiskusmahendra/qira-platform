create or replace function public.create_proposal_revision(
  target_proposal_id uuid,
  revised_terms jsonb,
  valid_through date
)
returns public.proposals
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  current_row public.proposals;
  revised_row public.proposals;
  decision_id uuid;
begin
  if actor is null then raise exception 'Authentication required'; end if;

  select * into current_row
  from public.proposals
  where id = target_proposal_id
  for update;

  if current_row.id is null then raise exception 'Proposal not found'; end if;
  if current_row.status <> 'shared' then raise exception 'Only a shared proposal can be revised'; end if;
  if not (select private.has_active_membership(
    current_row.organization_id,
    array['qira_consultant', 'qira_admin']
  )) then raise exception 'Revision permission denied'; end if;

  select id into decision_id
  from public.proposal_client_decisions
  where proposal_id = current_row.id
    and proposal_version = current_row.version
    and decision = 'revision_requested';

  if decision_id is null then raise exception 'Client revision request not found'; end if;
  if valid_through < current_date then raise exception 'Validity date cannot be in the past'; end if;
  if jsonb_typeof(revised_terms) <> 'object'
    or coalesce((revised_terms ->> 'basePriceIdr')::numeric, -1) < 0
    or coalesce((revised_terms ->> 'discountPercent')::numeric, -1) not between 0 and 100
    or coalesce((revised_terms ->> 'taxPercent')::numeric, -1) not between 0 and 100
    or coalesce((revised_terms ->> 'downPaymentPercent')::numeric, -1) not between 0 and 100
  then raise exception 'Invalid commercial terms'; end if;

  update public.proposals
  set version = current_row.version + 1,
      status = 'draft',
      commercial_terms = revised_terms,
      valid_until = valid_through,
      approved_by = null,
      approved_at = null,
      updated_at = now()
  where id = current_row.id
  returning * into revised_row;

  insert into public.proposal_versions (
    proposal_id, organization_id, version, snapshot, created_by
  ) values (
    revised_row.id, revised_row.organization_id, revised_row.version,
    to_jsonb(revised_row), actor
  );

  insert into public.audit_events (
    organization_id, actor_id, action, resource_type, resource_id, result, reason
  ) values (
    revised_row.organization_id, actor, 'proposal.revision.created',
    'proposal', revised_row.id, 'success',
    'client_decision=' || decision_id::text || ';from_version=' || current_row.version::text
  );

  return revised_row;
end;
$$;

revoke all on function public.create_proposal_revision(uuid, jsonb, date) from public, anon;
grant execute on function public.create_proposal_revision(uuid, jsonb, date) to authenticated;
