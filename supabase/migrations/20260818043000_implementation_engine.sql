create table if not exists public.proposal_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  discovery_id uuid not null references public.discoveries(id) on delete cascade,
  public_reference text not null,
  decision text not null check (decision in ('approved','revision_requested')),
  signer_name text not null check (char_length(signer_name) between 2 and 160),
  signer_email text,
  signer_whatsapp text not null,
  consent_version text not null default 'proposal-decision-v1',
  proposal_snapshot jsonb not null default '{}'::jsonb,
  blueprint_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists proposal_decisions_discovery_created_idx on public.proposal_decisions(discovery_id, created_at desc);

create table if not exists public.implementation_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  discovery_id uuid not null unique references public.discoveries(id) on delete cascade,
  decision_id uuid not null references public.proposal_decisions(id) on delete restrict,
  public_reference text not null unique,
  business_type_id text not null,
  business_name text not null,
  blueprint_snapshot jsonb not null,
  configuration jsonb not null default '{}'::jsonb,
  status text not null default 'awaiting_data' check (status in ('awaiting_data','data_review','ready_for_build','building','uat','live','revision_required')),
  access_token_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists implementation_workspaces_org_status_idx on public.implementation_workspaces(organization_id,status);

create table if not exists public.implementation_imports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.implementation_workspaces(id) on delete cascade,
  template_id text not null,
  file_name text not null,
  row_count integer not null default 0 check (row_count between 0 and 10000),
  status text not null default 'received' check (status in ('received','valid','invalid','imported')),
  validation jsonb not null default '{}'::jsonb,
  rows jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists implementation_imports_workspace_created_idx on public.implementation_imports(workspace_id,created_at desc);

alter table public.proposal_decisions enable row level security;
alter table public.implementation_workspaces enable row level security;
alter table public.implementation_imports enable row level security;
revoke all on public.proposal_decisions, public.implementation_workspaces, public.implementation_imports from anon, authenticated;
grant select, insert, update on public.proposal_decisions, public.implementation_workspaces, public.implementation_imports to authenticated;

create policy proposal_decisions_qira_team on public.proposal_decisions for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id=proposal_decisions.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.organization_id=proposal_decisions.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy implementation_workspaces_qira_team on public.implementation_workspaces for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id=implementation_workspaces.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.organization_id=implementation_workspaces.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
create policy implementation_imports_qira_team on public.implementation_imports for all to authenticated
using (exists (select 1 from public.memberships m where m.organization_id=implementation_imports.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')))
with check (exists (select 1 from public.memberships m where m.organization_id=implementation_imports.organization_id and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('qira_admin','qira_consultant')));
