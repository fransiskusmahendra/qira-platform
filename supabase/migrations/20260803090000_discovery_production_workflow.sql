create or replace function public.save_discovery_draft(
  target_organization_id uuid,
  target_discovery_id uuid,
  selected_service_ids text[],
  response_payload jsonb,
  score_payload jsonb
)
returns setof public.discoveries
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_discovery public.discoveries;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;
  if not (select private.has_active_membership(target_organization_id, array['prospect_member','qira_consultant','qira_admin'])) then
    raise exception 'Active organization membership required';
  end if;
  if coalesce(array_length(selected_service_ids, 1), 0) = 0 then
    raise exception 'At least one service is required';
  end if;
  if jsonb_typeof(response_payload) <> 'object' or jsonb_typeof(score_payload) <> 'array' then
    raise exception 'Invalid Discovery payload';
  end if;

  if target_discovery_id is null then
    insert into public.discoveries (organization_id, created_by, service_ids, responses, scores)
    values (target_organization_id, (select auth.uid()), selected_service_ids, response_payload, score_payload)
    returning * into current_discovery;
  else
    update public.discoveries
       set service_ids = selected_service_ids,
           responses = response_payload,
           scores = score_payload,
           updated_at = now()
     where id = target_discovery_id
       and organization_id = target_organization_id
       and status = 'draft'
    returning * into current_discovery;
    if current_discovery.id is null then
      raise exception 'Editable Discovery draft not found';
    end if;
  end if;
  return next current_discovery;
end;
$$;

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
begin
  select * into current_discovery
  from public.discoveries
  where id = target_discovery_id;
  if current_discovery.id is null then raise exception 'Discovery not found'; end if;

  if current_discovery.status = 'draft' and target_status = 'submitted' then
    permitted := (select private.has_active_membership(current_discovery.organization_id, array['qira_consultant','qira_admin']));
    if coalesce((current_discovery.responses -> '_consent' ->> 'accepted')::boolean, false) is not true then
      raise exception 'Explicit consent is required';
    end if;
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

  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (current_discovery.organization_id, (select auth.uid()), 'discovery.' || target_status, 'discovery', current_discovery.id, 'success', transition_reason);
  return next current_discovery;
end;
$$;

revoke all on function public.save_discovery_draft(uuid, uuid, text[], jsonb, jsonb) from public, anon;
revoke all on function public.transition_discovery(uuid, text, text) from public, anon;
grant execute on function public.save_discovery_draft(uuid, uuid, text[], jsonb, jsonb) to authenticated;
grant execute on function public.transition_discovery(uuid, text, text) to authenticated;
