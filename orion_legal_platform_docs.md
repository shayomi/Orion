# Orion Legal Platform – Full Documentation

---

## Table of Contents

1. [MVP Definition](#1-mvp-definition)
   - 1.1 [MVP Goal](#11-mvp-goal)
   - 1.2 [MVP Scope](#12-mvp-scope)
   - 1.3 [MVP Success Criteria](#13-mvp-success-criteria)
   - 1.4 [Roadmap: What Comes After MVP](#14-roadmap-what-comes-after-mvp)
2. [Product Requirements & Delivery Spec](#2-product-requirements--delivery-spec)
   - 2.1 [Product Overview](#21-product-overview)
   - 2.2 [Core Product Capabilities](#22-core-product-capabilities)
   - 2.3 [Functional Requirements](#23-functional-requirements)
   - 2.4 [Non-Functional Requirements](#24-non-functional-requirements)
   - 2.5 [User Journey (End-to-End)](#25-user-journey-end-to-end)
   - 2.6 [Use Cases & Acceptance Criteria](#26-use-cases--acceptance-criteria)
   - 2.7 [Key Domain Coverage](#27-key-domain-coverage)
   - 2.8 [Critical Product Principles](#28-critical-product-principles)
   - 2.9 [Clarifications Required](#29-clarifications-required)
3. [Architecture Pack](#3-architecture-pack)
   - 3.1 [Architecture Principle](#31-architecture-principle)
   - 3.2 [Recommended Technical Structure](#32-recommended-technical-structure)
   - 3.3 [AI Architecture](#33-ai-architecture)
   - 3.4 [Core Data Model](#34-core-data-model)
   - 3.5 [Rules Engine vs AI](#35-rules-engine-vs-ai)
   - 3.6 [Security & Compliance Requirements](#36-security--compliance-requirements)
   - 3.7 [Engineering Work Packages](#37-engineering-work-packages)
   - 3.8 [Detailed Project Plan](#38-detailed-project-plan)
   - 3.9 [Sprint Plan](#39-sprint-plan)
   - 3.10 [Roles & Responsibilities](#310-roles--responsibilities)
   - 3.11 [Key Risks](#311-key-risks)
   - 3.12 [Delivery Checkpoints](#312-delivery-checkpoints)
   - 3.13 [Decision Log](#313-decision-log)

---

## 1. MVP Definition

### 1.1 MVP Goal

Deliver the core founder journey as:

> **Sign up → complete legal health check → see issues and priority → ask AI for explanation → generate a document or request expert help.**

---

### 1.2 MVP Scope

#### In Scope

1. **User account and startup profile** — Users can register, sign in, create a startup, and define core structure details such as stage and jurisdiction.
2. **Legal health check** — A guided questionnaire that adapts based on startup profile and structure. It must produce a legal health result, issue list, and risk level.
3. **Issue dashboard** — A simple screen showing:
   - overall health status
   - identified issues
   - severity
   - recommended next step
4. **Recommendation engine** — Each issue must be mapped to one of three resolution paths:
   - self-serve guidance
   - document generation
   - human expert referral
5. **AI chatbot** — A context-aware assistant linked to the startup profile and assessment results, used to explain issues and next actions. It must include disclaimers and must escalate out-of-scope or high-risk matters.
6. **Document generator** — A limited first set of templates, for example:
   - NDA
   - founder agreement
   - contractor agreement
   - IP assignment
7. **Referral request flow** — Users can request expert help; the system passes issue context and tracks status.

#### Out of Scope

- Advanced accelerator analytics
- Automated provider marketplace matching
- Deep multi-jurisdiction support beyond the first launch markets
- Highly customised contract negotiation workflows
- Full case management
- Litigation workflows

---

### 1.3 MVP Success Criteria

- Founders complete the health check without help
- Issues are understandable
- Users can take meaningful action
- Documents can be generated successfully
- Complex issues convert into referrals

---

### 1.4 Roadmap: What Comes After MVP

#### Phase 1: MVP

**Target outcome:** A working product for founders that proves the "diagnose, explain, act, escalate" loop.

Deliver:
- Registration and login
- Startup profile
- Health check
- Issue dashboard
- Basic recommendations
- AI chatbot
- First document templates
- Referral request flow

#### Phase 2: Operational Scale

**Target outcome:** A more complete product for repeat usage and team workflows.

Deliver:
- Notifications and reminders
- Richer reporting
- Provider management workflow
- Improved recommendation logic
- Expanded template library
- Admin tools for managing questionnaires, rules, and templates

#### Phase 3: Institutional Product

**Target outcome:** Support accelerators and portfolio users at scale.

Deliver:
- Accelerator onboarding
- Cohort dashboard
- Risk heatmap
- Startup-by-startup comparison
- Intervention views and downloadable reports

#### Phase 4: Jurisdiction and Intelligence Expansion

**Target outcome:** Broader market relevance and smarter resolution.

Deliver:
- More jurisdictions
- Richer rules by legal domain
- More legal document packs
- Stronger benchmarking and insight reporting
- Smarter referral routing

---

## 2. Product Requirements & Delivery Spec

### 2.1 Product Overview

The platform is a legal operating system for startups that enables:

- Legal health assessment
- Risk identification and prioritisation
- Guided resolution (self-serve + human)
- Document generation
- Access to legal experts
- Portfolio visibility for accelerators

---

### 2.2 Core Product Capabilities

| # | Module |
|---|--------|
| 1 | User & Startup Profile Management |
| 2 | Legal Health Check Engine |
| 3 | Risk Scoring & Issue Dashboard |
| 4 | Recommendation Engine |
| 5 | AI Legal Chatbot |
| 6 | Contract Generator |
| 7 | Referral Marketplace (Legal Experts) |
| 8 | Accelerator Dashboard |
| 9 | Notifications & Reminders |
| 10 | Reporting & Analytics |

---

### 2.3 Functional Requirements

#### User Account & Profile

- Users must be able to create and manage accounts
- Users must be able to create startup profiles
- Users must be able to define jurisdiction structure and company stage

#### Legal Health Check Assessment

- System must provide a questionnaire
- Must adapt dynamically based on startup profile and entity structure
- Must score responses, assign risk levels, and generate issue summaries and recommendations

#### Recommendation Engine

- Map issues to actions
- Classify actions: self-service, document-based, or human-assisted
- Prioritise by urgency and impact

#### AI Chatbot

- Natural language legal Q&A
- Context-aware (linked to startup profile and health check results)
- Must explain legal concepts, suggest actions, include disclaimers, and escalate when needed

#### Contract Generator

- Select document type
- Guided input flow
- Generate editable and downloadable outputs
- Must support jurisdiction-aware templates and future localisation

#### Referral Flow (Marketplace)

- Users can request expert help
- System must attach issue context and route to relevant providers
- Must support booking/request flow and status tracking

#### Accelerator Features

- Onboard multiple startups
- View cohort risk summaries and individual startup insights
- Identify high-risk startups needing intervention

#### Notifications & Reminders

- Incomplete assessments
- Critical issue alerts
- Renewal reminders
- Action prompts

#### Reporting

- Founder reports
- Accelerator portfolio reports
- Referral reports
- Product analytics

---

### 2.4 Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Security & Compliance** | Role-based access control; sensitive and legal data protection mandatory |
| **Performance** | Fast response time for core flows; reliable system behaviour |
| **Scalability** | Must scale across multiple startups, cohorts, and jurisdictions |
| **Usability** | Founder-friendly UX; simple and intuitive workflows |
| **AI Governance** | AI must include disclaimers, safeguards, and escalation rules |
| **Auditability** | Reports and recommendations must be traceable; actions must be auditable |
| **Extensibility** | Modular jurisdiction expansion; localisation support |

---

### 2.5 User Journey (End-to-End)

#### Founder Journey

> Sign up → Create startup profile → Complete legal health check → Receive legal score & issue list → Review recommendations → Interact with chatbot → Take action via documents, guidance, or referrals

#### Accelerator Journey

> Onboard startups → View portfolio dashboard → Monitor risk levels & trends → Identify high-risk startups → Intervene

#### Legal Provider Journey

> Receive structured issue summary → Accept/refuse request → Engage startup → Provide resolution

---

### 2.6 Use Cases & Acceptance Criteria

#### Use Case 1: Complete Legal Health Check

**Actor:** Founder

**Acceptance Criteria:**
- User can complete questionnaire without assistance
- Questions adapt based on profile
- System generates risk score, issue list
- Issues are understandable and actionable

#### Use Case 2: Generate Legal Document

**Actor:** Founder

**Acceptance Criteria:**
- User selects document type
- Completes guided inputs
- System generates valid document
- Document is downloadable/editable
- Jurisdiction logic is applied

#### Use Case 3: Get Legal Guidance via Chatbot

**Actor:** Founder

**Acceptance Criteria:**
- Chatbot responds contextually
- Provides explanation and actions
- Includes disclaimer
- Escalates when needed

#### Use Case 4: Request Expert Help

**Actor:** Founder

**Acceptance Criteria:**
- User submits request
- Issue context is attached
- Provider receives structured summary
- Status tracking available

#### Use Case 5: Accelerator Monitoring

**Actor:** Accelerator Manager

**Acceptance Criteria:**
- Dashboard shows all startups
- Risk heatmap available
- High-risk startups identifiable
- Reports downloadable

---

### 2.7 Key Domain Coverage

Must support detection and workflows across:

- Incorporation & structure
- Equity & founder relationships
- Governance
- Employment compliance
- IP
- Contracts
- Privacy & data
- Regulation
- Tax
- Investment readiness

---

### 2.8 Critical Product Principles (Non-Negotiable)

- Must provide early risk visibility
- Must enable guided resolution (not just diagnosis)
- Must support hybrid model (AI + human)
- Must support cross-border structures
- Must support institutional users (accelerators)

---

### 2.9 Clarifications Required

| Topic | Question |
|-------|----------|
| **Data** | Are documents stored within the platform or externally (e.g. S3/SharePoint)? |
| **AI Boundaries** | What level of AI autonomy is allowed — purely assistive or semi-decisioning? What triggers mandatory escalation? |
| **Marketplace** | How are providers onboarded, vetted, ranked, and matched? |
| **Payments / Monetisation** | How are revenues implemented — subscriptions, pay-per-document, referral commission? |
| **Compliance** | Which regulatory frameworks apply initially — GDPR, jurisdiction-specific constraints? |
| **Access Control** | What roles exist beyond founder, accelerator, and provider (e.g. internal admin, auditor)? |
| **Reporting Depth** | Are reports static PDFs, dynamic dashboards, or exportable data? |

---

## 3. Architecture Pack

### 3.1 Architecture Principle

This will be built as a modular web platform. Without overcomplicating the MVP, we will start with a well-structured backend and frontend that can later split into more services if growth requires it.

The product has six main parts:

1. **User and startup setup** — Records the identity of the user and the specific startup being evaluated.
2. **Assessment engine** — Runs the legal health check; decides which questions to ask and how to score the answers.
3. **Issue and recommendation engine** — Turns answers into issues, severity, and recommended next steps.
4. **AI assistant layer** — Does not make legal decisions. Explains flagged issues in simple language and suggests what to do next.
5. **Document generation** — Uses user-provided information to complete structured templates. For MVP, template-driven generation, not free-form AI drafting.
6. **Referral workflow** — Lets users request expert support and pass along the issue summary.

---

### 3.2 Recommended Technical Structure

#### Frontend

A web app for founders, accelerator users (later), and internal admin users.

> React or Next.js is a sensible choice — it supports fast product iteration and clear role-based screens.

#### Backend

A backend API handling:
- User authentication
- Assessment rules
- Issue scoring
- Document generation
- Referral workflow
- AI orchestration

> Node.js or Python backend is suitable. The exact language is less important than keeping the code modular and well-owned.

#### Database

Relational database (PostgreSQL) for:
- Users
- Startups
- Entity structures
- Assessments
- Issues
- Recommendations
- Referrals
- Audit records

#### File Storage

Secure object storage for generated documents and exported reports.

#### Notifications

Email service first; in-app notifications in a future iteration.

---

### 3.3 AI Architecture

#### How the LLM Will Be Used

AI will be used in a controlled way — not as an open chatbot that "does everything." The exact model will be chosen after testing latency, cost, and output quality rather than locking it in early.

#### Recommended AI Design

A backend **AI Orchestrator** sits between the user and the LLM.

**Flow:**
1. User asks a question
2. Backend collects context: startup profile, flagged issues, relevant recommendations
3. Backend sends a structured prompt to the LLM
4. Backend checks the response before returning it
5. System logs the interaction for audit and quality review

#### What the AI Should Do

- Explain a flagged issue
- Answer "what does this mean?"
- Explain why a document is recommended
- Guide the user to next steps
- Suggest when human help is needed

#### What the AI Should Not Do

- Claim to provide legal advice
- Invent jurisdiction-specific rules not grounded in the platform's known scope
- Override the platform's issue logic
- Generate final decisions on high-risk matters

#### Recommended Response Rules

Every AI response in MVP must:
- Use plain language
- Include a disclaimer
- Point to a next action
- Escalate where needed

#### Delivery Decision

The engineering team will run a short spike to compare:
- Answer quality
- Response speed
- Cost per conversation
- Consistency of disclaimer behaviour

---

### 3.4 Core Data Model

| Record | Description |
|--------|-------------|
| **User** | Who is using the platform |
| **Startup** | The company being assessed |
| **Entity structure** | How the startup is set up across jurisdictions |
| **Assessment** | The questionnaire session |
| **Assessment responses** | The user's answers |
| **Legal issue** | A specific problem identified by the platform |
| **Recommendation** | What the system says the user should do next |
| **Document** | A generated legal document |
| **Referral** | A request for expert help |
| **Audit log** | A record of important actions, especially AI output, document generation, and referrals |

---

### 3.5 Rules Engine vs AI

This distinction must be kept clear for delivery control:

| Layer | Purpose |
|-------|---------|
| **Rules engine** | Source of truth for questionnaire logic, issue scoring, severity, and recommended path |
| **AI** | Explainer layer for making issues understandable, helping the user act, and answering follow-up questions |

This reduces legal risk and makes testing easier.

---

### 3.6 Security & Compliance Requirements

For the MVP, the team will deliver:

- Secure login
- Role-based permissions
- Encryption in transit and at rest
- Audit logging for AI, documents, and referrals
- Access controls so users only see their own startup data
- Environment separation for dev, test, and production

---

### 3.7 Engineering Work Packages

#### Work Package 1: Foundation
**Includes:** environments, repo setup, authentication, user roles, startup profile structure
**Output:** A user can sign up, sign in, and create a startup.

#### Work Package 2: Assessment Engine
**Includes:** questionnaire schema, branching logic, scoring logic, issue creation
**Output:** A user can complete an assessment and get a result.

#### Work Package 3: Issue Dashboard and Recommendations
**Includes:** dashboard UI, issue details, recommendation mapping
**Output:** The user can understand the outcome and what to do next.

#### Work Package 4: AI Assistant
**Includes:** prompt design, backend orchestration, disclaimer logic, escalation rules, testing and monitoring
**Output:** The user can ask contextual questions safely.

#### Work Package 5: Document Generator
**Includes:** template storage, input forms, variable mapping, document rendering, file storage
**Output:** The user can generate and download first templates.

#### Work Package 6: Referral Flow
**Includes:** help request form, issue summary packaging, provider routing workflow, status tracking
**Output:** Complex issues can be handed off to humans.

#### Work Package 7: Reporting and Notifications
**Includes:** reminder emails, basic founder report, operational reporting for internal admin
**Output:** The product supports follow-through and monitoring.

---

### 3.8 Detailed Project Plan

**Delivery model:**
- Stage gates for business control
- 2-week sprints for engineering delivery
- Prioritised backlog owned by Product
- Weekly reporting for management
- Demos at the end of each sprint

**Suggested overall timeline: ~24 weeks**

#### Stage 0: Initiation (2 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 001 | Project Kickoff & Team Setup | 2d | Delivery Manager |
| 002 | Confirm MVP Scope | 3d | Product Lead |
| 003 | Define Target Jurisdiction & Domains | 2d | Product & Legal |
| 004 | Define AI Usage & Guardrails | 3d | Product & AI Lead |
| 005 | Architecture Definition | 4d | Tech Lead |
| 006 | Environment Setup (Dev/Test) | 5d | DevOps |
| 007 | Backlog Creation (Epics & Stories) | 4d | Product |
| 008 | OpenAI / LLM Spike (model selection) | 5d | AI Engineer |
| 009 | Stage Gate Approval | 1d | Steering Group |

#### Stage 1: Foundation (4 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 010 | Repo Setup & CI/CD | 3d | DevOps |
| 011 | Authentication (Login/Register) | 5d | Backend |
| 012 | Role-Based Access Setup | 3d | Backend |
| 013 | User Profile Service | 5d | Backend |
| 014 | Startup Profile Schema | 4d | Backend |
| 015 | Startup Profile UI | 5d | Frontend |
| 016 | Audit Logging Framework | 4d | Backend |
| 017 | QA Setup (Test framework) | 4d | QA |
| 018 | Stage Gate Review | 1d | Delivery Manager |

#### Stage 2: Assessment Engine (5 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 019 | Questionnaire Model Design | 4d | Product & Backend |
| 020 | Question Flow Engine | 6d | Backend |
| 021 | Response Capture API | 4d | Backend |
| 022 | Dynamic Logic (branching rules) | 6d | Backend |
| 023 | Risk Scoring Engine | 6d | Backend |
| 024 | Issue Generation Logic | 5d | Backend |
| 025 | Issue Dashboard UI | 6d | Frontend |
| 026 | Recommendation Mapping Engine | 5d | Backend |
| 027 | QA Testing (Assessment Flow) | 5d | QA |
| 028 | Stage Gate Review | 1d | Delivery Manager |

#### Stage 3: Action Layer (6 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 029 | AI Orchestrator Service | 6d | Backend & AI |
| 030 | Prompt Template Design | 4d | AI Engineer |
| 031 | Context Builder (profile & issues) | 5d | Backend |
| 032 | Chatbot API Integration | 5d | Backend |
| 033 | Chatbot UI | 5d | Frontend |
| 034 | AI Output Validator & Disclaimers | 4d | Backend |
| 035 | Document Template Design | 5d | Legal & Product |
| 036 | Document Generator Engine | 6d | Backend |
| 037 | Document Input UI | 5d | Frontend |
| 038 | File Storage Integration | 3d | Backend |
| 039 | QA Testing (AI & Documents) | 6d | QA |
| 040 | Stage Gate Review | 1d | Delivery Manager |

#### Stage 4: Referral & Operations (4 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 041 | Referral Workflow Design | 3d | Product |
| 042 | Referral API | 5d | Backend |
| 043 | Referral UI (request & status) | 5d | Frontend |
| 044 | Notification Service (Email) | 5d | Backend |
| 045 | Reminder Logic | 4d | Backend |
| 046 | Reporting (Founder summary) | 5d | Backend |
| 047 | Admin Dashboard (basic) | 5d | Frontend |
| 048 | QA Testing (End-to-End) | 6d | QA |
| 049 | Stage Gate Review | 1d | Delivery Manager |

#### Stage 5: Hardening & Launch (2 Weeks)

| ID | Task | Duration | Owner |
|----|------|----------|-------|
| 050 | Security Review & Fixes | 5d | Tech Lead |
| 051 | Performance Testing | 4d | QA |
| 052 | Bug Fixing & Stabilisation | 6d | Engineering |
| 053 | UAT (User Acceptance Testing) | 5d | Product & Users |
| 054 | Production Deployment Setup | 3d | DevOps |
| 055 | Go-Live Deployment | 1d | DevOps |
| 056 | Monitoring & Support Setup | 3d | DevOps |
| 057 | Project Closure & Handover | 2d | Delivery Manager |

#### Stage Deliverables Summary

| Stage | Deliverable |
|-------|-------------|
| Stage 1 | Users can sign up |
| Stage 2 | System finds legal issues |
| Stage 3 | Users can act (AI & documents) |
| Stage 4 | Users can escalate to experts |
| Stage 5 | System is secure and live |

#### Critical Path

**Core Product Flow:**
> Startup Profile → Assessment Engine → Issue Engine → Recommendation → AI → Document/Referral

**AI Dependency Chain:**
> LLM Selection → AI Orchestrator → Prompt Design → Chatbot API → UI → Validation

**Document Flow:**
> Template Design → Generator Engine → UI → Storage → QA

#### System Dependencies (High-Risk — Track Weekly)

| Area | Dependency | Risk |
|------|------------|------|
| AI | OpenAI API availability | Blocks chatbot |
| Legal | Template & rules definition | Blocks assessment & documents |
| Backend | DB schema stability | Impacts all services |
| DevOps | Environment readiness | Delays entire build |
| Security | Audit & RBAC | Blocks go-live |

---

### 3.9 Sprint Plan

| Stage | Sprint | Duration | Key Activities | Outputs | Stage Gate Question |
|-------|--------|----------|----------------|---------|---------------------|
| **Stage 0** | — | 2 weeks | Approve scope, assign roles, confirm jurisdictions, agree AI boundaries, run LLM spike | Approved initiation pack, delivery plan, architecture baseline, backlog v1, AI evaluation decision | Are we ready to build? |
| **Stage 1** | Sprint 1 | 2 weeks | Repo & environments, auth & user roles, base UI shell, startup profile schema | — | — |
| | Sprint 2 | 2 weeks | Startup creation screens, entity structure input, audit logging baseline, test automation | Working login, startup profile, basic admin visibility | Can users enter the product and create usable startup records? |
| **Stage 2** | Sprint 3 | 2 weeks | Questionnaire model, question flow, answer capture | — | — |
| | Sprint 4 | 2 weeks | Branching logic, scoring framework, issue categories and severity model | — | — |
| | Sprint 5 | 2 weeks | Results page, issue detail pages, recommendation mapping v1 | End-to-end health check, issue dashboard, first recommendation paths | Can the product diagnose and present value clearly? |
| **Stage 3** | Sprint 6 | 2 weeks | AI orchestrator, prompt templates, disclaimer and escalation logic | — | — |
| | Sprint 7 | 2 weeks | Chatbot UI, context injection, logging and QA review loop | — | — |
| | Sprint 8 | 2 weeks | Document generator v1, template forms, file output and storage | Working AI assistant, first document generation flow | Can users address the identified issues? |
| **Stage 4** | Sprint 9 | 2 weeks | Referral request flow, issue summary handoff, referral status tracking | — | — |
| | Sprint 10 | 2 weeks | Reminders and notifications, founder summary report, operational dashboards | Human escalation path, reminder flow, basic reporting | Can the product safely handle complex issues and support operations? |
| **Stage 5** | Sprint 11 | 2 weeks | Security review, performance tuning, bug fixing, UAT | — | — |
| | Sprint 12 | 2 weeks | Production release prep, launch checklist, go-live support, monitoring | MVP release, operational handover, release report | Is the product ready for live users? |

#### Sprint Cadence and Delivery Rituals

**Every sprint:**
- Sprint planning
- Daily stand-up
- Mid-sprint risk review
- Sprint demo
- Retrospective

**Every week — Delivery Manager publishes:**
- Progress against stage goals
- Top risks and blockers
- Scope changes requested
- Delivery confidence rating

**Every stage boundary — Review:**
- Budget and timeline
- Business case validity
- Product readiness
- Risk level
- Whether to continue as planned or adjust

---

### 3.10 Roles & Responsibilities

| Role | Description |
|------|-------------|
| **Delivery Manager** | Drives the plan, risks, dependencies, reporting, ceremonies, and stage readiness |
| **Product Lead / Product Owner** | Owns feature priority, acceptance criteria, and trade-offs |
| **Tech Lead** | Owns engineering design, coding standards, and technical decisions |
| **Engineers** | Build the product |
| **QA / Test Lead** | Owns test coverage, defect tracking, and release quality |
| **AI Owner** | Owns prompt design, model evaluation, response review criteria, and safety behaviour |

---

### 3.11 Key Risks

| ID | Risk | Response |
|----|------|----------|
| RK001 | AI gives misleading answers | Controlled prompts, backend orchestration, disclaimer enforcement, escalation rules, response QA sampling |
| RK002 | Scope grows too quickly | Freeze MVP scope after Stage 0; route additions into post-MVP backlog; use stage gates to resist uncontrolled expansion |
| RK003 | Legal logic is not strong enough | Legal expert review before releasing each assessment domain; keep scoring rule-based; do not let AI decide severity |
| RK004 | Document generator becomes too complex | Start with a small template set; avoid bespoke clause builders in MVP |
| RK005 | Cross-jurisdiction complexity slows delivery | Launch with a clear jurisdiction boundary; design for expansion later, not at MVP |

---

### 3.12 Delivery Checkpoints

| Checkpoint | Criteria |
|------------|----------|
| End of Stage 1 | Users can sign up and create startups |
| End of Stage 2 | Users can complete a health check and receive issues |
| End of Stage 3 | Users can understand issues via AI and generate documents |
| End of Stage 4 | Users can request expert help and receive reminders |
| End of Stage 5 | The MVP can go live safely |

---

### 3.13 Decision Log

The following decisions should be locked within the first 10 working days:

| ID | Decision | Status |
|----|----------|--------|
| D001 | First launch jurisdiction | TBD |
| D002 | First 3–5 legal domains | TBD |
| D003 | First document set | TBD |
| D004 | Definition of "high-risk" for escalation | TBD |
| D005 | Human referral operating model | TBD |
| D006 | Chosen OpenAI model family after spike | TBD |
| D007 | Hosting and data residency approach | TBD |
| D008 | Whether accelerator dashboard is MVP or Phase 2 | TBD |
