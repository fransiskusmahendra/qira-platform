# DB-0003 — Backup and Restore Drill

**Status:** Ready for non-production execution  
**Owner:** QIRA Founder  
**Last Updated:** 2026-08-04

## Current evidence

- Supabase project `ylxvabmqekjxozlmbdew` is `ACTIVE_HEALTHY` in `ap-southeast-1` on PostgreSQL 17.
- Production migration history contains the customer email and evidence-scan enforcement migrations applied through the connected Supabase workflow.
- Schema integrity queries and Security Advisor are run after every DDL change.

## Safety rule

Never run a restore drill against the production project. A destructive restore requires an explicitly selected non-production target and Founder approval immediately before execution.

## Cost and production safety gate

- Never run a restore drill against the production project.
- As of 4 August 2026, a Supabase development branch for this organization costs US$0.01344/hour.
- Create a temporary branch only after explicit cost approval, then delete it after evidence is captured.
- If no non-production target is approved, record the drill as blocked rather than weakening this safety gate.

## Drill procedure

1. Create or designate an isolated non-production Supabase project.
2. Record source project, target project, start time, operator, and recovery objective.
3. Restore the latest approved backup or replay the complete migration set into the isolated target.
4. Verify required tables, functions, RLS policies, Storage bucket configuration, and migration versions.
5. Run `supabase/tests/tenant_integrity.sql` and the application test suite.
6. Validate one synthetic Discovery, proposal export, invitation, revocation, and client decision.
7. Record finish time, recovery duration, discrepancies, and remediation owner.
8. Delete or sanitize synthetic recovery data according to the test-data policy.

## Integrity assertions

- No evidence row references a Discovery from another organization.
- No proposal references a Discovery or snapshot from another organization.
- No accepted invitation lacks the matching active membership unless that membership was explicitly revoked.
- Every shared proposal has a human approver and approval timestamp.
- Every evidence download-eligible row has status `clean`, scan provider, reference, scanner actor, and timestamp.

## Exit criteria

The recovery gate passes only when the isolated target serves the synthetic end-to-end workflow, tenant integrity returns zero violations, and actual recovery time is recorded. Until a non-production target is authorized, this gate remains `Ready`, not `Passed`.

## Latest production integrity evidence

On 2026-08-04, the read-only assertions returned zero evidence tenant violations, zero proposal tenant violations, zero unapproved shared proposals, and zero incomplete clean-scan records. This validates current integrity but does not replace a restore drill.
