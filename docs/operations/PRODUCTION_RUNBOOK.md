# QIRA Production Runbook

Last reviewed: 2026-09-02

## Sources of truth

- Source code and application configuration: GitHub `main`.
- Production web deployment: Vercel project `qira-platform`.
- Production database/Auth: Supabase project used by `NEXT_PUBLIC_SUPABASE_URL`.
- Public canonical URL: `https://www.qirasolution.com`.
- Database schema changes must be committed as migrations before being applied to production.

## Daily automation

Vercel Cron calls `/api/cron/service-reminders` every day at 01:00 UTC / 08:00 WIB. The endpoint is protected by `CRON_SECRET` and performs idempotent checks for:

- project review dates;
- domain expiry;
- recurring subscription due dates;
- support ticket due dates;
- overdue lead follow-up;
- shared proposals that need follow-up or are approaching expiry.

A failed notification must not block customer-facing forms or proposal decisions.

## Deployment checklist

1. Group related changes into one Git commit when practical.
2. Push/fast-forward `main`; do not edit production source directly in Vercel.
3. Confirm Vercel cloned the intended commit SHA.
4. Require successful install, compile, TypeScript, and static generation.
5. Confirm dependency audit has no unresolved high-risk issue.
6. Check production aliases and `aliasError`.
7. Smoke-test public routes, protected redirects, `/api/health`, and the cron endpoint without authorization (must return 401).
8. Review production runtime errors after deployment.

## Backup and recovery

Before customer data becomes business-critical, confirm the backup capability available on the active Supabase plan.

- Prefer managed backups/PITR when the active plan supports the required recovery objective.
- If PITR is not available, schedule an encrypted database export to storage controlled by QIRA.
- Never store database dumps, access tokens, or service-role keys in Git.
- Keep at least one recovery copy outside the production project.
- Define a simple RPO/RTO before onboarding critical customers.
- Test restore into a non-production environment; a backup that has never been restored is not considered verified.

Suggested initial objective for a small QIRA workload: document a 24-hour RPO and one-business-day RTO, then tighten them when customer requirements justify it.

## Incident response

1. Identify whether the issue is public UI, application runtime, database/Auth, email, DNS, or customer-managed infrastructure.
2. Check the latest production deployment and runtime error clusters.
3. If the latest deployment caused the issue, prefer a tested rollback/revert through Git and Vercel rather than an untracked hotfix.
4. If database integrity is at risk, stop writes before attempting recovery.
5. Do not copy customer data into tickets, public GitHub issues, or chat logs.
6. Record the root cause and preventive action after recovery.

## Security controls

- RLS remains enabled on exposed Supabase tables.
- Service-role/secret keys are server-only and must never use a `NEXT_PUBLIC_` prefix.
- Public forms use server-side validation, honeypots, bounded field lengths, and database constraints.
- Evidence downloads remain restricted to clean/scanned files.
- Internal routes require an active role/membership.
- Cron endpoints require `Authorization: Bearer <CRON_SECRET>`.
- Security and Performance Advisors should be reviewed after material schema/policy changes.

## Monthly review

- Test the main customer journey from homepage to Discovery/lead submission.
- Test magic-link login and role redirects.
- Review open leads, proposal follow-ups, service reminders, and unread notifications.
- Review Vercel 4xx/5xx/error trends.
- Review Supabase Security and Performance Advisors.
- Confirm email domain authentication and delivery.
- Confirm DNS/SSL and production aliases.
- Re-check backup/restore readiness.
