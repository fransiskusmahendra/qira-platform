# QF-013 — Database Standards

**Document ID:** QF-013

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This document defines the official database standards for the QIRA Platform.

Every database object, schema, migration, query, relationship, index, and storage strategy must comply with these standards.

These standards exist to ensure consistency, scalability, maintainability, and security.

---

# Database Philosophy

The database is not simply a storage layer.

It is the single source of truth for business information.

Every schema should be designed to:

- Preserve data integrity.
- Support long-term evolution.
- Support AI.
- Support analytics.
- Support auditing.
- Support multi-tenancy.

---

# Official Database

Primary Database

PostgreSQL

Provider

Supabase

ORM

Prisma

Migration Tool

Prisma Migrate

---

# Design Principles

Every table should be:

- Normalized
- Versionable
- Auditable
- Searchable
- Secure
- Multi-tenant

---

# Naming Standards

## Tables

snake_case

Examples

```
organizations

users

projects

documents

discovery_sessions
```

---

## Columns

snake_case

Examples

```
organization_id

created_at

updated_at

created_by

is_active
```

---

## Foreign Keys

Always use

```
table_name_id
```

Example

```
organization_id

user_id

project_id
```

---

## Primary Keys

Use UUID.

Never use sequential integer IDs.

Example

```
id UUID PRIMARY KEY
```

---

# Standard Columns

Every business table contains

```
id

organization_id

created_at

updated_at

created_by

updated_by

deleted_at

version

is_active
```

---

# Multi-Tenant Standard

Every tenant-owned table must contain

```
organization_id
```

Every query must automatically filter by tenant.

Cross-tenant access is prohibited.

---

# Soft Delete

Records should never be permanently deleted by default.

Instead

```
deleted_at TIMESTAMP NULL
```

Soft delete allows:

- Recovery
- Audit
- Compliance

---

# Audit Columns

Every business record stores

```
created_at

created_by

updated_at

updated_by
```

Critical tables also store

```
approved_by

approved_at

reviewed_by

reviewed_at
```

---

# Versioning

Important business records should support version history.

Examples

Proposal

SOP

Architecture

Knowledge

Prompt

Document

Store

```
version

parent_version_id
```

---

# Relationships

Preferred

```
One-to-Many
```

Allowed

```
Many-to-Many
```

through junction tables.

Avoid unnecessary polymorphic relationships.

---

# Junction Tables

Example

```
project_users

user_roles

document_tags
```

Naming

```
entity_entity
```

Alphabetical if possible.

---

# Lookup Tables

Store static business values.

Examples

```
countries

currencies

languages

industries

statuses

roles
```

Never hardcode lookup values.

---

# JSON Usage

JSON columns are allowed only when

Schema changes frequently.

Examples

AI metadata

Model response

Temporary configuration

Avoid storing core business entities inside JSON.

---

# Search Strategy

Every searchable entity should support

- Full Text Search
- Semantic Search (future)
- Metadata Search

Search indexes should be maintained.

---

# File Metadata

Files should not be stored directly in the database.

Database stores

```
file_name

mime_type

storage_path

size

checksum

uploaded_by
```

Binary content belongs in object storage.

---

# AI Data

Every AI interaction stores

Conversation

Prompt

Response

Model

Tokens

Execution Time

Confidence

Tools Used

Memory References

Audit Information

---

# Company Brain Tables

Examples

knowledge_articles

knowledge_categories

knowledge_sources

prompts

architecture_patterns

workflow_templates

decision_logs

industry_templates

---

# Discovery Tables

Examples

organizations

stakeholders

business_goals

pain_points

opportunities

interviews

discovery_sessions

maturity_scores

readiness_scores

---

# CRM Tables

Examples

leads

companies

contacts

opportunities

activities

notes

meetings

---

# Project Tables

Examples

projects

milestones

tasks

deliverables

risks

change_requests

---

# Security Tables

Examples

users

roles

permissions

sessions

audit_logs

api_keys

oauth_accounts

---

# Indexing Rules

Index

Primary Keys

Foreign Keys

Frequently Filtered Columns

Frequently Sorted Columns

Frequently Joined Columns

Avoid unnecessary indexes.

---

# Constraints

Use

NOT NULL

CHECK

FOREIGN KEY

UNIQUE

Whenever appropriate.

Never rely only on application validation.

---

# Transactions

Transactions required for

Financial Operations

Project Approval

Proposal Approval

User Provisioning

Billing

Any multi-table business operation.

---

# Migrations

All schema changes must use migrations.

Never modify production schema manually.

Every migration must be reversible whenever practical.

---

# Backup Strategy

Minimum

Daily Backup

Point-in-Time Recovery

Regular Restore Testing

Backup verification is mandatory.

---

# Performance

Monitor

Slow Queries

Missing Indexes

Large Tables

Storage Growth

Connection Pool

Query Plans

Performance should be measured continuously.

---

# Data Retention

Define retention policy for

Logs

AI Conversations

Audit Logs

Notifications

Temporary Files

Deleted Records

Retention varies by business and regulatory requirements.

---

# Database Review Checklist

Before deployment verify

Schema reviewed

Indexes reviewed

Security reviewed

Migration tested

Performance tested

Rollback available

Documentation updated

---

# Anti-Patterns

Avoid

SELECT *

Duplicated data

Missing indexes

Business logic in SQL triggers

Hardcoded values

Cross-tenant joins

Manual schema changes

Unbounded JSON storage

Circular relationships

---

# Success Metrics

Database quality is measured by

Data Integrity

Query Performance

Maintainability

Scalability

Auditability

Security

Tenant Isolation

Documentation Coverage

---

# Related Documents

- QF-010 — Architecture Principles
- QF-011 — Technology Standards
- QF-012 — Engineering Standards
- QF-014 — API Standards
- QF-016 — Security Standards
- QF-017 — Company Brain

---

**End of Document**
