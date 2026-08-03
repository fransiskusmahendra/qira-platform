# DB-0002 — Supabase Activation Runbook

**Status:** Development schema active
**Target:** Supabase PostgreSQL + Auth
**Last Updated:** 2026-08-03

## Outcome

This runbook records how the tested QIRA persistence contracts are activated in the existing Supabase development project. No new paid project was created.

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

The development project now also contains:

- the active organization `QIRA — PT Rays Solusi Informasi`;
- `create_proposal`, an atomic security-invoker function that creates the proposal, first snapshot, and audit event;
- `transition_proposal`, an atomic security-invoker function enforcing `draft → review → approved → shared`;
- database constraints for non-blank client/recipient names and valid package, price, discount, tax, and DP values.

Both functions are executable by `authenticated` only, remain subject to RLS, and are denied to `anon`.

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

1. Use the existing development project in `ap-southeast-1`.
2. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; keep secret keys server-only.
3. Generate the migration using the pinned Supabase CLI rather than inventing a migration filename.
4. Pull the active schema into migration history and review it before production.
5. Test anonymous denial, same-tenant access, cross-tenant denial, role denial, approval, version immutability, and audit immutability.
6. Run Supabase security and performance advisors; resolve findings before production.

## Current environment note

The development schema is active and generated TypeScript types are committed. The pinned Supabase CLI native binary still terminates with `SIGTRAP` in the Codex sandbox, so migration history must be reconciled with `supabase db pull` from Mahendra's Windows environment before production. Security advisor is clean; remaining unused-index notices are expected while tables contain no business data.
