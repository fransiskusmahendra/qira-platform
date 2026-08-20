# QIRA public-web deployment notes

- Keep production changes batched into a single validated pull request when possible.
- Avoid rapid sequences of small commits because each Git push can trigger Vercel deployment checks across connected monorepo projects before ignored-build rules are evaluated.
- Prefer GitHub CI for typecheck, tests, and production build validation before merging.
- If a Vercel Git check fails only with `build-rate-limit`, wait for the deployment quota window to recover before creating a single fresh trigger commit.
