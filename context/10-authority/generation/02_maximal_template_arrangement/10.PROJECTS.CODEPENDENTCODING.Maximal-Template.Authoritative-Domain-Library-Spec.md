---
title: The Maximal Template™ Domain Library — Authoritative Source Specification
type: architecture-specification
scope: domain-library
project: Codependent Coding
domain: maximal-template
artifact: master-source-document
namespace: codependentcoding.maximal-template.authoritative
status: active
authority: canonical
repository_evidence: DigitalHerencia/TheMaximalTemplate
created: 2026-08-22
updated: 2026-08-22
---

# The Maximal Template™ Domain Library

## Authoritative Source Specification

# 1. Governing Definition

> **The Maximal Template™ Domain Library is the single runnable superset application containing every currently supported implementation that may be retained, removed, or transformed by The Hipster Stack™ during generation.**

It is a **real application repository**, not serialized source in configuration.

It contains the application implementations from which Arrangements are constituted.

---

# 2. One-Template Rule

```text
9 Ontologies
≠
9 template repositories
```

Canonical model:

```text
1 Maximal Template
+
9 Ontology presets
+
1 shared foundation
+
1 shared resolver
=
many supported Arrangements
```

The Maximal Template is the implementation superset.

Ontologies are normalized definitions over that superset.

---

# 3. Domain-Library Role

The Maximal Template contains supported implementation across:

```text
shared foundation
├── public/product surfaces
├── authentication
├── onboarding
├── navigation/shells
├── settings
├── organization/membership
├── authorization
├── database foundation
├── validation
├── error/loading infrastructure
└── optional shared capabilities

domain implementations
├── CRM
├── Project Management
├── Customer Support
├── Marketing Automation
├── Invoicing / Expenses
├── Social Media Scheduling
├── AI / Micro-SaaS
├── B2B Client Portal
└── Internal / Admin Tools

Simples
├── PureUI Blocks™
└── BusinessLogic Blocks™
```

The repository may also contain implementation constituents required by those Simples.

---

# 4. Architecture-Owned Source

A conforming maximal implementation makes architectural ownership legible.

Canonical source families include:

```text
app/
components/
content/
features/
lib/
prisma/
schemas/
types/
context/
tests / validation configuration
```

## Presentation

```text
components/ui
      ↓
components/blocks
      ↓
features
      ↓
app
```

React Hook Form features may consume UI primitives directly as the explicit form exception.

## Application behavior

```text
features
├── lib/fetchers
├── lib/actions
├── lib/workflows
├── lib/auth
├── lib/authz
├── lib/integrations
├── lib/db/selects
├── lib/db/dto
├── lib/db/transactions
├── lib/cache
├── lib/constants
└── lib/utils
```

Webhook HTTP boundaries remain under `app/api/.../route.ts`.

---

# 5. Simples Relationship

The Maximal Template is the implementation source for the currently supported Simples.

```text
Maximal Template
├── PureUI Blocks™
│   ├── Component Blocks
│   └── constituent primitives / variants / tokens
│
└── BusinessLogic Blocks™
    ├── Workflows
    └── constituent server operations / helpers / contracts
```

A source file does not become a Simple merely by existing in the repository.

The Simples authority package controls classification.

---

# 6. Ontology Relationship

Each Ontology identifies a normalized subset/constitution of the maximal source.

Conceptually:

```text
Ontology
├── routes
├── features
├── Page Templates
├── PureUI Blocks
├── BusinessLogic Blocks
├── integrations
├── shared foundation
└── required constituents
```

The generator resolves those requirements to artifact ownership.

The template itself does not implement nine independent applications.

---

# 7. Runnable Superset Requirement

The Maximal Template must remain a coherent runnable application.

This matters because:

- source is inspectable;
- supported implementations are testable;
- UI/demo surfaces can be reviewed;
- generator input is real code;
- source relationships remain visible;
- generated output is derived from proven application source rather than synthetic fragments.

A maximal template that becomes only a bag of disconnected snippets is non-conforming.

---

# 8. Public Demo vs Hardened Source

The live Maximal Template repository may expose a public demo edition in which application surfaces are browsable without forcing visitors through authentication.

That demo usability does not erase production architecture.

A supported generated application may restore/retain protected behavior according to its Ontology and dependency-closed Virgule.

Public inspectability is a showroom concern.

Auth/Authz, tenancy, provider, webhook, and persistence boundaries remain architecture concerns.

