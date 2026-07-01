# QF-014 — API Standards

**Document ID:** QF-014

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This document defines the official API standards used across the QIRA Platform.

Every API, endpoint, webhook, integration, AI tool, and external service must follow these standards.

The API is a long-term contract between systems.

Breaking changes are unacceptable unless explicitly versioned.

---

# API Philosophy

Every platform capability is exposed through APIs.

Applications do not communicate directly with databases.

Applications communicate through stable contracts.

```
Client

↓

API

↓

Business Logic

↓

Database
```

---

# API Design Principles

Every API must be:

- Consistent
- Predictable
- Versioned
- Secure
- Observable
- Documented
- Backward Compatible

---

# API Style

Official style:

REST

Future:

GraphQL (special use cases)

Event API

Webhooks

AI Tool API

REST remains the default.

---

# URL Structure

```
/api/v1/
```

Examples

```
/api/v1/auth

/api/v1/organizations

/api/v1/projects

/api/v1/discovery

/api/v1/company-brain
```

---

# Resource Naming

Use plural nouns.

Correct

```
/projects

/users

/documents
```

Incorrect

```
/getProject

/createUser

/deleteDocument
```

---

# HTTP Methods

GET

Retrieve data.

POST

Create resources.

PUT

Replace resources.

PATCH

Partial update.

DELETE

Soft delete by default.

---

# Standard Response

Success

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "requestId": ""
}
```

---

Failure

```json
{
  "success": false,
  "error": {
    "code": "",
    "message": "",
    "details": []
  },
  "requestId": ""
}
```

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Rate Limited

500 Internal Server Error

---

# Pagination

Use

```
?page=1

&pageSize=25
```

Response

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

---

# Filtering

Use query parameters.

Example

```
?status=active

?industry=insurance

?search=qira
```

---

# Sorting

```
?sort=name

?order=asc
```

---

# Authentication

Supported

Bearer Token

OAuth

Magic Link

API Key (server only)

Authentication is mandatory unless endpoint is explicitly public.

---

# Authorization

Every endpoint must verify

User

↓

Organization

↓

Role

↓

Permission

↓

Resource Access

Never trust client-side authorization.

---

# Multi-Tenant

Every request must include tenant context.

Tenant isolation is enforced on every request.

Cross-tenant access is prohibited.

---

# Validation

Validate

Headers

↓

Path Parameters

↓

Query Parameters

↓

Request Body

↓

Business Rules

Validation occurs before business logic.

---

# Idempotency

POST endpoints that create critical business resources should support idempotency keys.

Examples

Invoices

Payments

Projects

Subscriptions

---

# API Versioning

Current

```
v1
```

Breaking changes require

```
v2
```

Never break existing clients.

---

# Rate Limiting

Default

100 requests/minute/user

Sensitive endpoints

Lower limits

Admin APIs

Higher limits

AI endpoints

Token-based limits

---

# API Documentation

Every endpoint requires

Purpose

Authentication

Permissions

Request Example

Response Example

Error Codes

Business Rules

Related APIs

---

# Webhooks

Supported events

Lead Created

Project Created

Proposal Approved

Document Uploaded

AI Task Completed

Invoice Paid

Webhook requirements

Retry

Signature Verification

Idempotency

Logging

---

# AI APIs

AI services expose APIs.

Examples

```
POST /api/v1/ai/chat

POST /api/v1/ai/summarize

POST /api/v1/ai/analyze

POST /api/v1/ai/generate-proposal
```

Every AI request must include

Tenant

User

Permissions

Context

Audit Information

---

# File APIs

Upload

Download

Preview

Version History

Delete (soft)

Files should never bypass authorization.

---

# Search APIs

Support

Keyword Search

Semantic Search

Hybrid Search

Filtering

Pagination

---

# Audit Logging

Every write operation logs

Timestamp

User

Organization

Action

Resource

IP

User Agent

Request ID

---

# Observability

Every request should produce

Structured Log

Metrics

Latency

Error Tracking

Trace ID

Correlation ID

---

# Performance Targets

GET

<200ms

POST

<500ms

Search

<800ms

AI APIs

<10 seconds target

---

# API Security

Mandatory

HTTPS

TLS

Input Validation

Output Sanitization

Rate Limiting

RBAC

CORS

CSRF Protection (where applicable)

No sensitive data in URLs.

---

# Error Messages

Errors must be

Consistent

Actionable

Non-sensitive

Avoid exposing

Stack traces

SQL

Internal architecture

Secrets

---

# OpenAPI

Every endpoint should be documented using OpenAPI.

Documentation should be automatically generated where practical.

---

# API Review Checklist

Before release

Authentication

Authorization

Validation

Logging

Documentation

Tests

Rate Limits

Performance

Security Review

---

# Anti-Patterns

Avoid

RPC naming

Business logic in controllers

Returning database models directly

Undocumented endpoints

Breaking changes

Inconsistent responses

Ignoring HTTP semantics

---

# Success Metrics

API quality is measured by

Availability

Latency

Developer Experience

Documentation Coverage

Error Rate

Adoption

Backward Compatibility

---

# Related Documents

- QF-010 — Architecture Principles
- QF-011 — Technology Standards
- QF-012 — Engineering Standards
- QF-013 — Database Standards
- QF-016 — Security Standards

---

**End of Document**
