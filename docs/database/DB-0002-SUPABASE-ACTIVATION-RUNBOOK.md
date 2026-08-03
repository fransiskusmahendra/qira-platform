# DB-0002 — Supabase Activation Runbook

**Status:** Ready for project selection  
**Target:** Supabase PostgreSQL + Auth  
**Last Updated:** 2026-08-03

## Outcome

This runbook turns the tested QIRA persistence contracts into a live multi-tenant database after a Supabase project is selected. It intentionally does not create a paid project or apply production DDL without the Founder selecting the organization, region, and cost.

## MVP identity and authorization

| Role | Proposal read | Proposal edit | Proposal approve |
|---|---:|---:|---:|
| Prospect/client member | Yes | No | No |
| QIRA consultant | Yes | Yes | Yes |
| QIRA admin | Yes | Yes | Yes |

- Supabase Auth is the identity provider.
- Membership rows, not user-editable metadata, are authoritative for tenant and role access.
- Every proposal, proposal version, and audit event carries `organization_id`.
- Approval requires `review` status and records actor plus timestamp.
- Proposal versions and audit events are append-only.

## Tables for the first live migration

1. `organizations`
2. `memberships`
3. `discoveries` and their existing version/response/score tables
4. `proposals`
5. `proposal_versions`
6. `audit_events`

The `proposals` table stores client recipient data, proposal dates, status, version, and commercial terms. `proposal_versions.snapshot` stores an immutable JSONB snapshot so a printed proposal remains reproducible.

## RLS acceptance criteria

- Enable and force RLS on every exposed tenant table.
- Policies target `authenticated` and verify an active membership using `(select auth.uid())` plus the row's `organization_id`.
- Proposal writes require a `qira_consultant` or `qira_admin` membership.
- Proposal approval additionally requires current status `review`.
- Updates use both `USING` and `WITH CHECK`.
- Anonymous requests receive no tenant rows.
- Cross-tenant identifier access returns no row and cannot mutate data.
- No browser bundle receives a secret or service-role key.

## Activation sequence

1. Select the Supabase organization and Jakarta-nearest available region (`ap-southeast-1`).
2. Confirm project cost before creation.
3. Create an isolated development branch or non-production project.
4. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; keep secret keys server-only.
5. Generate the migration using the pinned Supabase CLI rather than inventing a migration filename.
6. Apply the schema, generate TypeScript types, and wire an adapter implementing `ProposalRepository`.
7. Test anonymous denial, same-tenant access, cross-tenant denial, role denial, approval, version immutability, and audit immutability.
8. Run Supabase security and performance advisors; resolve findings before production.

## Current environment note

The pinned Supabase CLI native binary still terminates with `SIGTRAP` in the Codex sandbox. Therefore no unverified migration file is committed in this batch. The domain and persistence behavior is covered by automated tests and is ready to map onto a selected Supabase development environment.
