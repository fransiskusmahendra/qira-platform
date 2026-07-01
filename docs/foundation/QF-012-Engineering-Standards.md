# QF-012 — Engineering Standards

**Document ID:** QF-012

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This document defines the engineering standards used across every QIRA repository.

Every engineer, AI engineer, contractor, and contributor must follow these standards.

The objective is consistency, maintainability, scalability, and long-term platform quality.

---

# Engineering Philosophy

Engineers do not write code.

Engineers solve business problems.

Code is simply the implementation of a business decision.

Engineering success is measured by:

- Customer value
- Platform quality
- Maintainability
- Reusability
- Simplicity

Not by lines of code.

---

# Engineering Principles

Every engineer must optimize for:

- Simplicity
- Readability
- Maintainability
- Testability
- Reusability
- Security
- Scalability

Never optimize for cleverness.

---

# Definition of Done

A feature is complete only if ALL of the following exist.

✅ Product Requirement

✅ Architecture Review

✅ Documentation

✅ Implementation

✅ Unit Tests

✅ Integration Tests

✅ Security Review

✅ Code Review

✅ Successful CI

✅ Updated Company Brain

---

# Engineering Workflow

Every feature follows:

```

Idea

↓

Product Requirement (PRD)

↓

Architecture Review (ADR)

↓

Design

↓

Implementation

↓

Unit Testing

↓

Integration Testing

↓

Pull Request

↓

Review

↓

Merge

↓

Deployment

↓

Knowledge Update

```

No shortcuts.

---

# Repository Standards

Every repository must contain

```

README.md

LICENSE

CHANGELOG.md

CONTRIBUTING.md

docs/

tests/

.github/

```

Documentation is required.

---

# Monorepo Standards

```

apps/

packages/

services/

docs/

scripts/

tests/

```

Each package should have a single responsibility.

---

# Folder Structure

Every application follows

```

src/

components/

features/

lib/

hooks/

services/

api/

types/

styles/

utils/

```

Avoid dumping files into src.

---

# Naming Conventions

Directories

kebab-case

Example

customer-success

---

Files

PascalCase

Example

CustomerCard.tsx

---

Components

PascalCase

---

Variables

camelCase

---

Constants

UPPER_SNAKE_CASE

---

Interfaces

Prefix with I is NOT required.

Example

Customer

Project

Proposal

---

Enums

PascalCase

---

Types

PascalCase

---

Database Tables

snake_case

---

Columns

snake_case

---

# Component Standards

Every component should be:

Reusable

Composable

Small

Predictable

Testable

Documented

Avoid components larger than ~300 lines unless justified.

---

# Function Standards

Functions should

Do one thing.

Return predictable output.

Avoid side effects.

Prefer pure functions.

Maximum recommended complexity:

Cyclomatic Complexity < 10.

---

# Business Logic

Business logic belongs in:

Services

Domain

Use Cases

Never inside:

React Components

Pages

UI

Forms

---

# State Management

Use:

Local State

↓

Zustand

↓

TanStack Query

Choose the simplest solution.

Avoid global state unless necessary.

---

# Error Handling

Never ignore errors.

Every error should:

Be logged.

Return meaningful information.

Avoid exposing internal implementation details.

---

# Logging

Use structured logging.

Include:

Timestamp

User

Tenant

Module

Action

Result

Correlation ID

Never log:

Passwords

Secrets

Tokens

Sensitive customer data

---

# Validation

Validate:

Frontend

↓

Backend

↓

Database

Never trust client input.

---

# Configuration

Configuration belongs in:

Environment Variables

Database Settings

Configuration Files

Never hardcode:

URLs

Keys

Credentials

IDs

Business Rules

---

# Secrets

Secrets belong only in secure secret managers.

Never commit:

API Keys

Passwords

Tokens

Certificates

Private Keys

---

# Testing Standards

Every feature requires:

Unit Test

Integration Test

Critical flows require:

End-to-End Test

Coverage target:

Minimum 80%.

Critical modules:

90%+.

---

# Pull Request Standards

Every Pull Request must include:

Purpose

Summary

Screenshots (if UI)

Test Results

Breaking Changes

Related PRD

Related ADR

Related Issue

No anonymous pull requests.

---

# Code Review Checklist

Reviewer verifies:

Correctness

Readability

Security

Performance

Testing

Documentation

Architecture

No PR should be approved without review.

---

# Documentation Standards

Every feature requires:

Purpose

Architecture

Usage

Configuration

Limitations

Future Improvements

Documentation lives beside the code.

---

# Refactoring

Engineers are encouraged to improve code.

Refactoring must:

Preserve behavior.

Improve quality.

Reduce duplication.

Increase readability.

Large refactors require an ADR.

---

# Performance

Optimize only after measurement.

Avoid premature optimization.

Measure:

Latency

Memory

CPU

Database Queries

Bundle Size

---

# AI Engineering

AI-generated code must be reviewed.

AI must:

Explain architecture.

Follow standards.

Update documentation.

Generate tests.

Respect the Foundation.

AI never bypasses engineering review.

---

# Engineering Metrics

Track:

Deployment Frequency

Lead Time

Change Failure Rate

Mean Time to Recovery

Code Coverage

Bug Rate

Technical Debt

Documentation Coverage

---

# Technical Debt

Technical debt must be:

Documented

Prioritized

Tracked

Reviewed

Never ignore known debt.

---

# Anti-Patterns

Avoid:

God Components

God Services

Copy-Paste Code

Business Logic in UI

Hidden Dependencies

Magic Numbers

Magic Strings

Deep Nesting

Circular Dependencies

Framework Lock-In

---

# Engineering Culture

Every engineer should:

Think like an architect.

Write for future engineers.

Document decisions.

Share knowledge.

Improve the platform.

Challenge poor designs.

Respect the Foundation.

---

# Engineering Oath

As a QIRA Engineer, I commit to:

Build for the long term.

Protect customer trust.

Write maintainable software.

Document everything.

Improve every repository.

Leave the platform better than I found it.

---

# Related Documents

- QF-010 — Architecture Principles
- QF-011 — Technology Standards
- QF-013 — Database Standards
- QF-014 — API Standards
- QF-016 — Security Standards
- QF-020 — Golden Rules

---

**End of Document**
