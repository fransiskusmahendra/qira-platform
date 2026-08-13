alter table public.public_leads drop constraint if exists public_leads_status_check;
alter table public.public_leads
  add constraint public_leads_status_check
  check (status in ('new','contacted','discovery','demo','proposal','negotiation','won','lost','archived'));
alter table public.public_leads
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists last_contacted_at timestamptz,
  add column if not exists internal_notes text check (internal_notes is null or char_length(internal_notes) <= 4000);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete restrict,
  display_name text not null check (char_length(trim(display_name)) between 2 and 160),
  customer_type text not null default 'umkm' check (customer_type in ('umkm','company','enterprise')),
  lifecycle_status text not null default 'onboarding' check (lifecycle_status in ('onboarding','active','paused','offboarded')),
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_whatsapp text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.managed_projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 180),
  package_id text not null check (package_id in ('digital-foundation','growth-engine','connected-growth','custom')),
  management_model text not null default 'qira_managed' check (management_model in ('qira_managed','customer_managed','hybrid')),
  service_status text not null default 'onboarding' check (service_status in ('onboarding','active','attention','maintenance','suspended','offboarded')),
  repository_url text,
  production_url text,
  started_on date,
  launched_on date,
  next_review_on date,
  notes text check (notes is null or char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.managed_projects(id) on delete cascade,
  provider text not null default 'vercel' check (provider in ('vercel','customer_infrastructure','other')),
  environment text not null default 'production' check (environment in ('production','preview','staging','development')),
  deployment_ref text,
  deployment_url text,
  status text not null default 'unknown' check (status in ('queued','building','ready','error','cancelled','unknown')),
  deployed_at timestamptz,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.project_domains (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.managed_projects(id) on delete cascade,
  hostname text not null unique check (hostname ~ '^[a-z0-9.-]+$'),
  registrar text,
  ownership text not null default 'customer' check (ownership in ('customer','qira')),
  status text not null default 'pending' check (status in ('pending','active','expiring','expired','issue')),
  registered_on date,
  expires_on date,
  auto_renew boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_subscriptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.managed_projects(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','quarterly','annual','one_time')),
  amount_idr bigint not null default 0 check (amount_idr >= 0),
  status text not null default 'trial' check (status in ('trial','active','past_due','paused','cancelled')),
  started_on date,
  next_billing_on date,
  ended_on date,
  external_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid references public.managed_projects(id) on delete set null,
  ticket_number text not null unique,
  subject text not null check (char_length(trim(subject)) between 3 and 180),
  description text not null check (char_length(trim(description)) between 3 and 5000),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','waiting_customer','resolved','closed')),
  opened_at timestamptz not null default now(),
  due_at timestamptz,
  resolved_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers enable row level security;
alter table public.managed_projects enable row level security;
alter table public.project_deployments enable row level security;
alter table public.project_domains enable row level security;
alter table public.project_subscriptions enable row level security;
alter table public.support_tickets enable row level security;

revoke all on public.customers, public.managed_projects, public.project_deployments, public.project_domains, public.project_subscriptions, public.support_tickets from anon, authenticated;
grant select, insert, update on public.customers, public.managed_projects, public.project_deployments, public.project_domains, public.project_subscriptions, public.support_tickets to authenticated;

create policy "qira team manages customers" on public.customers for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view customer" on public.customers for select to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.organization_id=customers.organization_id and m.status='active'));

create policy "qira team manages projects" on public.managed_projects for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view projects" on public.managed_projects for select to authenticated
using (exists (select 1 from public.customers c join public.memberships m on m.organization_id=c.organization_id where c.id=managed_projects.customer_id and m.user_id=(select auth.uid()) and m.status='active'));

create policy "qira team manages deployments" on public.project_deployments for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view deployments" on public.project_deployments for select to authenticated
using (exists (select 1 from public.managed_projects p join public.customers c on c.id=p.customer_id join public.memberships m on m.organization_id=c.organization_id where p.id=project_deployments.project_id and m.user_id=(select auth.uid()) and m.status='active'));

create policy "qira team manages domains" on public.project_domains for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view domains" on public.project_domains for select to authenticated
using (exists (select 1 from public.managed_projects p join public.customers c on c.id=p.customer_id join public.memberships m on m.organization_id=c.organization_id where p.id=project_domains.project_id and m.user_id=(select auth.uid()) and m.status='active'));

create policy "qira team manages subscriptions" on public.project_subscriptions for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view subscriptions" on public.project_subscriptions for select to authenticated
using (exists (select 1 from public.managed_projects p join public.customers c on c.id=p.customer_id join public.memberships m on m.organization_id=c.organization_id where p.id=project_subscriptions.project_id and m.user_id=(select auth.uid()) and m.status='active'));

create policy "qira team manages tickets" on public.support_tickets for all to authenticated
using (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy "customer members view tickets" on public.support_tickets for select to authenticated
using (exists (select 1 from public.customers c join public.memberships m on m.organization_id=c.organization_id where c.id=support_tickets.customer_id and m.user_id=(select auth.uid()) and m.status='active'));

create index customers_lifecycle_idx on public.customers(lifecycle_status, updated_at desc);
create index managed_projects_customer_idx on public.managed_projects(customer_id, service_status);
create index managed_projects_review_idx on public.managed_projects(next_review_on) where service_status in ('active','attention','maintenance');
create index deployments_project_idx on public.project_deployments(project_id, environment, created_at desc);
create index deployments_status_idx on public.project_deployments(status, checked_at);
create index domains_project_idx on public.project_domains(project_id);
create index domains_expiry_idx on public.project_domains(expires_on) where status in ('active','expiring');
create index subscriptions_project_idx on public.project_subscriptions(project_id);
create index subscriptions_billing_idx on public.project_subscriptions(next_billing_on) where status in ('trial','active','past_due');
create index tickets_customer_idx on public.support_tickets(customer_id, status, opened_at desc);
create index tickets_project_idx on public.support_tickets(project_id) where project_id is not null;
create index tickets_due_idx on public.support_tickets(due_at) where status in ('open','in_progress','waiting_customer');
create index public_leads_follow_up_idx on public.public_leads(next_follow_up_at) where status not in ('won','lost','archived');
