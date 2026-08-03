# PRD-0004 — Discovery Workspace

**Document ID:** PRD-0004  
**Version:** 1.1.0
**Status:** Review
**Priority:** Critical  
**Owner:** Product Team

**Product Owner:** QIRA Founder
**Last Updated:** 2026-08-03

---

# Purpose

The Discovery Workspace is the first collaborative environment between QIRA and a qualified prospect.

Its purpose is to transform an initial business conversation into a structured project definition that can be used to generate proposals, estimate implementation effort, assign project teams, and begin delivery.

The Discovery Workspace becomes the single source of truth throughout the sales process.

---

# Vision

Provide consultants and clients with an AI-powered collaborative workspace where business requirements are collected, organized, analyzed, and transformed into actionable implementation plans.

---

# Objectives

The Discovery Workspace should:

- Organize all discovery information
- Guide structured workshops
- Capture business requirements
- Document current processes
- Identify pain points
- Define desired outcomes
- Generate implementation recommendations
- Prepare project proposals
- Build project scope
- Reduce proposal preparation time

---

# Success Metrics

## Primary KPIs

- Discovery Completion Rate
- Proposal Generation Rate
- Requirement Completeness Score
- Time to Proposal

## Secondary KPIs

- Stakeholder Participation
- AI Recommendation Usage
- Consultant Productivity
- Client Satisfaction

---

# Target Users

Primary

- QIRA Consultants
- Sales Consultants
- Solution Architects
- Clients

Secondary

- Project Managers
- Technical Leads
- Executives

---

# Workspace Structure

```text
Workspace

├── Overview
├── Organization
├── Stakeholders
├── Business Goals
├── Current Processes
├── Pain Points
├── Existing Systems
├── Requirements
├── AI Recommendations
├── Proposed Solutions
├── Timeline
├── Budget
├── Risks
├── Documents
├── Meeting Notes
├── Proposal Preview
└── Activity History
```

---

# Core Modules

## Overview

Displays:

- Discovery Status
- Client Information
- Progress
- Assigned Consultant
- Next Actions
- Recent Activity

---

## Organization Profile

Capture:

- Organization Name
- Industry
- Company Size
- Country
- Website
- Business Description

---

## Stakeholders

Track:

- Name
- Position
- Department
- Responsibilities
- Decision Maker Status
- Contact Information

---

## Business Goals

Examples:

- Reduce manual work
- Improve customer service
- Increase sales
- Improve reporting
- Automate workflows
- Reduce operational costs
- Improve compliance

Each goal includes:

- Priority
- Expected Outcome
- Success Metric

---

## Current Processes

Document:

- Existing workflow
- Responsible teams
- Systems used
- Manual activities
- Approval flows
- Pain points
- Bottlenecks

Support:

- Text
- Images
- Flowcharts
- Attachments

---

## Existing Systems

Capture:

- ERP
- CRM
- HRIS
- Accounting
- Helpdesk
- Databases
- Cloud Platforms
- APIs
- Legacy Systems

---

## Business Requirements

Categorize requirements:

Functional

- Features
- Workflows
- Integrations

Non-functional

- Security
- Performance
- Availability
- Compliance
- Accessibility

---

## AI Recommendations

The AI analyzes discovery information and recommends:

- AI Employees
- Automation Opportunities
- Dashboards
- Integrations
- Knowledge Systems
- Process Improvements
- Quick Wins
- Long-term Roadmap

Every recommendation includes:

- Reason
- Expected Impact
- Estimated Complexity
- Dependencies

---

## Proposed Solution

Generate:

- Executive Summary
- Recommended Services
- Scope
- Deliverables
- Phased Implementation
- Expected Outcomes

---

## Timeline

Capture:

- Desired Start Date
- Target Go-live
- Milestones
- Dependencies
- Critical Deadlines

---

## Budget

Capture:

- Budget Range
- Approval Process
- Procurement Requirements
- Funding Status

---

## Risks

Track:

- Technical Risks
- Organizational Risks
- Budget Risks
- Timeline Risks
- Integration Risks
- Adoption Risks

Each risk includes:

