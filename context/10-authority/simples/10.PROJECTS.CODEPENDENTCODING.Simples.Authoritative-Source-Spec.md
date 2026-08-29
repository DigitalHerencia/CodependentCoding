---
title: The Simples™ — Authoritative Source Specification
type: architecture-specification
scope: domain-library
project: Codependent Coding
domain: simples
artifact: master-source-document
namespace: codependentcoding.simples.authoritative
status: active
authority: canonical
parent: codependentcoding.webapp-architecture.master.source-document
supersedes_in_part:
  - simples-as-every-architectural-artifact-category
created: 2026-08-22
updated: 2026-08-22
---

# The Simples™

## Authoritative Domain-Library Building Block Specification

**Status:** Canonical Source Specification  
**Architecture:** The Codependent Coding™ WebApp Architecture  
**Domain Library:** The Maximal Template™  
**Configuration System:** The Anthimeria™ Workbench  
**Application Definition:** The Virgule™  
**Generated Artifact:** The Arrangement™  

---

# 1. Governing Definition

The canonical definition is:

```text
SIMPLES™
=
PureUI Blocks™ Presentation Layer
+
BusinessLogic Blocks™ Domain Workflows
```

A **Simple™** is therefore one of two normalized block families exposed from The Maximal Template™ Domain Library:

1. a **PureUI Block™**, which is a normalized reusable presentation constitution; or
2. a **BusinessLogic Block™**, which is a normalized reusable domain Workflow constitution.

This specification supersedes broader earlier wording that treated every architectural artifact category—routes, features, fetchers, actions, schemas, integrations, navigation, and similar files—as first-class Simples.

Those lower-level artifacts remain essential architecture-owned constituents, but **they are not themselves top-level Simples™ under the canonical definition in this document**.

---

# 2. Canonical Equation

```text
                         SIMPLES™
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        PureUI Blocks™          BusinessLogic Blocks™
      Presentation Layer          Domain Workflows
                │                       │
                ▼                       ▼
        component/blocks            workflows
                │                       │
                ▼                       ▼
         UI Primitives          Server Operations
                │               + Helpers
                ▼               + Types / Interfaces
             Variants           + Schemas
                │               + Integrations
                ▼               + Data Transport
     Semantic Design Tokens     + Cache / Constants / Utils
```

The two block families are peers in the Simples catalog.

They are not interchangeable.

---

# 3. PureUI Blocks™

A **PureUI Block™** is a pure reusable UI composition implemented in:

```text
components/blocks/
```

The canonical presentation constitution is:

```text
PureUI Block™
      ↓
Component Block
      ↓
UI Primitives
      ↓
Primitive Variants
      ↓
Semantic Design Tokens
```

Equivalent shorthand:

```text
PureUI Blocks™
=
components/blocks/*
constituted from
components/ui/*
+
variants
+
semantic design tokens
```

## 3.1 PureUI responsibility

A PureUI Block MAY:

- compose UI Primitives;
- expose block variations;
- expose presentation-safe props;
- render runtime data passed into it;
- render configurable content passed into it;
- use Semantic Design Tokens;
- use presentation-only local state where appropriate;
- emit interaction callbacks defined by the Feature contract.

A PureUI Block MUST NOT:

- import a BusinessLogic Block / Workflow;
- own persisted reads;
- own persisted writes;
- own authorization decisions;
- own provider behavior;
- open Prisma transactions;
- implement domain calculations;
- hard-code user-configurable copy;
- own route-level page spacing.

## 3.2 UI Primitives

UI Primitives are the lowest reusable presentation units used to constitute PureUI Blocks.

Examples include:

```text
Button
Input
Textarea
Checkbox
Radio Group
Select
Switch
Slider
Label
Card
Dialog
Drawer
Sheet
Accordion
Tabs
Badge
Progress
Skeleton
Avatar
Table
Calendar
Charts
and the other normalized primitives actually present in The Maximal Template
```

A Primitive is not itself a Simple™ under the canonical definition.

It is a **constituent of a PureUI Block™**.

## 3.3 Variants

Variants provide normalized alternative presentation behavior or styling while preserving the Primitive or Block contract.

Examples may include:

- Button variants;
- Block layout variations;
- density variations;
- visual emphasis variations;
- size variations;
- compatible interaction-presentation alternatives.

Variants change presentation, not normalized business semantics.

## 3.4 Semantic Design Tokens

Semantic Design Tokens are the configurable visual variables that style UI Primitives and therefore propagate through PureUI Blocks.

They include source-backed categories such as:

