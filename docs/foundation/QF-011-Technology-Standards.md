# QF-011 — Technology Standards

**Document ID:** QF-011

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This document defines the official technology standards for the QIRA Platform.

Every implementation, repository, service, AI module, integration, and deployment must comply with these standards.

Technology choices are strategic decisions.

Changing them requires an Architecture Decision Record (ADR).

---

# Technology Philosophy

Technology exists to solve business problems.

We do not adopt technology because it is popular.

We adopt technology because it improves:

- Platform quality
- Developer productivity
- Customer value
- Maintainability
- Security
- Scalability

---

# Official Technology Stack

## Frontend

Framework

Next.js

Language

TypeScript

UI

React

Styling

Tailwind CSS

Icons

Lucide

Animation

Framer Motion

Forms

React Hook Form

Validation

Zod

State Management

TanStack Query

Zustand

---

## Backend

Runtime

Node.js

Language

TypeScript

API

REST

Future

GraphQL where justified

Validation

Zod

Authentication

Supabase Auth

Authorization

Role Based Access Control (RBAC)

---

## Database

Primary Database

PostgreSQL

Provider

Supabase

ORM

Prisma

Migration

Prisma Migrate

Search

PostgreSQL Full Text Search

Future

Vector Search

---

## AI Layer

Primary Provider

OpenAI

Secondary Provider

Anthropic

Future Providers

Google

Open Source Models

Local Models (Ollama)

Routing should allow changing providers without changing business logic.

---

## Automation

Workflow Engine

n8n

Purpose

- Automation
- Integrations
- Scheduled Jobs
- AI Orchestration

Business logic must not be permanently stored in n8n.

n8n orchestrates.

Platform owns the business logic.

---

## Authentication

Supported

Email

Magic Link

OAuth

Google

Microsoft

GitHub

Future

SAML

Enterprise SSO

---

## Storage

Supabase Storage

Supported

Documents

Images

Videos

Knowledge Files

Deliverables

Every uploaded file should support versioning.

---

## Notifications

Supported

Email

WhatsApp

Push Notification

In-App Notification

Future

SMS

Slack

Microsoft Teams

---

## Search

Global Search

Document Search

Knowledge Search

Semantic Search

AI Search

Every searchable object should be indexed.

---

## Analytics

Supported

Business Analytics

Platform Analytics

AI Usage

User Activity

Performance Metrics

Audit Metrics

---

## Monitoring

Recommended

Sentry

OpenTelemetry

Vercel Analytics

Supabase Logs

Platform Health Dashboard

---

## CI/CD

GitHub

↓

Pull Request

↓

Review

↓

Automated Tests

↓

Preview Deployment

↓

Approval

↓

Production

No direct commits to production.

---

# Repository Strategy

Monorepo

Recommended

Turborepo

Structure

/apps

/packages

/services

/docs

/scripts

/infrastructure

/tests

Shared packages should be preferred over duplication.

---

# Cloud Infrastructure

Primary

Vercel

↓

Supabase

↓

OpenAI

↓

n8n

All infrastructure should be cloud-first.

---

# Environment Configuration

Three environments minimum

Development

↓

Staging

↓

Production

Environment variables must never be hardcoded.

Secrets must never be committed.

---

# API Standards

Every endpoint must support

Authentication

Authorization

Validation

Structured Errors

Logging

Versioning

Rate Limiting

---

# Coding Language

Official language

TypeScript

Avoid mixing languages unnecessarily.

Business logic should always use TypeScript.

---

# Package Management

Preferred

pnpm

Reasons

Fast

Workspace support

Disk efficiency

Monorepo friendly

---

# Documentation

Every package requires

README

Purpose

Dependencies

Usage

Examples

Owner

Documentation is mandatory.

---

# Testing

Testing Pyramid

Unit Tests

↓

Integration Tests

↓

End-to-End Tests

Tools

Vitest

Playwright

Every critical workflow requires automated tests.

---

# Security Requirements

Mandatory

HTTPS

Encryption at Rest

Encryption in Transit

Audit Logging

RBAC

Input Validation

Output Sanitization

Secret Management

Dependency Scanning

---

# Performance Targets

Initial Page Load

< 2 seconds

API Response

< 300 ms

AI Response

Target < 10 seconds

Availability

99.9% minimum

---

# Browser Support

Latest versions of

Chrome

Edge

Firefox

Safari

Mobile browsers

Responsive design is mandatory.

---

# Accessibility

Minimum

WCAG 2.1 AA

Requirements

Keyboard navigation

Screen reader compatibility

Color contrast compliance

Focus indicators

Accessible forms

---

# Internationalization

Architecture must support

Multiple Languages

Multiple Time Zones

Multiple Currencies

Regional Formatting

Localization should not require architectural changes.

---

# Logging Standards

Every important action must generate structured logs.

Include

Timestamp

User

Tenant

Action

Resource

Result

Correlation ID

Sensitive information must never be logged.

---

# Dependency Policy

Dependencies must be

Actively maintained

Well documented

Widely adopted

Security reviewed

Avoid unnecessary packages.

---

# Technology Review

Technology decisions should be reviewed at least annually.

Questions

Is it still maintained?

Does it still align with business goals?

Is there a significantly better alternative?

Migration requires an ADR.

---

# Anti-Patterns

Avoid

Framework lock-in

Vendor lock-in

Business logic in frontend

Hardcoded configuration

Multiple sources of truth

Technology chosen because of trends

Undocumented dependencies

---

# Related Documents

- QF-010 — Architecture Principles
- QF-012 — Engineering Standards
- QF-013 — Database Standards
- QF-014 — API Standards
- QF-016 — Security Standards

---

**End of Document**
