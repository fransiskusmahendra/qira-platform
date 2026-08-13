create or replace function public.onboard_managed_customer(
  p_customer_name text,
  p_customer_type text,
  p_contact_name text,
  p_contact_email text,
  p_contact_whatsapp text,
  p_project_name text,
  p_package_id text,
  p_management_model text,
  p_monthly_amount_idr bigint default 0
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org_id uuid := gen_random_uuid();
  v_customer_id uuid;
  v_project_id uuid;
  v_slug text;
begin
  if auth.uid() is null or not exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('qira_admin','qira_consultant')
  ) then
    raise exception 'Not authorized';
  end if;

  if char_length(trim(p_customer_name)) not between 2 and 160
    or char_length(trim(p_project_name)) not between 2 and 180 then
    raise exception 'Customer and project names are required';
  end if;

  v_slug := trim(both '-' from regexp_replace(lower(trim(p_customer_name)), '[^a-z0-9]+', '-', 'g'))
    || '-' || left(replace(v_org_id::text, '-', ''), 8);

  insert into public.organizations (id, name, slug, status)
  values (v_org_id, trim(p_customer_name), v_slug, 'active');

  insert into public.customers (
    organization_id, display_name, customer_type, lifecycle_status,
    primary_contact_name, primary_contact_email, primary_contact_whatsapp
  ) values (
    v_org_id, trim(p_customer_name), p_customer_type, 'onboarding',
    nullif(trim(p_contact_name), ''), nullif(trim(p_contact_email), ''),
    nullif(trim(p_contact_whatsapp), '')
  ) returning id into v_customer_id;

  insert into public.managed_projects (
    customer_id, name, package_id, management_model, service_status, started_on
  ) values (
    v_customer_id, trim(p_project_name), p_package_id,
    p_management_model, 'onboarding', current_date
  ) returning id into v_project_id;

  if p_monthly_amount_idr > 0 then
    insert into public.project_subscriptions (
      project_id, name, billing_cycle, amount_idr, status, started_on, next_billing_on
    ) values (
      v_project_id, 'Managed service QIRA', 'monthly',
      p_monthly_amount_idr, 'active', current_date, current_date + 1
    );
  end if;

  return v_project_id;
end;
$$;

revoke all on function public.onboard_managed_customer(text,text,text,text,text,text,text,text,bigint) from public;
grant execute on function public.onboard_managed_customer(text,text,text,text,text,text,text,text,bigint) to authenticated;