- background / foreground;
- card / popover surfaces;
- primary / secondary / accent;
- muted / destructive / success / warning / info;
- border / input / ring;
- chart palettes;
- radii;
- hover / active / focused presentation;
- normalized breakpoints.

The Maximal Template implementation—principally `app/globals.css` and its canonical presentation support files—remains the implementation source of truth.

---

# 4. BusinessLogic Blocks™

A **BusinessLogic Block™** is a normalized Domain Workflow.

Canonical identity:

```text
BusinessLogic Block™ = Domain Workflow
```

Implementation boundary:

```text
lib/workflows/{domain}/*Workflow.ts
```

The canonical behavioral constitution is:

```text
BusinessLogic Block™
      ↓
Domain Workflow
      ↓
Server Operations
+ Helpers
+ Types
+ Interfaces
+ Schemas
+ Integrations
+ Data Transport
+ Cache / Constants / Utils
```

Equivalent shorthand:

```text
BusinessLogic Blocks™
=
Domain Workflows
constituted from
server operations
+
helpers
+
types / interfaces
+
schemas
+
architecture-owned lib capabilities
```

---

# 5. Constituted, Not Composable

BusinessLogic Blocks™ follow the doctrine:

> **Constituted, Not Composable.**

A Workflow is the named behavioral relationship among existing architecture-owned capabilities.

Its constituents remain in their canonical owners:

```text
lib/auth/
lib/authz/
lib/actions/
lib/fetchers/
lib/integrations/
lib/db/selects/
lib/db/dto/
lib/db/transactions/
lib/cache/
lib/constants/
lib/utils/
schemas/
types/
```

A Workflow does not physically absorb, duplicate, or relocate those files.

Removing one Workflow removes that named behavioral constitution; it does not necessarily remove shared constituents still required by another Workflow.

---

# 6. Simples Are Blocks, Constituents Are Not Simples

The canonical distinction is:

| Unit | Is a Simple™? | Role |
|---|---:|---|
| PureUI Block™ / Component Block | Yes | Reusable presentation block |
| BusinessLogic Block™ / Workflow | Yes | Reusable behavioral block |
| UI Primitive | No | Constituent of a PureUI Block |
| Primitive Variant | No | Presentation variation of a constituent |
| Semantic Design Token | No | Styling constituent |
| Action | No | Server operation constituent |
| Fetcher | No | Server operation constituent |
| Auth / Authz helper | No | Server capability constituent |
| Transaction | No | Data/persistence constituent |
| Prisma Select | No | Data projection constituent |
| DTO Mapper | No | Data transport constituent |
| Schema | No | Runtime validation constituent |
| Type / Interface | No | Compile-time contract constituent |
| Integration helper | No | Provider constituent |
| Cache / Constant / Utility | No | Supporting constituent |
| Route | No | App Router boundary |
| Feature | No | Orchestration boundary that uses Simples |
| Page Template | No | Presentation topology for Feature placement |
| Shell / Navigation | No | Structural presentation architecture |

This table is normative.

---

# 7. Feature Orchestration Uses Both Simple Families

A Feature is where the two Simple families meet.

```text
Route
  ↓
Feature
  ├──────────────────────────┐
  │                          │
  ▼                          ▼
PureUI Block™        BusinessLogic Block™
  │                          │
  ▼                          ▼
UI presentation          Domain behavior
```

A Feature answers:

> **What application capability must this interface expose?**

The PureUI Block answers:

> **How is that capability presented?**

The BusinessLogic Block answers:

> **What normalized application behavior constitutes that capability?**

---

# 8. Presentation and Behavioral Constitution

The architecture deliberately mirrors the two sides:

```text
PRESENTATION CONSTITUTION

UI Primitives
    +
Variants
    +
Semantic Design Tokens
        ↓
PureUI Block™
```

```text
BEHAVIORAL CONSTITUTION

Server Operations
    +
Helpers
    +
Types / Interfaces
    +
Schemas
    +
Integrations / Data Transport
        ↓
BusinessLogic Block™
```

The symmetry is conceptual, not permission to configure both sides identically.

---

# 9. Anthimeria Relationship

Anthimeria exposes the PureUI constitution as the normal user-configurable surface.

The user may configure supported presentation choices such as:

```text
PureUI Block selection
Block variation
compatible Primitive constitution
Primitive variants
Semantic Design Tokens
content/copy
```

BusinessLogic Blocks remain normalized by the selected Ontology.

Anthimeria may inspect or explain normalized Workflow relationships, but it MUST NOT treat server operations and helper files as arbitrary end-user toggles.

