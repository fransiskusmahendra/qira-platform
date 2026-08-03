# Security Policy

Do not disclose suspected vulnerabilities in public issues.

Until a dedicated security mailbox is published, repository administrators should use GitHub's private vulnerability reporting feature. Reports should include impact, affected paths, reproduction steps, and any known mitigation. Never include real customer data or active credentials.

Supported code is the latest version of the `main` branch. Security requirements are governed by `docs/foundation/QF-016-Security-Standards.md`.

## Dependency monitoring

As of 2026-08-03, `npm audit` reports advisories inherited through the latest stable Next.js `16.2.12`: PostCSS source-map file disclosure and Sharp/libvips image-processing vulnerabilities. There is no patched stable Next.js release available through npm yet, and npm does not replace these Next-managed versions through an override.

Current mitigations:

- production builds only process repository-controlled CSS;
- the application does not accept or transform user-uploaded images;
- Next.js updates remain pinned and must be reviewed as soon as a patched stable release is available;
- deployment promotion requires CI, build verification, and runtime error review.
