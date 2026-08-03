# PRD-0001 — Public Platform

Document ID: PRD-0001

Version: 1.1.0

Status: In Progress

Priority: Critical

Owner: Product Team

Product Owner: QIRA Founder

Last Updated: 2026-08-03

---

# Purpose

The Public Platform is the public face of QIRA.

Its purpose is NOT to sell software.

Its purpose is to educate visitors, build trust, qualify leads, and convert visitors into Discovery sessions.

Every page should move visitors closer to becoming clients.

---

# Vision

The Public Platform should become the best AI-first consulting website.

Visitors should feel they are speaking with a consulting company—not browsing a traditional corporate website.

---

# Objectives

The platform should:

- Introduce QIRA
- Explain services
- Build credibility
- Demonstrate AI capability
- Qualify visitors
- Generate Discovery requests
- Convert leads

---

# Success Metrics

Primary KPIs

- Discovery Requests
- Qualified Leads
- AI Conversations Started
- Proposal Requests

Secondary KPIs

- Bounce Rate
- Session Duration
- Returning Visitors
- Conversion Rate

---

# Target Users

Primary

Business Owners

SMEs

Enterprise Decision Makers

Government

Educational Institutions

---

Secondary

Partners

Investors

Potential Employees

Media

---

# Navigation

Home

Services

Industries

Solutions

Case Studies

Pricing

Knowledge Center

About

Contact

Discovery

Login

---

# Platform Structure

```
Landing

↓

Service Exploration

↓

AI Conversation

↓

Lead Qualification

↓

Discovery

↓

Proposal

```

---

# Modules

## Home

Purpose

Introduce QIRA.

Sections

Hero

Problems

Solutions

Services

Industries

Testimonials

CTA

Footer

---

## Services

Shows

AI Employees

Automation

Web Applications

Dashboards

Integration

Consulting

Discovery

Training

---

## Industries

Examples

Insurance

Healthcare

Retail

Government

Education

Manufacturing

Hospitality

Professional Services

Each industry has:

Problems

Solutions

Case Studies

Example AI Employees

---

## AI Receptionist

Responsibilities

Welcome Visitors

Answer FAQs

Navigate Website

Capture Contact

Route Visitor

Book Meeting

Never recommends architecture.

Never prices projects.

---

## AI Consultant

Responsibilities

Understand Business

Recommend Services

Determine Readiness

Generate Discovery Invitation

Ask Follow-up Questions

Estimate Opportunity

---

## Knowledge Center

Articles

Guides

Case Studies

Whitepapers

Videos

Templates

Downloads

---

## Discovery Request

Purpose

Start client engagement.

Collect

Organization

Contact

Business Challenge

Goals

Preferred Timeline

Meeting Availability

---

## Contact

Email

WhatsApp

Calendar

LinkedIn

Office

---

# User Journey

Visitor

↓

Landing Page

↓

AI Receptionist

↓

AI Consultant

↓

Discovery Invitation

↓

Client Workspace

---

# Landing Page Sections

Hero

↓

Problem

↓

Why QIRA

↓

Services

↓

Industries

↓

Platform Demo

↓

Testimonials

↓

CTA

---

# Hero

Headline

Subheadline

Primary CTA

Secondary CTA

AI Demo

Animation

---

# Primary CTA

Book Discovery

---

# Secondary CTA

Talk to AI

---

# Required Integrations

Supabase

OpenAI

Google Calendar

Email

WhatsApp

Analytics

CRM

---

# Authentication

Visitors

No login required.

Clients

Login required.

---

# SEO

Every page should include

Meta Title

Meta Description

OpenGraph

Structured Data

Canonical URL

Robots

Sitemap

---

# Analytics

Track

Page Views

CTA Clicks

AI Conversations

Lead Quality

Discovery Requests

Proposal Requests

Scroll Depth

---

# AI Behavior

AI should

Be professional.

Ask questions.

Recommend services.

Never fabricate.

Never oversell.

Always explain.

---

# Mobile

Must support

Responsive Design

Touch Navigation

Fast Loading

Accessibility

---

# Accessibility

WCAG AA

Keyboard Support

Screen Reader

High Contrast

---

# Performance

Lighthouse

95+

Accessibility

95+

SEO

95+

Performance

95+

Best Practices

95+

---

# Non-Functional Requirements

Fast

Secure

Responsive

SEO Optimized

Accessible

AI-first

Cloud-native

---

# Strategic Acceptance Criteria

The criteria below describe the long-term product vision. The MVP release is governed by the testable Release Acceptance criteria in the MVP Delivery Contract.

Visitor understands QIRA within 60 seconds.

Visitor can talk to AI immediately.

Visitor can request Discovery.

Visitor can book a meeting.

Visitor can contact QIRA.

AI can answer common questions.

AI can qualify leads.

Platform loads in under 2 seconds.

---

# MVP Delivery Contract

## MVP Scope

- Responsive single-page marketing experience in Bahasa Indonesia.
- QIRA positioning, four service categories, working method, legal entity, and contact channel.
- WhatsApp CTA with a prefilled Discovery message.
- Metadata, robots policy, mobile layout, keyboard access, and reduced-motion support.
- Analytics events for page view, service interest, CTA click, and successful Discovery handoff once a consent-compliant analytics provider is selected.

## Out of Scope

- AI Receptionist, AI Consultant, account login, booking calendar, knowledge center, pricing engine, CMS, and multilingual content.
- Client-specific recommendations before explicit consent and identity verification.

## Testable Requirements

- **PUB-FR-001:** A visitor can understand QIRA's proposition, services, working method, and company identity without authentication.
- **PUB-FR-002:** Every primary CTA opens the configured WhatsApp number with an Indonesian Discovery message.
- **PUB-FR-003:** The page remains usable at 360 px width and with keyboard-only navigation.
- **PUB-FR-004:** Contact details are configured once and reused; production values are not duplicated across components.
- **PUB-FR-005:** No analytics or marketing cookie is stored before the applicable consent decision.

## Release Acceptance

- Given a visitor on mobile, when the visitor activates “Mulai Discovery”, then WhatsApp opens with the correct QIRA number and prefilled message.
- Given JavaScript-enabled modern Chrome, Firefox, Safari, or Edge, when the home page loads, then the primary content is visible without layout overflow.
- Given keyboard-only navigation, when the visitor traverses interactive controls, then focus order and visible focus state are usable.
- Given a production build, when automated CI runs, then type-check, unit tests, and build complete successfully.

## Success Metrics

| Metric | Initial target | Review period |
|---|---:|---|
| Primary CTA click-through rate | ≥ 3% | First 30 days |
| CTA destination accuracy | 100% | Every release |
| Mobile Lighthouse accessibility | ≥ 90 | Every release |
| Qualified Discovery conversations | Establish baseline | First 30 days |

## Release Gate

QIRA Founder confirms positioning, legal identity, WhatsApp number, privacy wording, and production domain before release.

---

# Future Enhancements

Voice AI

Video AI

Live AI Demo

Interactive ROI Calculator

Marketplace Preview

Customer Portal Preview

Partner Portal

AI Avatar

---

# Related Documents

QF-004 Product Philosophy

QF-005 Platform Principles

QF-009 Information Architecture

QF-015 UI/UX Principles

PRD-0002 AI Receptionist

PRD-0003 AI Consultant

---

End of Document
