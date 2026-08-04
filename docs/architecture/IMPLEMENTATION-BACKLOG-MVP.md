# Discovery to Proposal MVP — Implementation Backlog

**Status:** Active
**Owner:** QIRA
**Last Updated:** 2026-08-04

This backlog turns the approved delivery sequence into independently demonstrable increments. Estimates are relative, not commercial commitments.

## Current delivery checkpoint

- MVP-001 through MVP-010 are implemented in the production path.
- MVP-012 through MVP-015 have a controlled, human-led implementation in production.
- MVP-011 AI provider integration is deferred without blocking the human-led proposal workflow.
- MVP-016 operational readiness is the active increment. See `docs/prd/MVP-RELEASE-READINESS.md`.

| ID | Increment | Evidence of completion | Size | Depends on |
|---|---|---|---:|---|
| MVP-001 | Domain state machines | Automated valid/invalid transition tests | S | — |
| MVP-002 | Organization and tenant context | Cross-tenant access tests fail closed | M | MVP-001 |
| MVP-003 | Invitation and membership | Single-use expiry and revocation tests | M | MVP-002 |
| MVP-004 | Discovery question schema | Versioned service-specific schema validates | M | MVP-001 |
| MVP-005 | Draft and resume | Prospect restores only its own draft | M | MVP-002, MVP-004 |
| MVP-006 | Consent and submission | Immutable consent and submitted version | S | MVP-005 |
| MVP-007 | Evidence metadata/upload | Private upload with validation and audit | M | MVP-002 |
| MVP-008 | Scoring rules | Reproducible scores with factor explanations | M | MVP-004 |
| MVP-009 | Consultant review | Approve/reopen with reason and audit | M | MVP-006, MVP-008 |
| MVP-010 | Approved snapshot contract | Checksum-stable handoff fixture | S | MVP-009 |
| MVP-011 | AI provider adapter | Mock and Ollama-compatible adapters satisfy contract | M | MVP-010 |
| MVP-012 | Proposal versioning | Generate/edit/regenerate without overwriting history | L | MVP-011 |
| MVP-013 | Commercial approval | Price change invalidates prior approval | M | MVP-012 |
| MVP-014 | PDF export | Approved data and checksum match rendered output | M | MVP-013 |
| MVP-015 | Client projection | Only shared approved content is visible | M | MVP-003, MVP-014 |
| MVP-016 | Operational readiness | CI, audit, backup restore, runbook, and launch gate pass | L | All |

## Current status by increment

| Increment | Status | Production evidence / remaining work |
|---|---|---|
| MVP-001–002 | Implemented | State-machine and tenant-boundary tests run in CI. |
| MVP-003 | Implemented; validation open | Invitation acceptance exists; revocation SLA test remains. |
| MVP-004–006 | Implemented | Dynamic Discovery, persisted draft, consent, and submission are deployed. |
| MVP-007 | Implemented; enforcement open | Private evidence upload and metadata exist; malware scanning must move from hook/status to enforced processing. |
| MVP-008–010 | Implemented | Deterministic scoring, consultant approval, and immutable snapshot handoff are deployed. |
| MVP-011 | Deferred | Human-led proposal creation remains the approved fallback until an AI provider adapter is evaluated. |
| MVP-012–015 | Implemented MVP subset | Versioning, commercial approval, PDF export, client projection, decisions, and activity tracking are deployed. AI regeneration remains deferred. |
| MVP-016 | In Progress | Production smoke tests, backup-restore evidence, monitoring, KPI events, and launch sign-off remain. |

## Active operational sprint

- Execute the authenticated production smoke-test matrix.
- Prove backup restore and record the recovery evidence.
- Enforce evidence malware-scan state before consultant download/use.
- Add measurable funnel events for Discovery completion and proposal sharing.
- Complete domain verification and one email-delivery test only after `myqira.io` is active.

The sprint demo should show a synthetic prospect completing Discovery, a consultant approving and sharing a proposal, a client responding, all audit events remaining tenant-isolated, and operational evidence attached to the release checklist.
