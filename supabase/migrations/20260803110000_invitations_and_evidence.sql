create table public.invitations (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null, role text not null check (role in ('prospect_member','client_viewer','client_member')),
  token_hash text not null unique, status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  invited_by uuid not null references auth.users(id), expires_at timestamptz not null, accepted_by uuid references auth.users(id),
  created_at timestamptz not null default now(), accepted_at timestamptz,
  unique (organization_id, email, status)
);
alter table public.invitations enable row level security;
grant select, insert, update on public.invitations to authenticated;
create policy invitations_admin_all on public.invitations for all to authenticated
using ((select private.has_active_membership(organization_id, array['qira_admin'])))
with check (invited_by = (select auth.uid()) and (select private.has_active_membership(organization_id, array['qira_admin'])));
create policy invitations_recipient_select on public.invitations for select to authenticated
using (lower(email) = lower((select auth.jwt()->>'email')) and status = 'pending' and expires_at > now());
create policy invitations_recipient_update on public.invitations for update to authenticated
using (lower(email)=lower((select auth.jwt()->>'email')) and status='pending' and expires_at>now())
with check (accepted_by=(select auth.uid()) and status='accepted');
create policy memberships_invited_insert on public.memberships for insert to authenticated with check (
  user_id=(select auth.uid()) and status='active' and exists (
    select 1 from public.invitations i where i.organization_id=memberships.organization_id
    and lower(i.email)=lower((select auth.jwt()->>'email')) and i.role=memberships.role and i.status='pending' and i.expires_at>now()
  )
);
create or replace function public.accept_invitation(invitation_token text) returns uuid language plpgsql security invoker set search_path='' as $$
declare i public.invitations;
begin
  select * into i from public.invitations where token_hash=encode(extensions.digest(invitation_token,'sha256'),'hex')
    and lower(email)=lower((select auth.jwt()->>'email')) and status='pending' and expires_at>now() for update;
  if i.id is null then raise exception 'Invitation is invalid or expired'; end if;
  insert into public.memberships(organization_id,user_id,role,status) values(i.organization_id,(select auth.uid()),i.role,'active');
  update public.invitations set status='accepted',accepted_by=(select auth.uid()),accepted_at=now() where id=i.id;
  return i.organization_id;
end $$;
revoke all on function public.accept_invitation(text) from public,anon;
grant execute on function public.accept_invitation(text) to authenticated;

create table public.evidence (
  id uuid primary key default gen_random_uuid(), discovery_id uuid not null references public.discoveries(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade, object_path text not null unique,
  original_name text not null, mime_type text not null, size_bytes bigint not null check (size_bytes between 1 and 20971520),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'), uploaded_by uuid not null references auth.users(id),
  scan_status text not null default 'pending' check (scan_status in ('pending','clean','quarantined','failed')), created_at timestamptz not null default now()
);
alter table public.evidence enable row level security;
grant select, insert on public.evidence to authenticated;
create policy evidence_member_select on public.evidence for select to authenticated using ((select private.has_active_membership(organization_id)));
create policy evidence_member_insert on public.evidence for insert to authenticated with check (
  uploaded_by = (select auth.uid()) and (select private.has_active_membership(organization_id))
  and exists (select 1 from public.discoveries d where d.id = discovery_id and d.organization_id = organization_id)
);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('discovery-evidence','discovery-evidence',false,20971520,array['application/pdf','image/png','image/jpeg','text/plain'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy evidence_object_insert on storage.objects for insert to authenticated with check (
  bucket_id='discovery-evidence' and (select private.has_active_membership(((storage.foldername(name))[1])::uuid))
);
create policy evidence_object_select on storage.objects for select to authenticated using (
  bucket_id='discovery-evidence' and (select private.has_active_membership(((storage.foldername(name))[1])::uuid))
);
create policy evidence_object_delete on storage.objects for delete to authenticated using (
  bucket_id='discovery-evidence' and owner_id=(select auth.uid()::text)
);
