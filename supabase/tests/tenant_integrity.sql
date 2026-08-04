-- Read-only production/recovery integrity checks. Every violation count must be zero.
select
  (select count(*) from public.evidence e
    join public.discoveries d on d.id = e.discovery_id
    where e.organization_id <> d.organization_id) as evidence_tenant_violations,
  (select count(*) from public.proposals p
    join public.discoveries d on d.id = p.discovery_id
    where p.organization_id <> d.organization_id) as proposal_tenant_violations,
  (select count(*) from public.proposals p
    where p.status = 'shared'
      and (p.approved_by is null or p.approved_at is null)) as unapproved_shared_proposals,
  (select count(*) from public.evidence e
    where e.scan_status = 'clean'
      and (e.scan_provider is null or e.scan_reference is null or e.scanned_by is null or e.scanned_at is null)) as incomplete_clean_scan_records;
