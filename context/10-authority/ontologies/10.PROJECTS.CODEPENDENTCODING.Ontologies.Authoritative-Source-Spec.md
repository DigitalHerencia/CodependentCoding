---
title: The Ontology™ Normalized Defaults — Authoritative Source Specification
type: architecture-specification
scope: application-definition
project: Codependent Coding
domain: ontologies
artifact: master-source-document
namespace: codependentcoding.ontologies.authoritative
status: active
authority: canonical
parent: codependentcoding.webapp-architecture.master.source-document
created: 2026-08-22
updated: 2026-08-22
---

# The Ontology™ Normalized Defaults

## Authoritative Starter Specification

**Status:** Canonical Source Specification  
**Architecture:** The Codependent Coding™ WebApp Architecture  
**Domain Library:** The Maximal Template™  
**Building Blocks:** Simples™  
**Configuration System:** The Anthimeria™ Workbench  
**Application Definition:** The Virgule™  
**Generated Artifact:** The Arrangement™  

---

# 1. Governing Definition

An **Ontology™** is one of nine normalized default application presets over the same Virgule™ Application Definition.

The canonical Ontology set is:

1. CRM / Pipeline Tracker
2. Project Management / Task Tracker
3. Customer Support / Ticketing
4. Marketing Automation & Analytics
5. Invoicing & Expense Tracker
6. Social Media Scheduler
7. AI-Powered Wrapper / Micro-SaaS
8. B2B Client Portal
9. Internal Tools / Admin Portal

An Ontology is not a separate template repository and not a separate product.

Each Ontology is a normalized starting constitution over the common Maximal Template.

---

# 2. Canonical Ontology Table

| Ontology | Primary surfaces | Representative workflows | Common integrations |
|---|---|---|---|
| CRM / Pipeline Tracker | pipeline, contacts, accounts, analytics | deal stage, stalled deal, pipeline value, velocity | email, optional Stripe |
| Project Management / Task Tracker | projects, backlog, task detail, timeline, my tasks | dependencies, health, milestone progress | Blob, Cloudinary, email |
| Customer Support / Ticketing | inbox, ticket workspace, knowledge base, SLA analytics | SLA, escalation, priority, assignment | email, Blob, Cloudinary |
| Marketing Automation & Analytics | campaigns, audiences, analytics | audience rules, sequences, attribution | email, Cloudinary, analytics providers |
| Invoicing & Expense Tracker | invoices, invoice editor, expenses, billing | totals, taxes, invoice status, expense rules | Stripe, Blob, optional OCR |
| Social Media Scheduler | calendar, composer, media | publish time, variants, publishing lifecycle | Cloudinary, Blob, social providers |
| AI-Powered Wrapper / Micro-SaaS | generation, playground, usage | usage, credits, rate limits, model selection | Hugging Face, optional model providers, Stripe |
| B2B Client Portal | shared dashboard, documents, billing | approvals, project state, document lifecycle | Blob, Cloudinary, Stripe, email |
| Internal Tools / Admin Portal | records, users, audit | audit classification, bulk operations | provider admin surfaces as required |

---

# 3. Shared Foundation

Every Ontology draws from the same common foundation:

```text
shared foundation
├── public/product surfaces
├── authentication
├── onboarding
├── settings
├── navigation
├── shells
├── organization/membership
├── authorization
├── database foundation
├── validation
└── common error/loading infrastructure
```

The shared foundation is substrate.

It is not a tenth Ontology.

---

# 4. Configuration Equation

The normalized application definition is:

```text
shared foundation
+ ontology preset
+ user overrides
+ selected optional capabilities
+ selected presentation variants
+ required dependencies
= normalized and validated Virgule
```

Within the current Anthimeria authority, user overrides are principally presentation configuration.

The Ontology remains the authority for normalized behavioral constitution.

---

# 5. Ontology → Route → Feature → Simples

The canonical application grammar is:

```text
Ontology
    ↓
App Router surfaces
    ↓
Features
    ↓
┌────────────────────────────┐
│                            │
▼                            ▼
PureUI Block™       BusinessLogic Block™
```

The canonical normalized inventory records relationships in the form:

```text
Route
→ Feature
→ Page Template
→ Blocks / Workflows
```

Page Templates define presentation topology.

PureUI Blocks and BusinessLogic Blocks are the two Simple families.

---

# 6. Ontologies Use Simples

An Ontology selects and associates supported Simples.

```text
Ontology
├── normalized routes
├── normalized features
├── Page Templates / presentation topology
├── PureUI Blocks™
├── BusinessLogic Blocks™
├── required constituent dependencies
└── optional integrations
```

An Ontology does not convert routes, features, templates, actions, or fetchers into Simples.

Simples remain the two canonical Block families defined by the Simples authority package.

---

# 7. Behavioral Authority

BusinessLogic Blocks / Workflows associated with an Ontology are normalized application behavior.

The user does not arbitrarily rewrite those Workflow associations in Anthimeria.

