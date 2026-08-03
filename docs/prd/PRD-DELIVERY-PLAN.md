# QIRA Product Delivery Plan

**Version:** 1.0.0
**Status:** Active
**Owner:** QIRA Founder
**Last Updated:** 2026-08-03

## Product principle

The 55 PRDs are a strategic backlog, not 55 simultaneous commitments. QIRA completes one measurable customer journey before expanding the platform.

## Active value stream

`Visitor → Qualified Discovery → Reviewed Proposal → Client Workspace → Project Delivery`

## Delivery order

| Stage | Canonical PRD | Release outcome | Exit gate |
|---:|---|---|---|
| 1 | PRD-0001 Public Platform | Visitor understands QIRA and starts Discovery | Conversion events measured; mobile and accessibility checks pass |
| 2 | PRD-0004 Discovery Workspace | Prospect submits a structured, reviewable discovery | Complete record, scoring rationale, consent, and audit trail available |
| 3 | PRD-0006 AI Proposal Generator | QIRA produces a controlled proposal draft from approved discovery data | Human approval required; PDF output and version history verified |
| 4 | PRD-0005 Client Workspace | Client securely accesses approved proposal and project information | Tenant isolation and role permissions pass integration tests |

## Approval policy

- `Draft`: idea or incomplete specification; implementation is prohibited.
- `Review`: MVP contract is complete; business assumptions still require Product Owner confirmation.
- `Approved`: Product Owner accepts scope, metrics, risks, and commercial assumptions.
- `In Progress`: an Approved PRD has an active implementation branch.
- `Released`: acceptance criteria passed in production and metrics are being collected.
- `Superseded`: replaced by one or more named canonical PRDs.

## Deferred platform capabilities

IAM, notifications, search, analytics, AI gateway, observability, and integrations may be implemented only to the minimum extent required by the active value stream. Their full standalone PRDs remain deferred until repeated demand justifies a platform product.

## 90-day sequence

### Gate A — Foundation and public entry

- Merge executable foundation.
- Confirm QIRA positioning, legal identity, contact channel, and analytics consent.
- Release Public Platform preview and validate WhatsApp/Discovery conversion.

### Gate B — Discovery MVP

**Delivery status:** In Progress

- Implement organization profile, business goal, current process, pain point, target outcome, constraints, document upload, and consent.
- Produce deterministic readiness, opportunity, and complexity scores with explanations.
- Provide consultant review and approval.

### Gate C — Proposal MVP

- Generate a proposal from one approved Discovery version.
- Support assumptions, scope, deliverables, timeline, indicative pricing, payment terms, and risks.
- Require human approval before export or client sharing.

### Gate D — Client access

- Provide invitation-based access to approved proposal, documents, status, and timeline.
- Validate organization isolation and audit history.
