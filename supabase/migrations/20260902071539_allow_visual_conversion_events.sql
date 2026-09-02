-- Keep privacy-first conversion analytics aligned with public website interactions.

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
    'lead_submit'::text,
    'hero_explainer_interact'::text,
    'solution_explore'::text,
    'before_after_interact'::text,
    'application_example_interact'::text,
    'homepage_cta_click'::text,
    'whatsapp_request_click'::text,
    'service_view'::text
  ]));