- Probability
- Impact
- Mitigation Plan

---

## Documents

Support uploads:

- Process Documents
- SOPs
- Organization Charts
- Existing Reports
- Presentations
- Images
- PDFs
- Spreadsheets

---

## Meeting Notes

Record:

- Summary
- Decisions
- Action Items
- Open Questions
- Follow-ups

Support AI-generated meeting summaries.

---

## Proposal Preview

Generate a draft proposal including:

- Executive Summary
- Client Challenges
- Proposed Solution
- Scope
- Timeline
- Deliverables
- Assumptions
- Next Steps

---

# AI Capabilities

The AI should:

- Summarize discussions
- Detect missing information
- Suggest follow-up questions
- Recommend services
- Prioritize opportunities
- Identify risks
- Draft proposals
- Recommend implementation phases

---

# Workflow

```text
Lead Qualified
        ↓
Discovery Workspace Created
        ↓
Client Invited
        ↓
Requirements Collected
        ↓
AI Analysis
        ↓
Recommendations Generated
        ↓
Consultant Review
        ↓
Proposal Draft
        ↓
Client Review
        ↓
Proposal Finalized
```

---

# Collaboration

Support:

- Multiple consultants
- Client participation
- Internal comments
- Mentions
- Task assignments
- Real-time updates

---

# Permissions

Roles:

- Administrator
- Consultant
- Solution Architect
- Project Manager
- Client
- Viewer

Each role has configurable access permissions.

---

# Integrations

- Supabase
- OpenAI Responses API
- Google Calendar
- CRM
- Proposal Generator
- Document Storage
- Email
- Analytics

---

# Notifications

Notify users when:

- Discovery created
- Client joins
- Documents uploaded
- AI recommendations available
- Proposal generated
- Tasks assigned
- Deadlines approaching

---

# Search

Search across:

- Organizations
- Requirements
- Meeting Notes
- Documents
- Recommendations
- Stakeholders

---

# Audit Log

Record:

- User actions
- Requirement changes
- AI recommendations
- File uploads
- Proposal revisions
- Permission updates

---

# Security

Support:

- Role-based access control
- Encryption at rest
- Encryption in transit
- Secure file storage
- Session management
- Audit logging

---

# Privacy

The platform must:

- Support client data deletion
- Comply with applicable privacy regulations
- Manage consent records
- Allow data export

---

# Analytics

Track:

- Discovery Completion Rate
- Average Discovery Duration
- Requirements Collected
- AI Recommendation Usage
- Proposal Conversion Rate
- Consultant Productivity
- Client Engagement

---

# Accessibility

Support:

- Keyboard Navigation
- Screen Readers
- Responsive Design
- High Contrast Mode

---

# Performance Requirements

- Workspace loads in under 2 seconds
- Real-time synchronization
- Autosave every 30 seconds
- Unlimited document history
- 99.9% uptime

---

# Non-Functional Requirements

The Discovery Workspace must be:

- Collaborative
- Secure
- Reliable
- Explainable
- Scalable
- AI-first
- Responsive
- Cloud-native

---

# Strategic Acceptance Criteria

The criteria below describe the long-term product vision. The MVP release is governed by the testable Release Acceptance criteria in the MVP Delivery Contract.

The Discovery Workspace successfully:

- Organizes all discovery information
- Supports collaborative workshops
- Captures structured requirements
- Generates AI recommendations
- Produces proposal-ready documentation
- Supports document uploads
- Maintains complete audit history
- Enables seamless handoff to project delivery

---

# MVP Delivery Contract

## Primary Job

When a qualified prospect explains a business need, QIRA must convert the conversation into complete, structured, consented, and reviewable evidence for a commercial proposal.

## MVP Scope

- Invitation or secure resume link for one prospect organization.
- Organization profile, stakeholder, business goal, current process, pain points, desired outcome, constraints, budget range, and target timeline.
- Dynamic question sets based on selected QIRA service, with a controlled fallback for custom needs.
- Draft autosave, completion indicator, review screen, explicit consent, and final submission.
- File upload for approved formats with size limit, malware-scanning hook, ownership metadata, and version reference.
- Deterministic Opportunity, Digital Readiness, and Implementation Complexity scores with factor-level explanations.
- QIRA consultant review, amendment note, approval, and immutable approved snapshot.
- Proposal-ready export through a versioned internal contract.

