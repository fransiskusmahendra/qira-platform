# QF-021 — Glossary

**Document ID:** QF-021

**Version:** 1.0.0

**Status:** Active

**Owner:** QIRA

**Last Updated:** 2026

---

# Purpose

This glossary defines the official terminology used throughout the QIRA Platform.

Every contributor, engineer, AI Employee, consultant, and customer-facing document should use these definitions consistently.

If a term is defined here, this definition becomes the official meaning across the entire platform.

---

# A

## AI Employee

A digital worker that performs defined business responsibilities alongside Human Employees.

Every AI Employee has:

- Identity
- Role
- Permissions
- Memory
- Knowledge Scope
- Responsibilities
- Audit Trail

Examples:

- AI Receptionist
- AI Consultant
- AI Business Analyst
- AI Solution Architect

---

## AI Engine

The platform capability responsible for:

- Model Routing
- Prompt Assembly
- Context Retrieval
- Memory
- Tool Execution
- Response Validation

---

## AI Workspace

A dedicated environment where users interact with AI Employees.

Unlike traditional chat applications, AI Workspaces are context-aware and integrated with business knowledge.

---

## API

Application Programming Interface.

The official communication layer between platform components.

All business capabilities should be exposed through APIs.

---

## ADR

Architecture Decision Record.

A document describing an important architectural decision.

---

# B

## Business Alignment

The process of understanding customer objectives before proposing technology.

Business Alignment always precedes Discovery.

---

## Business Capability

A reusable business function offered by the platform.

Examples:

- CRM
- Discovery
- Proposal Generation
- AI Receptionist

---

## Business Outcome

The measurable improvement delivered to a customer.

Examples:

- Revenue Growth
- Cost Reduction
- Faster Response Time
- Higher Productivity

---

# C

## Client Workspace

A secure workspace dedicated to one customer organization.

Contains:

- Discovery
- Documents
- Deliverables
- AI Conversations
- Projects

---

## Company Brain

The centralized knowledge platform that stores everything QIRA learns.

Includes:

- Knowledge
- Patterns
- Prompts
- Templates
- Architecture
- Decisions

The Company Brain continuously improves every future project.

---

## Configuration

Changing platform behavior without modifying source code.

Configuration is preferred over customization.

---

## Custom Development

Code written specifically for one customer.

Custom development should be minimized whenever possible.

---

# D

## Deliverable

Any artifact produced during an engagement.

Examples:

- Proposal
- Architecture
- Dashboard
- Report
- Workflow
- Web Application

---

## Discovery

The structured process used to understand a customer's business before designing solutions.

Discovery focuses on business outcomes rather than technical requirements.

---

## Digital Data Room

A secure repository for customer documents during Discovery and project delivery.

---

## Domain

A business area with its own rules and responsibilities.

Examples:

- CRM
- Billing
- Discovery
- Company Brain

---

# E

## Engineering Standard

A documented rule governing how software is designed, developed, tested, and maintained.

---

## Event

A business occurrence that may trigger workflows.

Examples:

- Lead Created
- Proposal Approved
- Project Completed

---

# F

## Feature

A user-facing capability.

Features should contribute to a reusable platform capability.

---

## Foundation

The collection of documents that define how QIRA operates.

The Foundation is the highest level of documentation.

---

# G

## Golden Rules

The constitutional principles governing every decision within QIRA.

Golden Rules override conflicting documentation.

---

# H

## Human Employee

A person responsible for strategic thinking, governance, ethics, leadership, and business decisions.

Human Employees collaborate with AI Employees.

---

# I

## Industry Pack

A reusable collection of knowledge, workflows, templates, AI prompts, and integrations for a specific industry.

Examples:

- Insurance
- Retail
- Education
- Manufacturing

---

## Integration

A connection between QIRA and an external system.

Examples:

- ERP
- CRM
- Accounting
- HRIS
- Email
- WhatsApp

---

# K

## Knowledge Object

A structured piece of information stored within the Company Brain.

Knowledge Objects include:

- Owner
- Version
- Tags
- Confidence
- Relationships

---

