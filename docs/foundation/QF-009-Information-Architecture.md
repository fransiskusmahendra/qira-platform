# QF-009 — Information Architecture

**Document ID:** QF-009

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This document defines the official Information Architecture (IA) of the QIRA Platform.

Every screen, module, API, AI Employee, and future capability must fit within this architecture.

This architecture is permanent.

New modules may be added.

Existing architectural principles should not be violated.

---

# Information Architecture Philosophy

QIRA is a platform.

Not a collection of applications.

Every module belongs to the same ecosystem.

Users should never feel they are switching between different systems.

The experience must feel seamless.

---

# Platform Layers

The QIRA Platform consists of five primary layers.

```
Public Platform

↓

Client Workspace

↓

Internal Workspace

↓

Company Brain

↓

Platform Services
```

Each layer has a different purpose.

---

# Layer 1 — Public Platform

Purpose

Introduce QIRA.

Generate trust.

Educate visitors.

Qualify leads.

Convert visitors into clients.

---

## Modules

### Home

Purpose

Introduce QIRA.

---

### Services

Display all available services.

Examples

- AI Employees

- Business Automation

- AI Chatbots

- Custom Web Applications

- Dashboards

- System Integration

---

### Industries

Display Industry Packs.

Examples

Insurance

Retail

Manufacturing

Healthcare

Government

Education

Hospitality

Professional Services

---

### Case Studies

Purpose

Show previous success stories.

---

### AI Receptionist

Purpose

Answer visitor questions.

Route conversations.

Capture leads.

---

### AI Consultant

Purpose

Understand customer needs.

Recommend services.

Invite qualified prospects into Discovery.

---

### Pricing

Show service pricing where applicable.

---

### Knowledge Center

Blogs

Guides

Articles

Resources

---

### Contact

Allow visitors to contact QIRA.

---

### Discovery Request

Entry point into the Client Workspace.

---

# Layer 2 — Client Workspace

Purpose

Private collaboration portal.

Every client receives their own workspace.

Every workspace belongs to one organization.

---

## Workspace Dashboard

Displays

- Current Projects
- Discovery Progress
- Deliverables
- Notifications
- Upcoming Meetings
- AI Recommendations

---

## Business Alignment

Contains

Business Goals

Business Challenges

Success Metrics

Strategic Objectives

---

## Discovery

Contains

AI Interview

Questionnaires

Interview Notes

Discovery Timeline

---

## Digital Data Room

Secure document repository.

Folders

Business

Finance

Operations

Marketing

HR

IT

Legal

Projects

---

## AI Workspace

Private AI conversations.

Examples

Ask AI

Summarize Documents

Generate Reports

Analyze Business

Create SOP

---

## Deliverables

Contains

Reports

Architecture

Proposal

Roadmap

Documents

---

## Project Timeline

Displays

Milestones

Progress

Tasks

Risks

Dependencies

---

## Proposal

Shows

Solution

Architecture

Pricing

Timeline

Deliverables

---

## Knowledge Library

Contains

Uploaded Knowledge

Generated Knowledge

Templates

Recommendations

---

## Settings

Workspace configuration.

---

# Layer 3 — Internal Workspace

Purpose

Used only by QIRA employees.

---

## Dashboard

Executive overview.

---

## CRM

Manage organizations.

Leads.

Contacts.

Deals.

---

## Discovery Manager

Manage all Discovery sessions.

---

## Proposal Studio

Generate

Proposal

Quotation

Implementation Plan

Statement of Work

---

## AI Business Analyst

Business Analysis

Gap Analysis

Opportunity Analysis

---

## AI Solution Architect

Architecture Recommendations.

Technology Recommendations.

Integration Planning.

---

## Project Manager

Manage

Projects

Tasks

Milestones

Resources

---

## Delivery Center

Deployment

Training

Support

Maintenance

---

## Billing

Invoices

Subscriptions

Payments

Revenue

---

## Customer Success

Customer Health

Renewals

Satisfaction

Feature Requests

---

## Knowledge Manager

Maintain

Company Brain

Templates

Documentation

Prompt Library

---

# Layer 4 — Company Brain

Purpose

Store everything QIRA learns.

Company Brain is the strategic knowledge repository.

---

## Knowledge Types

Business Knowledge

Industry Knowledge

Architecture Patterns

Implementation Templates

Prompt Library

Best Practices

Lessons Learned

Decision Logs

RFC

ADR

PRD

---

## Search

Semantic Search

Keyword Search

AI Search

Document Search

---

## AI Memory

Company Brain powers every AI Employee.

---

# Layer 5 — Platform Services

Shared infrastructure.

---

## Authentication

Supports

Email

SSO

OAuth

Magic Link

---

## Authorization

Role Based Access Control

Tenant Isolation

Permission Management

---

## Notification

Email

WhatsApp

SMS

Push

In-App

---

## Workflow Engine

Business Process Automation

Approval Flow

Scheduled Jobs

Triggers

---

## AI Engine

Prompt Management

Model Routing

Context Assembly

Memory

Tool Calling

---

## File Service

Storage

Versioning

Access Control

Virus Scanning

---

## Search

Global Search

AI Search

Document Search

Knowledge Search

---

## Analytics

Business Metrics

Platform Metrics

Usage Metrics

AI Metrics

---

## Audit Logs

Every important action is recorded.

---

# Navigation Principles

Navigation should follow:

```
Dashboard

↓

Workspace

↓

Module

↓

Task

↓

Action
```

Users should never need more than three clicks to reach common tasks.

---

# User Roles

Visitor

Lead

Client User

Client Administrator

Consultant

Sales

Project Manager

Engineer

Knowledge Manager

Administrator

Super Administrator

AI Employee

---

# Design Principles

The Information Architecture should be:

Simple

Predictable

Scalable

Consistent

AI-first

Mobile-friendly

Accessible

---

# Future Modules

Future additions include:

Marketplace

Industry Packs

AI Builder

Plugin Marketplace

Workflow Marketplace

Template Marketplace

Analytics Marketplace

---

# Information Architecture Rules

Every new module must:

- Belong to one platform layer.
- Have a single responsibility.
- Expose APIs.
- Follow RBAC.
- Support audit logging.
- Support AI integration.
- Support Company Brain.

---

# Related Documents

- QF-004 — Product Philosophy
- QF-005 — Platform Principles
- QF-006 — Company Structure
- QF-007 — AI Employee Principles
- QF-008 — Discovery Methodology
- QF-010 — Architecture Principles

---

**End of Document**