---

# 9. Content Separation

User-editable presentation copy belongs outside Block implementation.

```text
content
   ↓
Feature mapping
   ↓
PureUI Block props
```

Operational data belongs to workflows/fetchers/actions/data boundaries.

The Maximal Template must preserve the distinction so Anthimeria can configure copy without rewriting component source.

---

# 10. Generator Metadata Boundary

The Maximal Template owns application implementation.

Generator-only metadata belongs to the Hipster Stack when it exists solely to determine:

- artifact ownership;
- pruning;
- transform order;
- dependency closure;
- generation policy.

The template may contain application-local contracts/governance that should survive into an Arrangement.

It should not require the generated application to carry generator internals at runtime.

---

# 11. Artifact Classes

Useful artifact classification:

```text
FOUNDATION
REQUIRED_BY_ONTOLOGY
OPTIONAL_SUPPORTED
PRESENTATION_CONFIGURABLE
TRANSFORMABLE
REMOVABLE
SHARED
GENERATOR_ONLY
APP_LOCAL_GOVERNANCE
```

A single artifact may have multiple relevant facets.

Removal legality must be dependency-derived rather than guessed from pathname.

---

# 12. Retain / Remove / Transform

The materializer uses only three conceptual outcomes for source implementation:

## Retain

Copy source unchanged where the maximal implementation already matches the resolved Arrangement.

## Remove

Exclude only when:

- no retained capability requires it;
- artifact is legally removable;
- shared dependencies remain satisfied.

## Transform

Apply deterministic source/config changes such as:

- product identity;
- route mapping;
- presentation constitution;
- semantic tokens/content;
- provider/config composition;
- role/permission projection;
- package/env/config rewriting;
- generated contracts/provenance.

Transforms must remain bounded and deterministic.

---

# 13. Implementation Support Truth

A capability is not generator-supported merely because it is described in prose.

Support requires all material parts to exist:

```text
source implementation
+
ownership metadata
+
dependency resolution
+
transforms where required
+
validation
=
generator-supported capability
```

The Maximal Template and generator together define the practical support boundary.

---

# 14. Current Live Repository Evidence

The inspected `DigitalHerencia/TheMaximalTemplate` root includes:

```text
.agents/
.github/
AGENTS.md
ARCHITECTURE.md
README.md
app/
components/
content/
context/
features/
...
```

Its architecture map explicitly assigns:

- static public presentation to `app/(public)` + `components/blocks`;
- orchestration to `features`;
- reads to `lib/fetchers`;
- CRUD writes to `lib/actions`;
- selects/DTOs/transactions to `lib/db/*`;
- auth/authz to dedicated libraries;
- provider behavior to `lib/integrations/{provider}`;
- webhooks to `app/api/{provider}/.../route.ts`;
- remaining domain logic to `lib/workflows/{domain}`.

This is strong implementation evidence for the current architecture.

---

# 15. Transitional Identity Warning

The live README still uses older product-role language such as:

```text
Loaded Vibes™ Web App Architecture
Codependent Coding™ Knowledge System
```

The newest controlling direction instead defines:

```text
Codependent Coding™ WebApp Architecture
Hipster Stack™ generator/technology system
Maximal Template™ Domain Library
Loaded Vibes™ Codex plugin
```

The live README remains useful implementation evidence but must be reconciled before becoming public canonical Docs.

---

# 16. Canonical Invariants

1. One maximal superset application, not nine template repositories.
2. Template source is real source code.
3. Maximal Template owns application implementation.
4. Hipster Stack owns generator semantics.
5. Simples classification comes from the Simples authority.
6. Ontologies select normalized constitutions over the template.
7. The template remains runnable.
8. Blocks remain presentation-pure.
9. Workflows retain canonical behavioral boundaries.
10. User-editable content remains separable.
11. Artifact removal obeys dependency closure.
12. Shared constituents cannot be deleted casually.
13. Generator-only metadata does not become runtime application architecture.
14. Generated Arrangements preserve Codependent Coding architecture boundaries.

---

# 17. Canonical Sentence

> **The Maximal Template™ Domain Library is one runnable superset implementation of the Codependent Coding™ WebApp Architecture containing the shared foundation, every currently supported Ontology implementation, all canonical Simples, and their required architecture-owned constituents. The Hipster Stack resolves a dependency-closed Virgule against this real source repository and deterministically retains, removes, or transforms owned artifacts to produce an Arrangement™.**
