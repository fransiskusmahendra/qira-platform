# PRD-0006 — AI Proposal Generator

**Document ID:** PRD-0006  
**Version:** 1.1.0
**Status:** Approved
**Priority:** Critical  
**Owner:** Product Team

**Product Owner:** QIRA Founder
**Last Updated:** 2026-08-03

---

# Purpose

The AI Proposal Generator automatically transforms Discovery outputs into professional, client-ready proposals.

Instead of consultants manually creating proposals from scratch, the system analyzes discovery results, project requirements, business objectives, and implementation constraints to generate complete proposal documents within minutes.

The AI Proposal Generator should significantly reduce proposal preparation time while improving consistency and quality.

---

# Vision

Build an AI Proposal Generator capable of producing consulting proposals that match the quality of senior consultants while allowing consultants to review, refine, and approve every proposal before it is sent.

---

# Objectives

The AI Proposal Generator should:

- Generate professional proposals
- Create Statements of Work (SOW)
- Build implementation plans
- Recommend project phases
- Generate timelines
- Estimate effort
- Recommend pricing structures
- Create deliverables
- Generate assumptions
- Produce client-ready PDF and DOCX documents

---

# Success Metrics

## Primary KPIs

- Proposal Generation Time
- Proposal Acceptance Rate
- Consultant Review Time
- Proposal Accuracy

## Secondary KPIs

- Revision Count
- Proposal Win Rate
- Consultant Productivity
- Proposal Consistency
- Client Satisfaction

---

# Target Users

Primary

- Sales Consultants
- Business Consultants
- Solution Architects
- Project Managers

Secondary

- Executives
- Delivery Managers
- Clients (Proposal Review)

---

# Proposal Workflow

```text
Discovery Completed
        ↓
AI Analysis
        ↓
Project Classification
        ↓
Service Recommendations
        ↓
Scope Generation
        ↓
Timeline Generation
        ↓
Pricing Recommendation
        ↓
Proposal Draft
        ↓
Consultant Review
        ↓
Approval
        ↓
Client Delivery
```

---

# Inputs

The Proposal Generator receives:

- Discovery Summary
- Business Goals
- Pain Points
- Requirements
- Existing Systems
- AI Recommendations
- Timeline Expectations
- Budget Range
- Stakeholders
- Industry
- Organization Profile

---

# Outputs

Generate:

- Executive Summary
- Business Challenges
- Current Situation
- Recommended Solution
- Scope of Work
- Deliverables
- Implementation Methodology
- Project Timeline
- Milestones
- Assumptions
- Risks
- Team Structure
- Investment
- Payment Terms
- Next Steps

---

# Proposal Sections

## Cover Page

Include:

- Client Name
- Proposal Title
- Date
- Version
- Consultant
- QIRA Branding

---

## Executive Summary

Summarize:

- Business Situation
- Client Objectives
- Recommended Solution
- Expected Business Outcomes

---

## Business Challenges

Describe:

- Current Problems
- Pain Points
- Operational Risks
- Existing Limitations

---

## Proposed Solution

Explain:

- Recommended Services
- AI Employees
- Automation
- Integrations
- Dashboards
- Custom Development
- Consulting Services

---

## Scope of Work

Define:

- Included Deliverables
- Excluded Items
- Responsibilities
- Dependencies

---

## Deliverables

Examples:

- AI Employees
- Dashboards
- Automation Workflows
- Integrations
- Documentation
- User Training
- Support

---

## Implementation Plan

Generate phases such as:

Phase 1

- Discovery Validation

Phase 2

- Solution Design

Phase 3

- Development

Phase 4

- Testing

Phase 5

- Deployment

Phase 6

- Training

Phase 7

- Hypercare

---

## Timeline

Generate:

- Duration
- Milestones
- Dependencies
- Estimated Completion Date

Support:

- Weekly
- Monthly
- Phase-based planning

---

## Team Structure

Recommend:

