create table if not exists public.conversion_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in (
    'landing_view',
    'story_start',
    'story_complete',
    'discovery_start',
    'discovery_submit'
  )),
  path text not null check (char_length(path) between 1 and 160),
  occurred_at timestamptz not null default now()
);

create index if not exists conversion_events_occurred_at_idx
  on public.conversion_events (occurred_at desc);

create index if not exists conversion_events_event_name_occurred_at_idx
  on public.conversion_events (event_name, occurred_at desc);

alter table public.conversion_events enable row level security;

revoke all on table public.conversion_events from anon;
revoke all on table public.conversion_events from authenticated;
grant select on table public.conversion_events to authenticated;

drop policy if exists qira_staff_read_conversion_events on public.conversion_events;
create policy qira_staff_read_conversion_events
  on public.conversion_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.memberships m
      where m.user_id = auth.uid()
        and m.status = 'active'
        and m.role in ('qira_admin', 'qira_consultant')
    )
  );

comment on table public.conversion_events is
  'Privacy-first public-site funnel events. Stores event name, route path, and timestamp only; no name, email, WhatsApp, IP address, user agent, or persistent visitor identifier.';
