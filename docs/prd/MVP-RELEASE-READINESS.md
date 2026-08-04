# QIRA MVP Release Readiness

**Version:** 1.0.0  
**Status:** Active  
**Owner:** QIRA Founder  
**Last Updated:** 2026-08-04

## Release objective

Prove the production journey `Discovery → consultant approval → proposal → client response` is secure, recoverable, measurable, and usable by the first real portfolio client.

## Gate status

| Gate | Status | Evidence | Exit requirement |
|---|---|---|---|
| Source and CI | Passed | GitHub CI passes typecheck and automated domain/persistence tests. | Keep required CI green on `main`. |
| Production deployment | Passed | QIRA production deployment is Ready on Vercel. | Smoke test the canonical production alias after every release. |
| Database migrations | Passed | Supabase migrations through customer proposal email delivery are applied. | Record backup-restore evidence. |
| Tenant isolation | Automated coverage passed | Domain and persistence tests reject cross-tenant access. | Add authenticated production smoke evidence for two organizations. |
| Discovery workflow | Implemented; validation open | Draft, consent, scoring, approval, evidence, and immutable snapshot exist. | Complete one synthetic end-to-end production run. |
| Proposal workflow | Implemented; validation open | Approval, revision, PDF checksum, sharing, decisions, and notifications exist. | Validate approved amounts and PDF against the stored version. |
| Client access | Implemented; validation open | Invitations and client-only projection exist. | Validate expired/reused invitation and revoked-member behavior. |
| Evidence safety | Blocked | Private bucket and scan status hook exist. | Prevent unscanned/failed evidence from entering a trusted workflow. |
| Product metrics | Blocked | Operational UI exists without the required funnel events. | Measure Discovery completion, time-to-proposal, share, and client decision. |
| Customer email | Deferred final gate | Resend integration and application code are deployed. | When `myqira.io` is active: publish DNS records, verify domain, and send one test email from `hello@myqira.io`. |

## Production smoke-test matrix

- Prospect invitation is single-use, expires correctly, and creates only the intended membership.
- Prospect saves, resumes, consents to, and submits a complete Discovery.
- Repeated scoring produces identical numeric results for the same ruleset and answers.
- Consultant reopens with a reason or approves an immutable snapshot.
- Proposal cannot be created from an unapproved Discovery.
- Commercial changes require a new approval before sharing.
- Exported PDF matches the approved values and stores its checksum.
- Client sees only shared content from its organization and can accept or request revision once per version.
- QIRA receives the corresponding in-app notification and activity record.
- A user from a second organization cannot list or open the first organization's resources.

## Explicitly deferred

- Autonomous AI proposal generation and regeneration.
- Real-time collaboration, task management, invoicing, and online payment.
- DNS verification and production email test while `myqira.io` is inactive.

## Launch decision

The Founder may approve a limited portfolio-client pilot after every non-deferred blocked gate is closed and production smoke-test evidence is recorded. General availability requires measured pilot results and a separate release decision.
