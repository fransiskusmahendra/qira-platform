create table if not exists public.public_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  business_name text not null check (char_length(trim(business_name)) between 2 and 160),
  whatsapp text not null check (whatsapp ~ '^[0-9+() -]{8,24}$'),
  email text check (email is null or char_length(email) <= 254),
  package_interest text not null check (package_interest in ('digital-foundation','growth-engine','connected-growth','custom')),
  business_need text not null check (char_length(trim(business_need)) between 20 and 2000),
  budget_range text not null check (char_length(trim(budget_range)) between 2 and 80),
  source text not null default 'website',
  lead_temperature text not null default 'warm' check (lead_temperature in ('warm','hot')),
  status text not null default 'new' check (status in ('new','contacted','qualified','archived')),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.public_leads enable row level security;

revoke all on table public.public_leads from anon, authenticated;
grant insert on table public.public_leads to anon, authenticated;
grant select, update on table public.public_leads to authenticated;

create policy "public can submit a bounded lead"
on public.public_leads
for insert
to anon, authenticated
with check (
  source = 'website'
  and status = 'new'
  and lead_temperature in ('warm','hot')
  and consented_at <= now()
  and consented_at > now() - interval '10 minutes'
);

create policy "qira team can read public leads"
on public.public_leads
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('qira_admin','qira_consultant')
  )
);

create policy "qira team can update public leads"
on public.public_leads
for update
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('qira_admin','qira_consultant')
  )
)
with check (
  exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('qira_admin','qira_consultant')
  )
);

create index if not exists public_leads_created_at_idx on public.public_leads (created_at desc);
create index if not exists public_leads_status_idx on public.public_leads (status, lead_temperature, created_at desc);
