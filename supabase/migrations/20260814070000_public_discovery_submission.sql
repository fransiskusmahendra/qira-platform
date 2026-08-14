alter table public.discoveries
  alter column created_by drop not null,
  add column if not exists public_lead_id uuid references public.public_leads(id) on delete restrict,
  add column if not exists public_reference text unique;

alter table public.audit_events
  alter column actor_id drop not null;

create unique index if not exists discoveries_public_lead_idx
  on public.discoveries(public_lead_id)
  where public_lead_id is not null;

create or replace function public.submit_public_discovery(
  p_full_name text,
  p_business_name text,
  p_whatsapp text,
  p_email text,
  p_service_id text,
  p_responses jsonb,
  p_scores jsonb
)
returns table(lead_id uuid, discovery_id uuid, reference text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_organization_id uuid;
  v_lead_id uuid;
  v_discovery_id uuid;
  v_reference text;
  v_business_need text;
  v_budget_range text;
  v_lead_temperature text;
begin
  if current_user <> 'service_role' then
    raise exception 'Service role required';
  end if;

  p_full_name := trim(coalesce(p_full_name, ''));
  p_business_name := trim(coalesce(p_business_name, ''));
  p_whatsapp := trim(coalesce(p_whatsapp, ''));
  p_email := nullif(lower(trim(coalesce(p_email, ''))), '');

  if char_length(p_full_name) not between 2 and 100
    or char_length(p_business_name) not between 2 and 160
    or p_whatsapp !~ '^[0-9+() -]{8,24}$'
    or (p_email is not null and (char_length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
  then
    raise exception 'Invalid contact details';
  end if;

  if p_service_id not in ('ai-employees','automation','business-apps','discovery')
    or jsonb_typeof(p_responses) <> 'object'
    or jsonb_typeof(p_scores) <> 'array'
    or jsonb_array_length(p_scores) <> 3
    or coalesce((p_responses -> '_consent' ->> 'accepted')::boolean, false) is not true
  then
    raise exception 'Invalid Discovery payload';
  end if;

  v_business_need := left(
    concat_ws(E'\n\n',
      nullif(trim(p_responses ->> 'business_goal'), ''),
      nullif(trim(p_responses ->> 'current_process'), ''),
      nullif(trim(p_responses ->> 'pain_point'), '')
    ),
    2000
  );
  if char_length(v_business_need) < 20 then
    raise exception 'Discovery answers are incomplete';
  end if;

  v_budget_range := left(coalesce(nullif(trim(p_responses ->> 'budget_range'), ''), 'Belum ditentukan'), 80);
  v_lead_temperature := case
    when v_budget_range <> 'Belum ditentukan' and char_length(v_business_need) >= 80 then 'hot'
    else 'warm'
  end;

  select o.id into v_organization_id
  from public.organizations o
  where o.slug = 'qira'
    and o.status = 'active'
    and exists (
      select 1 from public.memberships m
      where m.organization_id = o.id
        and m.role = 'qira_admin'
        and m.status = 'active'
    )
  limit 1;
  if v_organization_id is null then
    raise exception 'QIRA organization is unavailable';
  end if;

  if exists (
    select 1 from public.public_leads l
    where regexp_replace(l.whatsapp, '[^0-9]', '', 'g') = regexp_replace(p_whatsapp, '[^0-9]', '', 'g')
      and l.source = 'discovery'
      and l.created_at > now() - interval '10 minutes'
  ) then
    raise exception 'Discovery was submitted recently';
  end if;

  insert into public.public_leads (
    full_name, business_name, whatsapp, email, package_interest,
    business_need, budget_range, source, lead_temperature, status,
    consented_at, next_follow_up_at, internal_notes
  ) values (
    p_full_name, p_business_name, p_whatsapp, p_email, 'custom',
    v_business_need, v_budget_range, 'discovery', v_lead_temperature, 'discovery',
    now(), now() + interval '1 day',
    'Discovery publik dikirim langsung oleh customer. Review jawaban sebelum membuat proposal.'
  ) returning id into v_lead_id;

  v_reference := 'QIRA-DISC-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 8));
  insert into public.discoveries (
    organization_id, created_by, public_lead_id, public_reference,
    service_ids, responses, scores, status
  ) values (
    v_organization_id, null, v_lead_id, v_reference,
    array[p_service_id], p_responses, p_scores, 'submitted'
  ) returning id into v_discovery_id;

  insert into public.audit_events (
    organization_id, actor_id, action, resource_type, resource_id, result, reason
  ) values (
    v_organization_id, null, 'discovery.public_submitted', 'discovery',
    v_discovery_id, 'success', 'Public customer submission without login'
  );

  return query select v_lead_id, v_discovery_id, v_reference;
end;
$$;

revoke all on function public.submit_public_discovery(text,text,text,text,text,jsonb,jsonb)
  from public, anon, authenticated;
grant execute on function public.submit_public_discovery(text,text,text,text,text,jsonb,jsonb)
  to service_role;

