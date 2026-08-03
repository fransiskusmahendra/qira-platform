# ADR-0001 — Start with a modular monorepo

- Status: Accepted
- Date: 2026-07-31
- Owners: QIRA
- Related PRD: PRD-0001

## Context

QIRA has a broad product roadmap and needs to reuse platform capabilities across public, client, internal, and future mobile experiences. The repository previously contained requirements but no executable structure.

## Decision

Use npm workspaces with independently named applications under `apps/` and framework-independent reusable capabilities under `packages/`. Begin as a modular monolith and introduce separately deployed services only after an operational or scaling requirement justifies them.

The first executable product is `apps/public-web`. The first shared capability is `packages/domain`.

## Consequences

QIRA gains one install, one quality pipeline, consistent dependency management, and an explicit path for reuse. Workspace boundaries must be reviewed to prevent accidental coupling. Microservices and a dedicated API gateway are deferred.

## Alternatives considered

- Separate repository per application: rejected for the current team size because it increases coordination and duplicates configuration.
- Microservices immediately: rejected as premature operational complexity.
- Documentation-only repository: insufficient to validate architecture through working software.

## Security and data impact

No customer data or secrets are introduced. Future packages must preserve tenant context at every data boundary; the monorepo does not imply shared runtime authorization.