A Workflow constitution resolves its required server operations, helpers, schemas, types, integrations, and data capabilities.

Exact constituent subsets require explicit Workflow constitution manifests.

---

# 8. Presentation Authority

After Ontology selection, Anthimeria may allow presentation customization over normalized pages and features.

Examples:

```text
page topology
Feature Slot arrangement
compatible PureUI Block
Block variation
compatible UI Primitive constitution
Primitive variant
Semantic Design Tokens
content
```

Presentation customization MUST NOT alter the normalized behavioral semantics of the selected Ontology.

---

# 9. Optional Capabilities and Integrations

An Ontology may expose optional supported capabilities and integrations.

Optional does not mean arbitrary.

The resolver must:

- validate support;
- close dependencies;
- preserve required architecture;
- reject incompatible combinations;
- retain provider-owned boundaries.

Generator support remains the truth test.

---

# 10. Shared Foundation Rules

The shared foundation SHOULD be reused consistently across Ontologies.

Examples:

- auth surfaces use common identity infrastructure;
- organization/membership semantics remain common unless explicitly specialized;
- shared settings and navigation remain architecture-compatible;
- common error/loading states remain reusable;
- common validation and database substrate remain consistent.

An Ontology adds domain constitution to this substrate rather than rebuilding the entire application architecture.

---

# 11. Ontology Support Boundary

The nine Ontologies are the currently canonical selectable default presets.

Wider business-domain vocabulary—HRIS, ERP, generalized e-commerce, FinTech, CMS, cybersecurity, and other future domains—may inform future work, but they are not canonical selectable Ontologies until explicitly normalized and supported by The Maximal Template and generator.

---

# 12. Anthimeria Relationship

Anthimeria begins with Ontology selection.

```text
Ontology selection
    ↓
normalized pages / features / behavior
    ↓
presentation configuration
    ↓
normalized + validated Virgule
```

Anthimeria is an adapter over shared configuration semantics.

It does not own a separate behavior rules engine.

---

# 13. Virgule Relationship

The Virgule records:

- selected Ontology;
- shared-foundation requirements;
- supported optional capabilities;
- normalized dependency closure;
- user presentation configuration;
- generation-relevant provenance.

Conceptual lifecycle:

```text
draft
  ↓
normalized
  ↓
validated
  ↓
dependency-closed
```

Only a valid dependency-closed definition is materialized into an Arrangement.

---

# 14. Arrangement Relationship

The Arrangement is the standalone white-label application produced from:

```text
dependency-closed Virgule
+
The Hipster Stack generator
+
The Maximal Template
=
The Arrangement
```

The Arrangement contains:

- the selected Ontology behavior;
- the required shared foundation;
- the configured presentation;
- the required dependency-closed implementation.

It has no runtime dependency on Anthimeria.

---

# 15. Maximal Template Relationship

The Maximal Template is one superset implementation containing all supported material needed across the nine Ontologies.

Therefore:

```text
9 Ontologies
≠
9 template repositories
```

Instead:

```text
1 Maximal Template
+
9 normalized Ontology presets
+
1 shared resolution model
```

The generator prunes/transforms the superset according to the normalized definition.

---

# 16. Canonical Invariants

1. There are nine canonical default Ontologies.
2. All nine inherit from the shared foundation.
3. Ontologies are presets over one normalized definition model.
4. Ontologies select normalized application capability graphs.
5. Features associate presentation and behavior.
6. PureUI Blocks and BusinessLogic Blocks are the canonical Simples.
7. Presentation may be customized within compatibility rules.
8. BusinessLogic remains normalized by the Ontology.
9. Dependency closure is automatic and validated.
10. Optional integrations are limited to supported provider capabilities.
11. Wider future-domain vocabulary is not automatically canonical.
12. Generated Arrangements remain standalone source applications.

---

# 17. Codex Rules

When implementing or documenting Ontologies, Codex MUST:

- preserve the nine canonical names;
- preserve the shared-foundation relationship;
- use the canonical route → feature → template → block/workflow inventory;
- preserve `[STUB — BUILD]` implementation status;
- not invent routes, features, Workflows, or integrations absent from the supported inventory;
- distinguish optional integrations from required ones;
- preserve the Simples definition from the Simples authority package;
- preserve the Anthimeria presentation-only customization boundary;
- never infer exact Workflow constituent subsets from filenames;
- keep one Maximal Template rather than splitting Ontologies into separate applications.

---

# 18. Canonical Sentence

> **An Ontology™ is one of nine normalized default application presets over the shared foundation and the same Virgule™ Application Definition. It associates supported App Router surfaces and Features with Page Templates, PureUI Blocks™, BusinessLogic Blocks™, required architecture-owned constituents, and supported integrations. Anthimeria begins from that normalized behavioral constitution and customizes presentation; the resolver validates and closes dependencies; and The Hipster Stack materializes the resulting Virgule against The Maximal Template as The Arrangement™.**
