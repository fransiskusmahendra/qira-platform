# ADR-0003 — Managed VPS deployment option

- Status: Accepted
- Date: 2026-08-13
- Owners: QIRA Founder
- Related PRD: PRD-0007

## Context

QIRA sells managed digital and IT outcomes rather than a specific hosting vendor. Vercel remains the simplest default for suitable customer workloads, but some customers may require QIRA-managed VPS hosting, a dedicated VPS, or deployment into infrastructure owned by the customer.

QIRA needs a repeatable deployment baseline before the first VPS customer arrives, without paying for idle production infrastructure.

## Decision

- Keep Vercel as the default deployment target for suitable simple workloads.
- Add a portable managed-VPS path based on Ubuntu LTS, Docker Engine, Docker Compose, Caddy, GitHub Actions, SSH public-key authentication, health checks, and documented rollback.
- Do not rent a production VPS until a paying customer or a validated workload requires it.
- Customer domains remain customer-owned. QIRA may manage DNS changes with explicit customer authorization.
- Use one non-root deployment identity per managed server. Root SSH login and password authentication are disabled after access is verified.
- Expose only SSH, HTTP, and HTTPS at the host firewall. Application containers bind to loopback or a private Docker network rather than public interfaces.
- Store production secrets on the server or an approved secret manager. GitHub contains only the minimum connection secrets needed for deployment. Secrets are never committed.
- Use immutable release identifiers (commit SHA / image tag) and retain the previous known-good release for rollback.
- Treat shared VPS hosting as appropriate only for low-risk workloads that can be isolated safely. Customers with contractual, regulatory, performance, or stronger isolation requirements use a dedicated VPS or customer-owned infrastructure.
- Supabase may remain the managed PostgreSQL/Auth/Storage provider even when the application runs on a VPS.
- Backups must cover persistent customer data and configuration. A provider snapshot alone is not considered a database backup.
- Production activation requires a restore test, monitoring, health checks, DNS validation, and an approved customer-specific runbook.

## Consequences

QIRA can provision a VPS quickly when a customer requires it without committing to idle infrastructure now. The deployment path is portable across VPS providers and avoids making Vercel a customer-facing dependency.

Operating a VPS creates responsibilities that managed platforms otherwise absorb: OS patching, firewall configuration, Docker lifecycle, TLS, monitoring, capacity management, backup verification, incident response, and recovery testing. QIRA must price managed service accordingly.

The first production VPS remains a learning milestone. Automation should be expanded from observed operational needs rather than building a large internal cloud platform prematurely.

## Alternatives considered

- Vercel only: rejected because it conflicts with QIRA's vendor-neutral managed-service positioning and customer infrastructure requirements.
- Rent a VPS immediately: rejected because an idle server adds cost and attack surface without customer value.
- Manual SSH deployment for every release: rejected because it is inconsistent, hard to audit, and slow to scale.
- Kubernetes: deferred because it adds unnecessary operational complexity at QIRA's current scale.
- Self-host all databases on the first VPS: deferred because managed PostgreSQL reduces operational risk for the current team.

## Security and data impact

Production SSH uses public-key authentication and least privilege. Deployment credentials are scoped to the server and rotated after suspected exposure. Customer application secrets are server-side only and use restrictive filesystem permissions.

Shared hosts require explicit workload isolation and resource limits. Customer data remains owned by the customer. Backup retention and deletion follow the customer agreement and applicable QIRA security/privacy standards.

No production VPS is considered ready until the security checklist and recovery drill in `infrastructure/vps/README.md` pass.
