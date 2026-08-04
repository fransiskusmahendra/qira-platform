alter table public.evidence
  add column scan_provider text,
  add column scan_reference text,
  add column scanned_by uuid references auth.users(id),
  add column scanned_at timestamptz;

revoke update on public.evidence from authenticated;
grant update (scan_status, scan_provider, scan_reference, scanned_by, scanned_at)
  on public.evidence to authenticated;

drop policy if exists evidence_member_insert on public.evidence;
create policy evidence_member_insert
on public.evidence for insert to authenticated
with check (
  evidence.uploaded_by = (select auth.uid())
  and (select private.has_active_membership(evidence.organization_id))
  and exists (
    select 1 from public.discoveries d
    where d.id = evidence.discovery_id
      and d.organization_id = evidence.organization_id
  )
);

create policy evidence_admin_scan_update
on public.evidence for update to authenticated
using ((select private.has_active_membership(evidence.organization_id, array['qira_admin'])))
with check (
  evidence.scanned_by = (select auth.uid())
  and evidence.scanned_at is not null
  and length(trim(coalesce(evidence.scan_provider, ''))) between 2 and 80
  and length(trim(coalesce(evidence.scan_reference, ''))) between 2 and 200
  and evidence.scan_status in ('clean', 'quarantined', 'failed')
  and (select private.has_active_membership(evidence.organization_id, array['qira_admin']))
);

drop policy if exists evidence_object_select on storage.objects;
create policy evidence_object_select
on storage.objects for select to authenticated
using (
  storage.objects.bucket_id = 'discovery-evidence'
  and exists (
    select 1 from public.evidence e
    where e.object_path = storage.objects.name
      and e.scan_status = 'clean'
      and (select private.has_active_membership(e.organization_id))
  )
);
