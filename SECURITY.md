# Security Policy

Do not disclose suspected vulnerabilities in public issues.

Until a dedicated security mailbox is published, repository administrators should use GitHub's private vulnerability reporting feature. Reports should include impact, affected paths, reproduction steps, and any known mitigation. Never include real customer data or active credentials.

Supported code is the latest version of the `main` branch. Security requirements are governed by `docs/foundation/QF-016-Security-Standards.md`.

## Current production controls

As of 2026-09-02, the production build uses Next.js 16.3.0 and the deployment install audit reports 0 known package vulnerabilities.

Current controls include:

- Supabase RLS on exposed application tables and role-based access for QIRA/client workspaces;
- server-only Supabase secret/service-role credentials;
- bounded public-form inputs, honeypot fields, consent checks, and database constraints;
- malware-scan enforcement before private evidence can be downloaded;
- protected cron endpoints using `CRON_SECRET`;
- restrictive browser headers for framing, MIME sniffing, referrer policy, and device permissions;
- Git-first production changes with build, TypeScript, route-generation, and runtime-error verification;
- periodic Supabase Security and Performance Advisor review.

## Dependency monitoring

Dependency status is checked during production builds. A newly reported advisory must be classified by exploitability in QIRA, patched or mitigated, and documented before promotion when it materially affects customer data, authentication, server execution, or public input handling.

Never commit `.env` values, service-role keys, API tokens, database dumps, customer evidence, or other production secrets/data to this repository.
