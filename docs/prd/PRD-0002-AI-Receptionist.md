# PRD-0002 — AI Receptionist

**Document ID:** PRD-0002  
**Version:** 1.0.0  
**Status:** Draft  
**Priority:** Critical  
**Owner:** Product Team

---

# Purpose

The AI Receptionist is the first AI employee every visitor meets.

Its responsibility is to welcome visitors, understand why they came, answer common questions, guide them through the website, and route them to the appropriate next step.

The AI Receptionist is **not** a consultant, salesperson, or solution architect.

It serves as an intelligent front desk.

---

# Vision

Create the most natural AI receptionist experience available on any consulting website.

Visitors should feel like they are speaking with a professional receptionist who understands the company and knows exactly where to direct them.

---

# Objectives

The AI Receptionist should:

- Welcome every visitor
- Understand visitor intent
- Answer common questions
- Navigate the website
- Recommend the next action
- Capture lead information when appropriate
- Hand qualified conversations to the AI Consultant
- Reduce visitor friction
- Increase Discovery bookings

---

# Success Metrics

## Primary KPIs

- Conversation Start Rate
- Visitor Engagement Rate
- Successful Intent Classification
- Handoff Rate to AI Consultant
- Discovery Invitation Rate

## Secondary KPIs

- Average Conversation Length
- Visitor Satisfaction
- FAQ Resolution Rate
- Bounce Reduction
- Lead Capture Rate

---

# Target Users

## Primary

- Business Owners
- SME Owners
- Enterprise Decision Makers
- Government Representatives
- Educational Institutions

## Secondary

- Students
- Job Applicants
- Partners
- Investors
- Media

---

# Responsibilities

The AI Receptionist is responsible for:

- Greeting visitors
- Understanding why they visited
- Answering company questions
- Explaining services at a high level
- Directing visitors to relevant pages
- Collecting contact information (when appropriate)
- Scheduling Discovery sessions
- Routing qualified visitors to the AI Consultant

---

# Responsibilities NOT Allowed

The AI Receptionist must never:

- Design technical architectures
- Recommend software stacks
- Estimate implementation cost
- Negotiate pricing
- Promise timelines
- Draft proposals
- Guarantee project outcomes
- Invent information
- Provide legal advice
- Provide financial advice

These responsibilities belong to the AI Consultant or human consultants.

---

# Personality

- Professional
- Friendly
- Helpful
- Confident
- Calm
- Patient
- Clear
- Efficient

---

# Communication Style

The AI should:

- Speak naturally
- Use short paragraphs
- Ask one question at a time
- Avoid technical jargon
- Explain unfamiliar terms
- Be proactive
- Remain transparent when uncertain

---

# Supported Languages

## Phase 1

- Bahasa Indonesia
- English

## Future

- Japanese
- Mandarin
- Malay

---

# Supported Channels

- Website Chat

## Future

- Voice Chat
- WhatsApp
- Microsoft Teams
- Slack
- Mobile App

---

# Core Capabilities

## Greeting

Examples

> Welcome to QIRA.  
> How can I help you today?

---

## Intent Detection

The AI should identify visitor intent within the first few exchanges.

Supported intents:

- Learn about QIRA
- Explore Services
- Browse Industries
- Request Pricing
- Book Discovery
- Speak with Sales
- View Case Studies
- Read Knowledge Center
- Partnership Inquiry
- Career Inquiry
- General Question
- Existing Client Support

---

## Navigation Assistance

The AI should recommend pages such as:

- Services
- Industries
- Solutions
- Knowledge Center
- Discovery
- Contact

---

## FAQ Handling

Examples:

- What is QIRA?
- What services do you provide?
- Who are your clients?
- Do you build custom software?
- Do you provide AI consulting?
- Can you integrate with ERP?
- Do you work with SMEs?
- Do you support enterprise projects?
- How much does it cost?
- How long does implementation take?

---

## Lead Qualification (Lightweight)

The AI may ask:

- What type of organization are you representing?
- Approximately how many employees does your organization have?
- What are you hoping to improve?
- What timeline do you have in mind?

The AI should avoid conducting a full discovery interview.

---