## Knowledge Graph

A graph of relationships between Knowledge Objects.

Allows AI to understand connections between concepts.

---

# L

## Lead

A prospective customer.

A Lead becomes a Client after successful qualification and agreement.

---

# M

## Marketplace

A future platform allowing customers to install AI Employees, templates, workflows, and Industry Packs.

---

## Memory

Information available to AI.

Memory levels include:

- Session Memory
- Workspace Memory
- Company Brain
- Global Knowledge

---

## Module

A reusable functional unit within the platform.

Examples:

- Authentication
- Discovery
- CRM
- Billing

---

# O

## Organization

A tenant within the QIRA Platform.

Every Organization has isolated:

- Users
- Data
- AI Memory
- Configuration

---

# P

## Pattern

A proven reusable solution.

Examples:

- Architecture Pattern
- UI Pattern
- Prompt Pattern
- Workflow Pattern

---

## Platform

The complete QIRA ecosystem.

Not a single application.

---

## PRD

Product Requirement Document.

Defines:

- Problem
- Users
- Requirements
- Acceptance Criteria
- Business Rules

Every feature begins with a PRD.

---

## Prompt

Instructions used by AI Employees.

Prompts are versioned assets stored in the Company Brain.

---

# R

## RFC

Request For Comments.

A document proposing a significant engineering or product change before implementation.

---

## Role

Defines the responsibilities and permissions assigned to a user or AI Employee.

---

# S

## Semantic Search

Search that retrieves information based on meaning rather than exact keywords.

---

## Service

A backend capability responsible for a single business function.

---

## Single Source of Truth (SSOT)

The authoritative source for a specific type of information.

Every artifact should have exactly one SSOT.

---

## Solution Map

A document mapping customer business problems to recommended QIRA capabilities.

Produced during Discovery.

---

# T

## Template

A reusable document, workflow, prompt, or component.

Templates reduce implementation effort and improve consistency.

---

## Tenant

A customer organization using the platform.

Tenant isolation is mandatory.

---

# U

## User Story

A description of a capability from the user's perspective.

Example:

"As a Project Manager, I want to generate proposals using AI so that I can reduce preparation time."

---

# V

## Workspace

A secure environment where users collaborate with AI and manage projects.

Examples:

- Client Workspace
- Internal Workspace

---

## Version

A numbered revision of a document, feature, AI Employee, or platform capability.

Versioning preserves history and supports continuous improvement.

---

# W

## White Label

The ability to rebrand the QIRA Platform for another organization without changing core functionality.

Supported customizations include:

- Branding
- Theme
- Domain
- Industry Knowledge
- Terminology

---

## Workflow

A sequence of business activities performed by humans, AI Employees, or both.

Workflows should be configurable whenever possible.

---

# Official Abbreviations

| Abbreviation | Meaning |
|--------------|---------|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| ADR | Architecture Decision Record |
| CRM | Customer Relationship Management |
| DDD | Domain-Driven Design |
| E2E | End-to-End Testing |
| IAM | Identity and Access Management |
| KPI | Key Performance Indicator |
| MVP | Minimum Viable Product |
| PRD | Product Requirement Document |
| RBAC | Role-Based Access Control |
| RFC | Request For Comments |
| SOP | Standard Operating Procedure |
| SSOT | Single Source of Truth |
| UI | User Interface |
| UX | User Experience |

---

# Naming Conventions

The following terms should always be capitalized:

- AI Employee
- Company Brain
- Client Workspace
- Discovery
- Industry Pack
- Platform
- Foundation
- Product Requirement Document
- Architecture Decision Record
- Request For Comments

These are official QIRA concepts.

---

# Maintaining the Glossary

Whenever a new concept becomes part of QIRA, this glossary must be updated.

Every Foundation document should reference terms defined here instead of creating inconsistent terminology.

The glossary is reviewed as part of every major platform release.

---

# Related Documents

- QF-000 — Foundation README
- QF-001 — Vision
- QF-004 — Product Philosophy
- QF-017 — Company Brain
- QF-020 — Golden Rules

---

**End of Document**
