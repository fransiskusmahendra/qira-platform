# ADR-0002 — MVP technology and commercial defaults

- Status: Accepted
- Date: 2026-08-03
- Owners: QIRA Founder
- Related PRDs: PRD-0001, PRD-0004, PRD-0005, PRD-0006

## Context

The Discovery-to-Proposal MVP requires explicit defaults for data services, AI routing, document handling, scoring validation, and commercial approval before implementation can begin.

## Decision

- Use Supabase PostgreSQL, Auth, and private Storage as the production target.
- Enforce tenant isolation in application policies and PostgreSQL Row Level Security on every exposed tenant table. Authorization derives from server-controlled membership data, never user-editable metadata.
- Use Ollama for local development and an OpenAI adapter for production, without allowing provider SDK types into domain logic.
- Retain client documents for the engagement duration plus two years, subject to contract or law requiring a different period.
- Limit MVP uploads to 20 MB per file and require private storage, validation, malware-scanning integration, and audit events.
- Export PDF first. DOCX is deferred.
- Start Discovery scoring with equal factor weights and recalibrate only after at least five reviewed cases.
- Use `50% DP / 50% after implementation` only as an explicitly selected default for early projects.
- Require QIRA Founder approval for prices, discounts, taxes, payment terms, and proposal sharing.
- Release the MVP in Bahasa Indonesia first.

## Consequences

Implementation can start with stable boundaries while QIRA retains the ability to replace AI providers. Supabase-specific access policies must be tested separately from application authorization. Retention deletion, malware scanning, and production provider data processing become launch gates rather than optional follow-up work.

## Alternatives considered

- Custom PostgreSQL, authentication, and object storage: deferred because it increases operational work for the current team.
- LLM-generated numeric scoring: rejected for the MVP because it is not reliably reproducible.
- Automatic proposal sharing: rejected because commercial and factual accountability remains human.
- Indefinite file retention: rejected because it increases privacy and security exposure.

## Security and data impact

All exposed Supabase tables require RLS and least-privilege grants. `service_role` credentials remain server-only. Storage objects are private and organization-scoped. RLS policies must verify active membership and resource organization; `TO authenticated` alone is insufficient authorization. Production data cannot be used for model training without explicit client authorization.