## Out of Scope

- Real-time multi-user editing, live whiteboard, BPMN editor, meeting transcription, digital signature, automated final pricing, autonomous external research, and automatic proposal sending.

## Core Data

| Entity | Minimum fields | Ownership and boundary |
|---|---|---|
| Organization | id, legal/display name, industry, size, location | Tenant-scoped |
| Discovery | id, organization_id, service_ids, status, version, owner, timestamps | Tenant-scoped; one approved version |
| Response | discovery_id, question_id, value, source, updated_by | Tenant-scoped |
| Evidence | discovery_id, file reference, classification, checksum, version | Tenant-scoped storage |
| Score | type, value, factors, ruleset_version, calculated_at | Reproducible and auditable |
| Consent | purpose, text_version, accepted_by, timestamp | Immutable record |
| Review | reviewer, decision, notes, timestamp | QIRA-authorized role only |

## Roles

| Action | Prospect | QIRA Consultant | QIRA Admin |
|---|---:|---:|---:|
| Edit draft Discovery | Own organization | Assigned records | All records |
| Submit Discovery | Own organization | No | No |
| Reopen with reason | No | Assigned records | All records |
| Approve snapshot | No | Assigned records | All records |
| View cross-tenant data | No | No | Explicit support access only |

## AI and Scoring Controls

- Deterministic rules calculate the three MVP scores; an LLM may explain but may not silently change numeric results.
- Every generated question or recommendation records model/provider, prompt version, source context, and timestamp.
- Unsupported claims are marked as assumptions and require consultant review.
- Local Ollama may be used for development or client-approved deployments; provider routing must not change the domain contract.
- No client data may be used for model training without explicit authorization.

## Testable Requirements

- **DIS-FR-001:** A prospect can save and resume a draft without accessing another organization's record.
- **DIS-FR-002:** Required answers and consent must pass validation before submission.
- **DIS-FR-003:** Score output includes value, factors, ruleset version, and human-readable explanation.
- **DIS-FR-004:** Submission creates a read-only version; reopening requires an authorized user and recorded reason.
- **DIS-FR-005:** Proposal generation accepts only an approved Discovery version.
- **DIS-FR-006:** Every view, edit, submit, reopen, and approval action creates an audit event.

## Release Acceptance

- Given two organizations, when either user lists or opens Discoveries, then no identifier manipulation reveals the other tenant's data.
- Given an incomplete Discovery, when submission is attempted, then missing requirements are identified and no approved snapshot is created.
- Given the same answers and ruleset version, when scores are recalculated, then the numeric outputs are identical.
- Given a consultant approval, when the record is handed to Proposal Generator, then the exact approved version and evidence references are preserved.

## MVP Metrics

| Metric | Target |
|---|---:|
| Qualified Discovery completion | ≥ 70% |
| Median completion time | ≤ 30 minutes |
| Required-field completeness at submission | 100% |
| Score reproducibility | 100% |
| Proposal handoff without manual re-entry | ≥ 90% |

## Approved MVP Decisions

- OpenAI adapter is the production default; the precise data-processing region remains a deployment gate.
- Upload limit is 20 MB per file. Retention is engagement duration plus two years unless contract or law overrides it.
- Score factors begin with equal weights and are reviewed after at least five approved Discovery cases.

---

# Future Enhancements

- Live whiteboard
- BPMN Process Designer
- AI-generated process maps
- Voice meeting transcription
- Live collaboration cursors
- Automatic stakeholder analysis
- AI-generated implementation roadmap
- Interactive solution architecture
- Cost estimation engine
- Digital signature integration

---

# Related Documents

- PRD-0001 — Public Platform
- PRD-0002 — AI Receptionist
- PRD-0003 — AI Consultant
- PRD-0005 — Client Workspace
- PRD-0006 — AI Proposal Generator
- QF-009 — Information Architecture

---

**End of Document**
