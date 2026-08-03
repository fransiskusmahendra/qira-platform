# QIRA Product Requirements Catalog

This folder contains strategic product requirements. A PRD describes intent; it does not authorize immediate implementation.

New and revised PRDs must follow [PRD-0000-TEMPLATE.md](PRD-0000-TEMPLATE.md). Delivery sequencing is governed by [PRD-DELIVERY-PLAN.md](PRD-DELIVERY-PLAN.md).

## Delivery rule

Only one primary outcome should be in active implementation at a time. A PRD moves through `Draft → Review → Approved → In Progress → Released`. Work must be linked to an Approved PRD and a measurable customer outcome.

## Current queue

| Order | PRD | Outcome | State |
|---:|---|---|---|
| 1 | PRD-0001 Public Platform | Visitors understand QIRA and initiate Discovery | In Progress |
| 2 | PRD-0004 Discovery Workspace | A prospect completes structured discovery online | Candidate |
| 3 | PRD-0006 AI Proposal Generator | QIRA produces a reviewed proposal from discovery evidence | Candidate |
| 4 | PRD-0005 Client Workspace | A client can access work and deliverables securely | Candidate |

All other PRDs remain strategic backlog until QIRA has validated the preceding customer need.

## Overlap requiring consolidation before approval

These documents appear to cover the same or strongly overlapping capability and must not be implemented independently until ownership is resolved:

| Earlier PRD | Later PRD | Capability |
|---|---|---|
| PRD-0014 | PRD-0052 | Notifications |
| PRD-0016 | PRD-0050 | API gateway |
| PRD-0021 | PRD-0054 | Observability |
| PRD-0022 | PRD-0049 | Integration hub |
| PRD-0028 | PRD-0051 | Event bus and messaging |
| PRD-0034 / PRD-0035 | PRD-0053 | Compliance, audit, and records |

## Canonical decisions

| Capability | Canonical PRD | Superseded PRD |
|---|---|---|
| Notifications | PRD-0014 | PRD-0052 |
| API gateway | PRD-0016 | PRD-0050 |
| Observability | PRD-0021 | PRD-0054 |
| Integration hub | PRD-0022 | PRD-0049 |
| Event bus and messaging | PRD-0028 | PRD-0051 |
| Compliance policy | PRD-0034 | Part of PRD-0053 |
| Audit records | PRD-0035 | Part of PRD-0053 |

Consolidation should preserve useful requirements, identify one canonical PRD, and mark the others `Superseded`; do not delete history.
