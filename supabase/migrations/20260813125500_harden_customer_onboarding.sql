alter function public.onboard_managed_customer(text,text,text,text,text,text,text,text,bigint) security invoker;

grant insert on public.organizations to authenticated;

create policy "qira team creates customer organizations"
on public.organizations
for insert
to authenticated
with check (
  exists (
    select 1 from public.memberships m
    where m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('qira_admin','qira_consultant')
  )
);