- Project Manager
- Solution Architect
- AI Engineer
- Backend Engineer
- Frontend Engineer
- QA Engineer
- Consultant

---

## Pricing Recommendation

Support:

- Fixed Price
- Time & Materials
- Monthly Subscription
- Hybrid Pricing

The AI should recommend pricing models only.

Final pricing requires consultant approval.

---

## Assumptions

Automatically generate assumptions including:

- Client resource availability
- Data accessibility
- System availability
- Stakeholder participation
- Infrastructure readiness

---

## Risks

Generate:

- Technical Risks
- Business Risks
- Timeline Risks
- Organizational Risks

Include suggested mitigation strategies.

---

## Next Steps

Recommend:

- Proposal Review
- Q&A Session
- Contract Preparation
- Project Kickoff

---

# AI Capabilities

The AI should:

- Analyze discovery information
- Detect missing information
- Recommend additional scope
- Suggest implementation phases
- Estimate project complexity
- Generate executive summaries
- Recommend deliverables
- Produce professional proposal language

---

# Proposal Templates

Support multiple templates:

- SME Proposal
- Enterprise Proposal
- Government Proposal
- AI Consulting Proposal
- Automation Proposal
- Managed Service Proposal

Templates should follow QIRA branding guidelines.

---

# Editing

Consultants can:

- Edit text
- Modify sections
- Add custom content
- Remove sections
- Change timelines
- Update pricing
- Regenerate selected sections

All changes are version controlled.

---

# Version Control

Maintain:

- Proposal Versions
- Change History
- Review Notes
- Approval Records

Support comparison between versions.

---

# Export Formats

Support:

- PDF
- DOCX
- Markdown
- HTML

Future:

- Google Docs
- Microsoft Word Online

---

# Approval Workflow

```text
AI Draft
    ↓
Consultant Review
    ↓
Manager Approval (Optional)
    ↓
Final Version
    ↓
Client Delivery
```

---

# Integrations

- Discovery Workspace
- Client Workspace
- CRM
- Document Storage
- OpenAI Responses API
- Supabase
- Email
- Analytics

Future:

- DocuSign
- PandaDoc
- Adobe Acrobat Sign

---

# Search

Search proposals by:

- Client
- Industry
- Services
- Date
- Consultant
- Status

---

# Notifications

Notify users when:

- Proposal Draft Ready
- Review Requested
- Proposal Approved
- Proposal Sent
- Proposal Viewed
- Proposal Accepted

---

# Security

Support:

- Role-Based Access
- Proposal Encryption
- Approval Audit Trail
- Version History
- Secure Sharing

---

# Privacy

Ensure:

- Client confidentiality
- Secure document storage
- Access logging
- Data retention policies

---

# Analytics

Track:

- Proposal Generation Time
- Proposal Acceptance Rate
- Revision Count
- Average Review Time
- Win Rate
- Proposal Value
- Revenue Pipeline

---

# Accessibility

Support:

- WCAG AA
- Keyboard Navigation
- Screen Readers
- Responsive Layout

---

# Performance Requirements

- Initial proposal generated in under 60 seconds
- Section regeneration under 10 seconds
- Export PDF under 5 seconds
- 99.9% uptime

---

# Non-Functional Requirements

The AI Proposal Generator must be:

- Accurate
- Professional
- Explainable
- Consistent
- Secure
- Scalable
- Configurable
- Consultant-controlled

---

# Strategic Acceptance Criteria

The criteria below describe the long-term product vision. The MVP release is governed by the testable Release Acceptance criteria in the MVP Delivery Contract.

The AI Proposal Generator successfully:

- Generates complete proposals
- Produces implementation plans
- Creates Statements of Work
- Recommends pricing models
- Generates timelines
- Supports consultant editing
- Maintains version history
- Exports professional documents
- Never sends proposals without human approval

---

# MVP Delivery Contract

## Primary Job

