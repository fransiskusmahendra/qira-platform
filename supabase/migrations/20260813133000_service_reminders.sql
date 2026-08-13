create table public.service_reminders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid references public.managed_projects(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('domain_expiry','subscription_due','project_review','ticket_due')),
  reminder_key text not null unique,
  title text not null check (char_length(trim(title)) between 3 and 180),
  body text not null check (char_length(trim(body)) between 3 and 1000),
  due_on date,
  severity text not null default 'normal' check (severity in ('normal','warning','urgent')),
  status text not null default 'open' check (status in ('open','dismissed','resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.service_reminders enable row level security;
revoke all on public.service_reminders from anon, authenticated;
grant select, update on public.service_reminders to authenticated;

create policy "qira team views service reminders"
on public.service_reminders for select to authenticated
using (exists (
  select 1 from public.memberships m
  where m.user_id=(select auth.uid()) and m.status='active'
    and m.role in ('qira_admin','qira_consultant')
));

create policy "qira team updates service reminders"
on public.service_reminders for update to authenticated
using (exists (
  select 1 from public.memberships m
  where m.user_id=(select auth.uid()) and m.status='active'
    and m.role in ('qira_admin','qira_consultant')
))
with check (exists (
  select 1 from public.memberships m
  where m.user_id=(select auth.uid()) and m.status='active'
    and m.role in ('qira_admin','qira_consultant')
));

create index service_reminders_open_due_idx on public.service_reminders(status,due_on) where status='open';
create index service_reminders_customer_idx on public.service_reminders(customer_id,created_at desc);
create index service_reminders_project_idx on public.service_reminders(project_id) where project_id is not null;
