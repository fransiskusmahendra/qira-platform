# QIRA Platform

QIRA Platform is the shared foundation for QIRA's public experiences, client workspaces, internal tools, and reusable AI capabilities.

The repository currently contains two complementary layers:

- `docs/` — product, architecture, security, and engineering source of truth.
- `apps/` and `packages/` — executable products and reusable platform capabilities.

## Current delivery focus

Phase 1 establishes a maintainable monorepo and validates it through the first executable application: the QIRA Public Platform. Scope is intentionally limited to capabilities needed for the next customer outcome.

## Repository map

```text
apps/
  public-web/       Public QIRA website (Next.js App Router)
packages/
  domain/           Framework-independent business concepts
docs/
  adr/              Architecture decisions
  foundation/       QIRA Foundation
  prd/              Product requirements
```

## Run locally

Requirements: Node.js 24 or newer and npm 11 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm test
npm run build
```

## How new QIRA applications should be added

1. Confirm the customer outcome and approved PRD.
2. Record material architecture choices in `docs/adr/`.
3. Reuse an existing package before creating a new one.
4. Keep business rules in `packages/domain` or another framework-independent package.
5. Add tests, security review notes, and documentation with the implementation.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [QIRA Foundation](docs/foundation/QF-000-README.md).

Product sequencing and known PRD overlap are tracked in the [PRD catalog](docs/prd/README.md).
