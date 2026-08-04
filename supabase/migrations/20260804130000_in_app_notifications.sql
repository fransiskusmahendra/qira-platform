create table public.notifications (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
  proposal_id uuid references public.proposals(id), kind text not null check (kind in ('proposal_accepted','proposal_revision_requested')),
  title text not null, body text not null, email_status text not null default 'unconfigured' check (email_status in ('unconfigured','pending','sent','failed')),
  created_at timestamptz not null default now(), read_at timestamptz
);
create index notifications_org_created_idx on public.notifications (organization_id, created_at desc);
alter table public.notifications enable row level security;
grant select, update on public.notifications to authenticated;
revoke insert, delete on public.notifications from authenticated, anon;
create policy notifications_qira_select on public.notifications for select to authenticated
using ((select private.has_active_membership(notifications.organization_id,array['qira_consultant','qira_admin'])));
create policy notifications_qira_update on public.notifications for update to authenticated
using ((select private.has_active_membership(notifications.organization_id,array['qira_consultant','qira_admin'])))
with check ((select private.has_active_membership(notifications.organization_id,array['qira_consultant','qira_admin'])));

create or replace function private.enqueue_proposal_decision_notification() returns trigger
language plpgsql security definer set search_path = '' as $$
declare p public.proposals;
begin
  select * into p from public.proposals where id=new.proposal_id;
  insert into public.notifications (organization_id,proposal_id,kind,title,body)
  values (new.organization_id,new.proposal_id,
    case when new.decision='accepted' then 'proposal_accepted' else 'proposal_revision_requested' end,
    case when new.decision='accepted' then 'Proposal diterima klien' else 'Klien meminta revisi' end,
    p.proposal_number || ' · ' || p.client_name || case when new.comment is null then '' else ' · ' || new.comment end);
  return new;
end; $$;
revoke all on function private.enqueue_proposal_decision_notification() from public, anon, authenticated;
create trigger proposal_decision_notification after insert on public.proposal_client_decisions
for each row execute function private.enqueue_proposal_decision_notification();
