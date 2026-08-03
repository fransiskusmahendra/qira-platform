# Contributing to QIRA Platform

## Before implementation

- Link the change to an approved PRD or issue.
- Read the relevant Foundation documents.
- Create an ADR for a new dependency, data boundary, integration, or architecture pattern.
- Define the smallest independently valuable outcome.

## Branch and pull request workflow

1. Create a focused branch from `main`.
2. Keep commits small and explain why the change exists.
3. Run `npm run typecheck`, `npm test`, and `npm run build`.
4. Open a pull request describing customer value, security impact, tests, and rollback.
5. Do not commit credentials, customer data, generated build output, or local environment files.

## Definition of done

A change is ready only when its implementation, tests, documentation, security considerations, and reusable lessons are included.