---

# 10. Ontology Relationship

An Ontology is a normalized preset that associates application surfaces and Features with the Simples required to realize them.

Conceptually:

```text
Ontology
   ↓
routes / features / shared foundation
   ↓
Feature
   ├── PureUI Block™
   └── BusinessLogic Block™
```

The nine canonical Ontologies are defined in the Ontologies authority package.

A Block or Workflow becomes a currently supported canonical Simple only when it belongs to the supported Maximal Template / normalized Ontology inventory or the canonical shared presentation inventory.

Generator support remains the truth test.

---

# 11. Maximal Template Relationship

The Maximal Template is the runnable superset implementation containing all supported Simples and all architecture-owned constituents required to realize them.

```text
The Maximal Template™
├── PureUI Blocks™
│   └── UI Primitive / variant / token constituents
└── BusinessLogic Blocks™
    └── server-operation / helper / type / schema constituents
```

The generator retains, removes, or transforms source according to the normalized Virgule and dependency graph.

The generated Arrangement contains real source code, not serialized TypeScript hidden inside configuration blobs.

---

# 12. Virgule Relationship

Virgule records normalized application choices and resolved dependencies.

For Simples, the important distinction is:

```text
presentation selections
    → may identify PureUI Block / variant choices

normalized behavior
    → references required BusinessLogic Blocks
      determined by the Ontology / Feature graph
```

Virgule MUST NOT redefine a Workflow's behavioral constitution merely because presentation changed.

---

# 13. Dependency Rules

## 13.1 PureUI dependency graph

```text
PureUI Block
    ↓
required / optional UI Primitives
    ↓
supported variants
    ↓
Semantic Design Tokens
```

## 13.2 BusinessLogic dependency graph

```text
BusinessLogic Block
    ↓
exact Workflow constitution
    ↓
server operations + helpers + contracts
```

An exact Workflow constitution MUST be machine-resolvable.

It MUST NOT be fabricated from filename similarity.

---

# 14. Compatibility Rules

A PureUI Block may expose user-configurable Primitive substitutions only where the semantic interaction contract remains valid.

Examples:

- a command control may change presentation only if it still invokes the required command;
- a data-display Block cannot replace a required mutation form;
- hiding a control cannot weaken authorization;
- a variant cannot silently remove behavior required by the Feature contract.

Presentation compatibility is therefore constrained, not arbitrary.

---

# 15. Canonical Scope

The current canonical BusinessLogic Block library contains 74 normalized Workflows across nine Ontologies.

The current PureUI library consists of:

- the shared presentation Blocks;
- the normalized domain Blocks defined by the supported Ontology inventory;
- their source-backed UI Primitive constitutions;
- their supported variants and Semantic Design Tokens.

Future business-domain examples are not canonical Simples until explicitly added to the normalized supported inventory.

---

# 16. Naming Rules

Canonical terminology:

```text
Simples™
PureUI Blocks™
BusinessLogic Blocks™
Domain Workflows
UI Primitives
Variants
Semantic Design Tokens
Workflow Constitution
```

Avoid using `Simple` as a synonym for every architecture-owned source file.

Avoid calling an Action, Fetcher, Schema, or Type a Simple merely because it is dependency-resolved by the generator.

---

# 17. Codex Rules

When implementing or documenting Simples, Codex MUST:

1. treat only PureUI Blocks and BusinessLogic Blocks as canonical Simples;
2. keep UI Primitives as PureUI constituents;
3. keep server operations/helpers/contracts as BusinessLogic constituents;
4. preserve Component Block purity;
5. preserve Workflow architectural ownership;
6. never move business logic into presentation;
7. never move presentation into Workflows;
8. never invent exact per-Workflow constituent mappings;
9. preserve source-backed `[STUB — BUILD]` status;
10. distinguish current supported inventory from future-domain vocabulary;
11. use the normalized Ontology inventory as the current support boundary;
12. preserve the Anthimeria rule that presentation is configurable while behavior is normalized.

---

# 18. Canonical Sentence

> **Simples™ are the two normalized block families of The Maximal Template™ Domain Library: PureUI Blocks™ constitute reusable presentation from UI Primitives, variants, and Semantic Design Tokens; BusinessLogic Blocks™ constitute reusable domain behavior as Workflows formed from architecture-owned server operations, helpers, types, interfaces, schemas, integrations, and data capabilities. Features use both block families to expose normalized application capabilities, while Anthimeria configures the presentation constitution without redefining the behavioral constitution.**
