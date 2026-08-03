# DB-0001 — Discovery Persistence Design

**Status:** Review  
**Target:** Supabase PostgreSQL  
**Last Updated:** 2026-08-03

## Purpose

Define the database boundary for Sprint 2 without treating an unverified SQL file as an executable migration. The official migration must be generated with Supabase CLI and tested against a local Supabase stack or an isolated branch database.

## Tables

| Table | Purpose | Tenant key |
|---|---|---|
| organizations | Client/prospect tenant | `id` |
| memberships | User role in an organization | `organization_id` |
| discoveries | Discovery aggregate and state | `organization_id` |
| discovery_versions | Immutable submitted/approved snapshots | `organization_id` |
| discovery_responses | Versioned question answers | `organization_id` |
| discovery_scores | Reproducible scoring output | `organization_id` |
| discovery_consents | Immutable purpose/text acceptance | `organization_id` |
| discovery_reviews | Consultant approval/reopen record | `organization_id` |
| audit_events | Append-only business/security history | `organization_id` |

## Data rules

- Use UUID identifiers for externally addressable resources and `timestamptz` for time.
- Every tenant table carries `organization_id`; foreign keys include or validate the same tenant boundary.
- Status and role values use text with check constraints so migrations can evolve without PostgreSQL enum locking concerns.
- Approved Discovery versions are immutable.
- Scores store `value`, factor JSON, and `ruleset_version`; numeric value is constrained to 0–100.
- Consent stores the exact text version, purpose, actor, and acceptance timestamp.
- Audit events cannot be updated or deleted through application roles.

## Required indexes

- Every foreign-key column is indexed.
- Membership lookup: `(user_id, organization_id, status)`.
- Discovery listing: `(organization_id, status, updated_at desc)`.
- Version lookup: unique `(discovery_id, version)` plus `(organization_id, discovery_id)`.
- Score lookup: `(organization_id, discovery_version_id, score_type)`.
- Audit lookup: `(organization_id, occurred_at desc)` and `(resource_type, resource_id, occurred_at desc)`.

## RLS policy contract

- RLS is enabled and forced on every tenant table in the exposed schema.
- Policies target `authenticated` and also verify an active membership row for `(auth.uid(), organization_id)`.
- `TO authenticated` alone is prohibited.
- Update policies define both `USING` and `WITH CHECK`.
- Authorization does not use `raw_user_meta_data` or other user-editable claims.
- QIRA administrative cross-tenant access is performed through an audited server use case, not a broad browser policy.
- The Supabase secret/service-role key is server-only and never placed in a `NEXT_PUBLIC_` variable.

## Storage contract

- Buckets for Discovery evidence and proposal exports are private.
- Object paths begin with the authoritative organization ID and resource ID.
- Storage RLS validates active membership and the organization path.
- Upload is limited to 20 MB and approved content types; object availability requires validation and malware-scanning status.
- Upsert is disabled for immutable evidence versions. A replacement creates a new object/version.

## Migration verification gate

Before an SQL migration can be committed:

1. Generate it using the pinned Supabase CLI.
2. Start or target an isolated non-production Supabase environment.
3. Apply the schema and run database advisors.
4. Test anonymous denial, same-tenant access, cross-tenant denial, update ownership protection, and audit immutability.
5. Verify foreign-key indexes and query plans for tenant listing.
6. Confirm migration list and rollback/recovery procedure.

## Current blocker

Supabase CLI `2.111.0` is pinned, but its native binary terminates with `SIGTRAP` in the Codex sandbox. The migration is intentionally deferred until it can be generated and verified on Mahendra's Windows development environment or an authenticated Supabase branch database.

