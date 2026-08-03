# Discovery to Proposal MVP — Implementation Backlog

**Status:** Active
**Owner:** QIRA
**Last Updated:** 2026-08-03

This backlog turns the approved delivery sequence into independently demonstrable increments. Estimates are relative, not commercial commitments.

## Current delivery checkpoint

- MVP-001, MVP-002, and the authenticated internal portion of MVP-003 are implemented.
- MVP-004, MVP-005, MVP-006, MVP-008, and MVP-009 are in progress through the production Discovery workflow.
- Prospect invitation, evidence upload, immutable approved snapshots, and proposal PDF export remain release blockers.

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

## Suggested first development sprint

- MVP-001 Domain state machines.
- MVP-002 Organization and tenant context.
- MVP-004 Discovery question schema.
- MVP-008 Scoring rules.

The sprint demo should show the same synthetic Discovery producing repeatable scores, allowed state transitions succeeding, invalid transitions failing, and one tenant being unable to read another tenant's data.
