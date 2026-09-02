-- QIRA production hardening: analytics coverage, faster RLS, and idempotent operational notifications.

alter table public.conversion_events
  drop constraint if exists conversion_events_event_name_check;

alter table public.conversion_events
  add constraint conversion_events_event_name_check
  check (event_name = any (array[
    'landing_view'::text,
    'story_start'::text,
    'story_complete'::text,
    'discovery_start'::text,
    'discovery_submit'::text,
    'problem_select'::text,
    'pricing_view'::text,
    'portfolio_view'::text,
    'lead_submit'::text
  ]));

drop policy if exists qira_staff_read_conversion_events on public.conversion_events;

create policy qira_staff_read_conversion_events
on public.conversion_events
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role = any (array['qira_admin'::text, 'qira_consultant'::text])
  )
);

alter table public.notifications
  drop constraint if exists notifications_kind_check;

alter table public.notifications
  add constraint notifications_kind_check
  check (kind = any (array[
    'proposal_accepted'::text,
    'proposal_revision_requested'::text,
    'lead_new'::text,
    'lead_follow_up'::text,
    'proposal_follow_up'::text,
    'proposal_expiring'::text
  ]));

alter table public.notifications
  add column if not exists dedupe_key text;

alter table public.notifications
  add constraint notifications_dedupe_key_length_check
  check (dedupe_key is null or char_length(dedupe_key) between 3 and 200);

alter table public.notifications
  add constraint notifications_dedupe_key_key unique (dedupe_key);