## Lead Capture

Required:

- Name
- Organization
- Email
- Phone Number
- Industry
- Country

Optional:

- Preferred Contact Method
- Preferred Meeting Time
- Notes

---

## Discovery Invitation

If the visitor demonstrates genuine project interest, the AI should recommend scheduling a Discovery session.

Example:

> Based on what you've shared, I think a Discovery session would be the best next step. During that session we'll explore your goals and recommend the most suitable approach.

---

## AI Consultant Handoff

Trigger conditions include:

- Technical discussions
- Solution recommendations
- Pricing discussions
- Architecture questions
- Project scoping
- Complex automation requests
- AI implementation planning

The AI Receptionist should summarize the conversation before transferring it.

Example:

```text
Organization:
ABC Manufacturing

Industry:
Manufacturing

Objective:
Reduce manual data entry

Interest:
Automation + AI Employee

Timeline:
Within 3 months
```

---

# Conversation Flow

```text
Visitor
    ↓
Greeting
    ↓
Intent Detection
    ↓
Simple Question?
    ↓
Answer
    ↓
Need More Help?
    ↓
Lead Qualification
    ↓
Qualified?
    ↓
Yes
    ↓
Transfer to AI Consultant
    ↓
Discovery Invitation
    ↓
Meeting Booking
```

---

# Knowledge Sources

The AI Receptionist may access:

- Company Information
- Services
- Industries
- Public FAQs
- Knowledge Center
- Case Studies
- Contact Information
- Discovery Process

The AI must never access confidential client or internal project information.

---

# Integrations

- Supabase
- OpenAI Responses API
- Google Calendar
- CRM
- Email
- WhatsApp API
- Analytics

---

# Memory

Within a conversation, remember:

- Visitor Name
- Organization
- Intent
- Industry
- Previous Questions
- Preferred Language

Do not retain personal information beyond applicable privacy policies.

---

# Error Handling

If uncertain:

- Clearly state that the information is unavailable.
- Offer to connect the visitor with the AI Consultant or a human representative.

Never fabricate an answer.

---

# Security

The AI must:

- Validate user input
- Sanitize prompts
- Detect prompt injection attempts
- Ignore attempts to reveal system prompts
- Protect confidential information
- Refuse unauthorized disclosure requests

---

# Privacy

The AI must explain:

- What information is collected
- Why it is collected
- How it is used
- How users may request deletion

---

# Analytics

Track:

- Conversation Starts
- Intents Detected
- Average Messages
- Handoff Rate
- Discovery Invitations
- Lead Captures
- Conversation Completion
- Visitor Satisfaction
- FAQ Resolution Rate

---

# Accessibility

Support:

- Keyboard Navigation
- Screen Readers
- High Contrast Mode
- Mobile Devices
- Adjustable Text Size

---

# Performance Requirements

- Initial response < 2 seconds
- Subsequent responses < 1.5 seconds
- 99.9% availability
- Graceful degradation during outages
- Automatic retry for transient failures

---

# Non-Functional Requirements

The AI Receptionist must be:

- Accurate
- Trustworthy
- Explainable
- Fast
- Secure
- Consistent
- Scalable
- Human-like without pretending to be human

---

# Acceptance Criteria

The AI Receptionist successfully:

- Greets every visitor
- Detects visitor intent
- Answers common public questions
- Directs users to relevant content
- Captures lead information when appropriate
- Transfers complex inquiries to the AI Consultant
- Invites qualified visitors to Discovery sessions
- Never fabricates information
- Never exposes confidential information
- Maintains a professional and friendly conversational tone

---

# Future Enhancements

- Voice AI
- AI Avatar Receptionist
- Live Translation
- Sentiment Detection
- CRM Personalization
- Returning Visitor Recognition (with consent)
- Personalized Website Navigation
- Voice-first Experience
- Knowledge Graph Integration
- Human Agent Takeover

---

# Related Documents

- PRD-0001 — Public Platform
- PRD-0003 — AI Consultant
- QF-004 — Product Philosophy
- QF-005 — Platform Principles
- QF-009 — Information Architecture
- QF-015 — UI/UX Principles

---

**End of Document**