When a Discovery is approved, QIRA needs a fast, consistent proposal draft that preserves the evidence, commercial assumptions, and human accountability behind every client-facing claim.

## MVP Scope

- Generate from exactly one approved Discovery version.
- Produce cover, executive summary, challenges, proposed solution, scope, exclusions, deliverables, timeline, assumptions, dependencies, risks, indicative pricing, payment terms, validity period, and next steps.
- Use QIRA-controlled templates and versioned prompt/configuration.
- Support section editing, regeneration with reason, comments, version comparison, consultant approval, and PDF export.
- Preserve source references for generated claims and mark unsupported content as an assumption.
- Indonesian output first; client-ready English remains deferred.

## Commercial Guardrails

- Pricing is indicative until approved by the QIRA Founder or delegated commercial approver.
- The MVP accepts human-entered package price, tax treatment, discount, validity period, and payment schedule.
- For early portfolio projects, the proposal may display a simulation label and a `50% DP / 50% after implementation` schedule only when explicitly selected.
- AI may suggest structure and effort ranges but cannot approve discounts, binding prices, legal clauses, or delivery commitments.

## Core Data

| Entity | Minimum fields |
|---|---|
| Proposal | id, organization_id, discovery_version_id, status, template_version, currency, validity, owner |
| Proposal Version | proposal_id, version, sections, generated_by, prompt_version, created_at |
| Commercial Terms | package, amount, tax, discount, payment_schedule, assumptions, approved_by |
| Approval | decision, reviewer, comments, proposal_version, timestamp |
| Export | proposal_version, format, checksum, generated_at, generated_by |

## Testable Requirements

- **PRO-FR-001:** Generation is rejected when the source Discovery is not approved.
- **PRO-FR-002:** Every generated section records its source Discovery version, template version, and generation configuration.
- **PRO-FR-003:** Regeneration creates a new version and never overwrites an approved version.
- **PRO-FR-004:** Export is disabled until the current version has human approval and complete commercial terms.
- **PRO-FR-005:** The client cannot access internal prompts, model reasoning, internal margins, or unapproved drafts.
- **PRO-FR-006:** PDF export preserves approved wording, amounts, version, and document checksum.

## Release Acceptance

- Given an unapproved Discovery, when generation is requested, then no proposal is created.
- Given an approved Discovery, when generation completes, then all mandatory sections exist or are explicitly flagged for human completion.
- Given a changed price after approval, when export is requested, then reapproval is required.
- Given an exported PDF, when amounts and payment terms are compared with the approved version, then they match exactly.
- Given any proposal, when its history is inspected, then source version, edits, regenerations, approvals, and exports are attributable.

## MVP Metrics

| Metric | Target |
|---|---:|
| Median first-draft generation | ≤ 60 seconds |
| Manual re-entry from Discovery | 0 required fields |
| Mandatory section completeness | 100% |
| Export without human approval | 0 |
| Median consultant preparation time | ≤ 60 minutes after Discovery approval |

## Approved MVP Decisions

- PDF is the first export format; final visual template and legal disclaimer remain a release-content gate.
- QIRA Founder approves all tax treatment, discounts, payment terms, and commercial values in the MVP.
- The standard early-project payment option is 50% DP and 50% after implementation when explicitly selected.
- Proposal retention is engagement duration plus two years; the PDF rendering library remains an implementation ADR.

---

# Future Enhancements

- AI Pricing Engine
- Interactive Proposal Portal
- Proposal Microsites
- AI Contract Generator
- ROI Calculator
- Proposal Benchmarking
- Multi-language Proposals
- Voice Proposal Review
- Client Proposal Collaboration
- Digital Signature Workflow

---

# Related Documents

- PRD-0004 — Discovery Workspace
- PRD-0005 — Client Workspace
- PRD-0007 — Project Delivery Workspace
- PRD-0008 — Admin Platform
- QF-010 — System Architecture
- QF-015 — UI/UX Principles

---

**End of Document**
