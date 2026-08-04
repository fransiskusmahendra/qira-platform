grant update (status, updated_at) on public.memberships to authenticated;

create policy memberships_admin_update
on public.memberships for update to authenticated
using (
  memberships.user_id <> (select auth.uid())
  and (select private.has_active_membership(memberships.organization_id, array['qira_admin']))
)
with check (
  memberships.user_id <> (select auth.uid())
  and memberships.status in ('active', 'suspended')
  and (select private.has_active_membership(memberships.organization_id, array['qira_admin']))
);

create function public.revoke_membership(
  target_organization_id uuid,
  target_user_id uuid,
  revocation_reason text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  changed integer;
begin
  if actor is null then raise exception 'Authentication required'; end if;
  if actor = target_user_id then raise exception 'Self revocation is not permitted'; end if;
  if length(trim(coalesce(revocation_reason, ''))) < 5 then raise exception 'Revocation reason is required'; end if;
  if not (select private.has_active_membership(target_organization_id, array['qira_admin'])) then
    raise exception 'Revocation permission denied';
  end if;

  update public.memberships
  set status = 'suspended', updated_at = now()
  where organization_id = target_organization_id
    and user_id = target_user_id
    and status = 'active';
  get diagnostics changed = row_count;
  if changed <> 1 then raise exception 'Active membership not found'; end if;

  insert into public.audit_events (organization_id, actor_id, action, resource_type, resource_id, result, reason)
  values (target_organization_id, actor, 'membership.revoked', 'membership', target_user_id, 'success', trim(revocation_reason));
  return true;
end;
$$;

revoke all on function public.revoke_membership(uuid, uuid, text) from public, anon;
grant execute on function public.revoke_membership(uuid, uuid, text) to authenticated;
