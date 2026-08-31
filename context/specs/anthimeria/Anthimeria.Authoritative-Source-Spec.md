---
title: The Anthimeria™ Workbench — Authoritative Configuration Architecture
type: architecture-specification
scope: product
project: Codependent Coding
domain: anthimeria
artifact: master-source-document
namespace: codependentcoding.anthimeria.authoritative
status: active
authority: canonical
supersedes_in_part:
  - 10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.The-Anthimeria-Workbench.md
clarifies:
  - 10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.BusinessLogic-Blocks.md
  - 10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.Ontologies-Normalized-Defaults.md
tags:
  - codependent-coding/anthimeria
  - architecture/configuration
  - architecture/presentation
  - maximal-template
  - virgule
  - arrangement
  - status/active
created: 2026-08-22
updated: 2026-08-22
---

# The Anthimeria™ Workbench

## Authoritative Configuration Architecture

**Status:** Canonical Source Specification  
**Architecture:** The Codependent Coding™ WebApp Architecture  
**Technology Stack:** The Hipster Stack™  
**Domain Library:** The Maximal Template™  
**Configuration System:** The Anthimeria™ Workbench  
**Application Definition:** The Virgule™  
**Generated Artifact:** The Arrangement™  
**Generator / Enforcement:** Loaded Vibes™

---

# 1. Purpose

The Anthimeria™ Workbench is the stateless visual configuration application for constituting the **presentation of a supported application** from The Maximal Template™.

The user begins from one of the nine normalized Domain Ontologies™. The selected Ontology supplies the normalized application capability graph: routes, features, BusinessLogic™ Blocks, workflow constitutions, server operations, helpers, schemas, types, integrations, and dependency closure.

Anthimeria does **not** allow the user to redesign that behavioral graph.

Anthimeria allows the user to customize the **presentation constitution** of the normalized application:

```text
Domain Ontology™
        ↓
normalized application capability graph
        ↓
routes + features + BusinessLogic™ Blocks
        ↓
fixed behavioral constitution
        ↓
THE ANTHIMERIA™ WORKBENCH
        ↓
configurable presentation constitution
        ↓
page topology
        ↓
Feature Slots
        ↓
Component Blocks + variants
        ↓
UI Primitives + variants
        ↓
Semantic Design Tokens
        ↓
Content
        ↓
Virgule™ Application Definition
        ↓
The Arrangement™
```

The governing boundary is:

> **The user configures presentation. The selected Ontology determines behavior.**

---

# 2. Canonical Correction: Presentation Is Configurable; Business Logic Is Normalized

Earlier Anthimeria material described selecting or deselecting Workflows and other logic-level options.

That model is superseded by this specification.

## 2.1 User-configurable surface

The Anthimeria user MAY configure:

- which normalized page they are editing;
- page topology within that page;
- the number and arrangement of Feature Slots;
- which compatible presentation Block occupies each Feature Slot;
- Block variation;
- the UI Primitives used by a configurable Block where the Block contract permits substitution;
- Primitive variants;
- Semantic Design Tokens;
- typography;
- color;
- radius;
- borders;
- spacing exposed as presentation configuration;
- hover, active, focused, and related interaction presentation;
- configurable content and copy;
- other presentation-only options represented by The Maximal Template.

## 2.2 Normalized, non-user-configurable behavior

The Anthimeria user MUST NOT arbitrarily configure:

- BusinessLogic™ Blocks;
- Workflow membership;
- Workflow constituent files;
- Actions;
- Fetchers;
- Auth;
- Authz;
- Transactions;
- Prisma Selects;
- DTO Mappers;
- schemas;
- types;
- interfaces;
- provider mechanics;
- cache mechanics;
- behavioral invariants;
- persistence rules;
- authorization rules;
- dependency closure.

These are determined by the selected Ontology and the normalized Feature capability.

Anthimeria MAY display these relationships for explanation, inspection, dependency visualization, or validation. They are not ordinary end-user controls.

---

# 3. Canonical Product Model

The complete model has two constitutions that meet at Feature Orchestration.

```text
                         FEATURE
                      /           \
                     /             \
                    ↓               ↓
      PRESENTATION CONSTITUTION   BEHAVIORAL CONSTITUTION
                    │               │
            PureUI Presentation     │
                 Layer™             │
                    ↓               ↓
             Component Block   BusinessLogic™ Block
                    ↓               ↓
            UI Primitives        Workflow
                    ↓               ↓
               Variants        Server Operations
                    ↓               +
          Semantic Design       Helpers / Schemas /
              Tokens            Types / Integrations
```

The Feature is the application-capability orchestration boundary where normalized behavior is mapped into configurable presentation.

---

# 4. Top-Down Application Constitution

The authoritative decomposition remains:

```text
Domain Ontology™
        ↓
App Router
├── Page Routes
└── Webhook Handlers
        ↓
Feature Orchestration
└── Feature Components
    ├── PureUI Presentation Layer™
    │   └── Component Blocks
    │       └── UI Primitive + Variant
    │           └── Semantic Design Tokens
    │
    └── BusinessLogic Blocks™
        └── Workflows
            ├── Server Operations
            │   ├── Auth / Authz
            │   ├── Actions
            │   └── Fetchers
            ├── Integrations
            ├── Utils
            ├── Data Transport
            │   ├── DTO Mappers
            │   ├── Prisma Selects
            │   └── Transactions
            ├── Helpers
            │   ├── Constants
            │   ├── Params
            │   └── Cache
            ├── Types
            ├── Interfaces
            └── Zod Schemas
```

Anthimeria adds a presentation-configuration topology over the normalized page/feature layer:

```text
Route Group
        ↓
layout.tsx
        ↓
Shell
├── Header / Navigation
├── shared main page frame
└── Footer
        ↓
Page Route
        ↓
Page Template
        ↓
Feature Slots
        ↓
Feature Components
        ↓
PureUI Blocks
```

---

# 5. Page Frame vs. Page Topology

Page layout has two different owners.

## 5.1 Route-group `layout.tsx` owns the shared page frame

The route-group layout and its Shell establish presentation invariants shared by every page in the route family.

They own concerns such as:

- header and footer application;
- navigation shell;
- maximum content width;
- common horizontal gutters;
- common outer vertical padding;
- shared responsive page bounds;
- persistent mobile navigation where applicable;
- route-family presentation chrome.

A Component Block MUST NOT independently recreate route-level page padding merely because it is rendered on a page.

## 5.2 Page Templates own internal page topology

A Page Template defines the geometry inside the shared page frame.

It owns:

- CSS Grid structure;
- rows;
- columns;
- responsive stacking;
- row spans;
- column spans;
- inter-slot gaps;
- slot ordering;
- slot sizing rules.

A Page Template does **not** own application behavior.

A Page Template does **not** hard-code which business capability must occupy every slot.

---

# 6. Feature Slots

A **Feature Slot** is a named placement boundary inside a Page Template into which a normalized Feature presentation is rendered.

The cyan rectangles used in Anthimeria page mockups represent Feature Slots.

They are **Workbench visualization**, not mandatory generated runtime styling.

## 6.1 One-slot page

```text
┌─────────────────────────────────┐
│                                 │
│             SLOT A              │
│                                 │
└─────────────────────────────────┘
```

## 6.2 Three stacked slots

```text
┌─────────────────────────────────┐
│             SLOT A              │
├─────────────────────────────────┤
│             SLOT B              │
├─────────────────────────────────┤
│             SLOT C              │
└─────────────────────────────────┘
```

## 6.3 Six-slot grid

```text
┌────────────────┬────────────────┐
│     SLOT A     │     SLOT B     │
├────────────────┼────────────────┤
│     SLOT C     │     SLOT D     │
├────────────────┼────────────────┤
│     SLOT E     │     SLOT F     │
└────────────────┴────────────────┘
```

## 6.4 Mixed-span layout

```text
┌────────────────┬────────────────┐
│     SLOT A     │     SLOT B     │
├────────────────┴────────────────┤
│             SLOT C              │
├─────────────────────────────────┤
│             SLOT D              │
└─────────────────────────────────┘
```

The Workbench may provide normalized templates and also a constrained grid editor capable of representing equivalent supported topologies.

---

# 7. Page Configuration Flow

After Ontology selection, the user configures presentation in this order:

```text
1. Select a normalized page to customize
        ↓
2. Select or construct its supported Page Template topology
        ↓
3. Inspect Feature Slots
        ↓
4. Select a compatible Component Block / Block Variant for each slot
        ↓
5. Configure the Block's permitted UI Primitive constitution
        ↓
6. Configure Primitive variants
        ↓
7. Configure Semantic Design Tokens
        ↓
8. Configure content / copy
        ↓
9. Preview
        ↓
10. Normalize + validate Virgule
        ↓
11. Generate The Arrangement
```

The Workflow graph remains attached to the normalized Feature throughout this process.

---

# 8. Feature Orchestration

A Feature answers:

> **What application capability must this interface expose?**

A Feature is where the normalized behavioral constitution meets the configured presentation constitution.

Conceptually:

```text
                 Feature
           ┌────────┼────────┐
           │        │        │
           ↓        ↓        ↓
      Workflow    Content   PureUI Block
         │          │          │
         │          └────┐     │
         │               │     │
         └──── data ─────┼────→ props/view model
                         │
                         ↓
                       render
```

A Feature MAY:

- invoke or consume normalized Workflows;
- consume Fetchers or Actions directly when the canonical architecture allows it;
- map behavioral results into presentation-safe data;
- import configurable content;
- map content into Block props;
- select the configured compatible Block variation;
- establish client/server boundaries;
- coordinate application state needed by the interface.

A Feature MUST NOT:

- reimplement Workflow responsibilities;
- place business rules in a Component Block;
- hard-code user-editable copy into the Block;
- allow UI configuration to silently change business behavior;
- import presentation implementation into a Workflow.

---

# 9. PureUI Presentation Layer™

The PureUI Presentation Layer™ is the user-configurable presentation constitution.

```text
Feature
    ↓
Component Block
    ↓
UI Primitive + Variant
    ↓
Semantic Design Tokens
```

## 9.1 Component Block

A Component Block is a pure reusable UI composition.

A Block SHOULD:

- render from props;
- expose stable presentation contracts;
- consume UI Primitives;
- use variants rather than duplicating whole implementations;
- receive user-facing copy through props/content mapping;
- receive runtime application data through props/view models;
- remain independent from Workflows and server operations.

A Block MUST NOT:

- import Workflows;
- import Fetchers merely to obtain its own application data;
- own business calculations;
- decide authorization;
- own transaction logic;
- own provider behavior;
- hard-code user-configurable text.

## 9.2 UI Primitive

A UI Primitive is the lowest reusable presentation component.

Examples include Button, Input, Card, Badge, Dropdown Menu, Dialog, Table, Tabs, Accordion, and chart primitives.

Primitives may expose normalized variants.

## 9.3 Semantic Design Tokens

Semantic tokens provide the configurable visual vocabulary shared across primitives and blocks.

Anthimeria may represent them through graphical controls for:

- palettes;
- background/foreground pairs;
- borders;
- radii;
- typography;
- hover behavior;
- active behavior;
- focus behavior;
- chart palettes;
- responsive breakpoints;
- other normalized visual variables.

The source of truth remains the semantic-token implementation represented by The Maximal Template, principally `app/globals.css` and the canonical palette implementation where present.

---

# 10. Content Is an Independent Presentation Input

User-editable copy MUST be segregated from Component Block implementation.

Examples:

```text
heading
eyebrow
description
button label
field label
helper text
empty-state message
FAQ question
FAQ answer
navigation label
invoice presentation labels
```

These belong to content/configuration.

Runtime application values are different:

```text
record ID
persisted user name
invoice total
authorization state
workflow result
provider status
database status
```

The Feature maps both categories into the Block:

```text
content.ts ──────────┐
                     │
workflow/data ───────┼──→ Feature mapping → Component Block
                     │
presentation config ─┘
```

A demo fixture MAY provide fake runtime-looking data from a content or fixture file, but production architecture MUST preserve the distinction between configurable copy and operational data.

---

# 11. BusinessLogic™ Blocks

A BusinessLogic™ Block is a Workflow.

> **A Workflow is a named reusable workflow that constitutes application logic from existing server operations and helpers.**

BusinessLogic™ Blocks are the behavioral equivalent of Component Blocks:

```text
PRESENTATION

UI Primitives
      ↓
constitute
      ↓
Component Block
```

```text
BEHAVIOR

Server Operations + Helpers
      ↓
constitute
      ↓
BusinessLogic™ Block / Workflow
```

The analogy does not imply identical configuration semantics.

**Component Blocks are user-configurable presentation. BusinessLogic™ Blocks are normalized application behavior.**

---

# 12. Constituted, Not Composable

BusinessLogic™ Blocks remain governed by **Constituted, Not Composable**.

A Workflow is the named behavioral relationship among its existing architecture-owned constituents.

Those constituents remain in their own canonical locations:

```text
lib/auth/
lib/authz/
lib/actions/
lib/fetchers/
lib/integrations/
lib/utils/
lib/db/selects/
lib/db/dto/
lib/db/transactions/
lib/cache/
lib/constants/
schemas/
types/
```

Anthimeria MUST NOT model a Workflow as a bag of arbitrary source toggles.

The exact per-Workflow constituent subset MUST come from an explicit canonical Workflow constitution. It MUST NOT be inferred from filename similarity.

---

# 13. Ontology Normalization

The nine normalized Domain Ontologies™ are the starting application recipes:

1. CRM / Pipeline Tracker Ontology™
2. Project Management / Task Tracker Ontology™
3. Customer Support / Ticketing System Ontology™
4. Marketing Automation & Analytics Ontology™
5. Invoicing & Expense Tracker Ontology™
6. Social Media Scheduler Ontology™
7. AI-Powered Wrapper / Micro-SaaS Ontology™
8. B2B Client Portal Ontology™
9. Internal Tools / Admin Portal Ontology™

Selecting an Ontology establishes:

- the supported route graph;
- normalized Features;
- normalized BusinessLogic™ Blocks;
- normalized Workflow associations;
- supported integrations;
- required server-operation/helper inventory;
- dependency constraints;
- normalized presentation candidates;
- shared foundation requirements.

The user then customizes the presentation of that normalized application.

---

# 14. Shared Foundation

All nine Ontologies inherit from the common application foundation:

```text
Shared Foundation
├── Public / Product
├── Authentication
├── Onboarding
├── Dashboard / App Shell
├── User Profile
├── Organization / Membership
├── Settings
├── Billing when selected
├── Integrations Settings when selected
├── Navigation / Shells
├── Common Auth/Authz
├── Database Foundation
├── Validation
├── Error / Loading States
└── Common Tenant Infrastructure
```

Presentation configuration of shared foundation pages follows the same page-template → Feature Slot → Block → Primitive → Token model where applicable.

---

# 15. Compatibility and Safe Customization

Not every Primitive may replace every other Primitive.

Not every Block may represent every Feature.

Therefore Anthimeria MUST use compatibility contracts.

A compatible presentation option MUST preserve the semantic interaction contract required by the normalized Feature.

Examples:

- a command Button MAY be replaceable by a Dropdown Menu only when the configured control can still invoke the same permitted command contract;
- a read-only stat Block cannot replace an editable form when mutation input is required;
- a table Block cannot silently remove required approval controls;
- visual hiding MUST NOT weaken authorization or remove a required security boundary.

The Workbench MAY prevent invalid substitutions, disable incompatible controls, or show dependency/compatibility explanations.

---

# 16. Dependency Graph Semantics

Anthimeria has two different dependency concerns.

## 16.1 Presentation compatibility

The Workbench resolves relationships such as:

```text
Block
    ↓
required / optional UI Primitives
    ↓
supported variants
    ↓
supported Semantic Design Tokens
```

## 16.2 Behavioral dependency closure

The Ontology resolver resolves:

```text
Feature
    ↓
BusinessLogic™ Block
    ↓
Workflow constitution
    ↓
Server Operations + Helpers
```

The user does not manually manipulate behavioral closure.

---

# 17. Virgule™ Representation

The Virgule™ Application Definition records the user's presentation choices while retaining references to the normalized application capability graph.

Conceptually:

```yaml
application:
  ontology: crm

  presentation:
    pages:
      crm_pipeline:
        template: workspace
        slots:
          primary:
            feature: crm_pipeline
            block: kanban_board
            variant: dense
        tokens:
          radius: lg
          hover: scale
        content:
          title: Pipeline

  normalized_behavior:
    source: ontology
    editable: false
```

This is schematic, not a finalized machine schema.

The important invariant is:

> Virgule records what the user selected for presentation without redefining the Ontology's behavioral constitution.

---

# 18. The Arrangement™

The Arrangement™ is the standalone white-label application generated from a validated, dependency-closed Virgule against The Maximal Template™ and The Hipster Stack™.

The Arrangement:

- contains real source code;
- contains the normalized behavior required by the Ontology;
- contains the configured presentation;
- contains no runtime dependency on Anthimeria;
- does not need a hosted control plane;
- MUST preserve architecture boundaries after generation.

---

# 19. Generic Runtime Structure

A generated application SHOULD make the boundaries legible in the repository:

```text
app/
├── (public)/
│   ├── layout.tsx
│   └── ...
├── (auth)/
│   ├── layout.tsx
│   └── ...
└── (tenant)/
    ├── layout.tsx
    └── example/
        └── page.tsx

components/
├── navigation/
├── shells/
├── templates/
├── blocks/
└── ui/

content/
features/

lib/
├── actions/
├── auth/
├── authz/
├── cache/
├── constants/
├── db/
│   ├── dto/
│   ├── selects/
│   └── transactions/
├── fetchers/
├── integrations/
├── utils/
└── workflows/

schemas/
types/
```

The exact inventory depends on the normalized Ontology and generated Arrangement.

---

# 20. Spacing Ownership

Spacing MUST be owned at the correct level.

| Level | Owns |
|---|---|
| Route-group layout / Shell | Shared outer page width, gutters, main padding, header/footer relationship |
| Page Template | Grid rows, columns, spans, gaps, Feature Slot geometry |
| Component Block | Internal Block padding and component-specific rhythm |
| UI Primitive | Primitive-local spacing exposed by its variant contract |
| Semantic Tokens | Globally normalized presentation variables |

A Block MUST NOT depend on page-specific outer padding to render correctly.

A Template MUST NOT duplicate the Shell's outer page frame.

---

# 21. Authoritative Configuration Matrix

| Architectural unit | User configurable? | Authority |
|---|---:|---|
| Ontology starting recipe | Selectable starting point | Normalized ontology catalog |
| Normalized business capability | No | Ontology |
| Workflow association | No | Ontology / Feature contract |
| Workflow constitution | No | BusinessLogic™ Block constitution |
| Server operations/helpers | No | Architecture-owned implementation |
| Page to edit | Yes | Existing normalized route set |
| Page topology | Yes | Presentation configuration |
| Feature Slot layout | Yes | Page Template configuration |
| Compatible UI Block | Yes | Presentation catalog + compatibility contract |
| Block variant | Yes | Block contract |
| UI Primitive constitution | Yes, where permitted | Block compatibility contract |
| Primitive variant | Yes | Primitive contract |
| Semantic Design Tokens | Yes | Presentation token system |
| User-facing content | Yes | Content configuration |
| Runtime application data | No as presentation content | Feature/workflow/data path |
| Authorization semantics | No | Authz |
| Persistence semantics | No | Data/business architecture |

---

# 22. Required Workbench Views

The exact UI is implementation-specific, but Anthimeria SHOULD provide equivalent capabilities for:

1. **Ontology Picker** — choose one of the nine normalized starting recipes.
2. **Page Navigator** — choose a normalized page to customize.
3. **Template / Grid Editor** — select or configure supported page topology.
4. **Feature Slot Canvas** — visualize page slots and current assignments.
5. **Block Catalog** — browse compatible Blocks and variations.
6. **Block Inspector** — configure supported Primitive constitution and variants.
7. **Token Inspector** — graphical controls over Semantic Design Tokens.
8. **Content Inspector** — edit user-facing copy independent of component source.
9. **Logic Inspector** — read-only view of normalized Feature → Workflow → dependency relationships.
10. **Preview** — render the current presentation configuration.
11. **Validation View** — show incompatibilities or unresolved presentation contracts.
12. **Virgule Export / Generation Action** — normalize and pass the validated recipe to generation.

The logic inspector is informational. It is not a business-logic configurator.

---

# 23. Codex Implementation Rules

When implementing Anthimeria or a Maximal Template example, Codex MUST:

1. keep route pages thin;
2. keep route-group page-frame spacing in `layout.tsx` / Shell;
3. keep page subdivision in Page Templates;
4. represent subdivisions as named Feature Slots;
5. keep Component Blocks pure;
6. map all user-configurable copy from content/configuration;
7. map runtime data separately from configurable copy;
8. keep BusinessLogic™ Blocks in `lib/workflows/{domain}/`;
9. preserve `Constituted, Not Composable`;
10. never invent exact Workflow constituents where no constitution exists;
11. never allow presentation configuration to weaken Auth/Authz;
12. never move business calculations into Blocks;
13. never move UI concerns into Workflows;
14. preserve normalized Feature → Workflow associations from the selected Ontology;
15. validate Block/Primitive substitutions against compatibility contracts;
16. treat cyan Feature Slot outlines as Workbench visualization rather than mandatory Arrangement styling;
17. preserve the shared outer page frame across pages in the same route group.

---

# 24. Validation Invariants

An Anthimeria configuration is valid only when:

- the selected Ontology is supported;
- the page belongs to the normalized Ontology/shared foundation;
- the selected Page Template is supported;
- every Feature Slot has a valid state;
- every assigned Block is compatible with its normalized Feature;
- every configurable Primitive substitution satisfies the Block contract;
- every selected Primitive variant exists;
- every Semantic Design Token value is valid;
- required user-facing content exists;
- presentation configuration does not alter normalized Workflow semantics;
- normalized Workflow dependency closure is complete;
- no required behavioral dependency has been disabled by presentation configuration;
- generated route-group spacing remains centralized;
- generated Blocks contain no forbidden business behavior;
- generated Workflows contain no presentation dependencies.

---

# 25. Canonical Architecture Sentence

> **A Domain Ontology™ selects the normalized application capability graph. App Router routes expose those capabilities. Route-group layouts and Shells establish shared page framing. Page Templates subdivide the page into Feature Slots. Features map normalized behavior, operational data, configurable content, and presentation configuration into PureUI Component Blocks. Component Blocks are constituted from UI Primitives and variants styled by Semantic Design Tokens. BusinessLogic™ Blocks are fixed Workflow constitutions of server operations and helpers. Anthimeria allows the user to configure the presentation constitution while preserving the normalized behavioral constitution. Virgule records the resulting recipe, and Loaded Vibes/The Hipster Stack resolve it against The Maximal Template to generate The Arrangement™.**

---

# 26. Governing Principles

1. **Presentation is configurable. Behavior is normalized.**
2. **Layouts own the shared page frame. Templates own page topology.**
3. **Templates contain Feature Slots, not hard-coded application behavior.**
4. **Features are where behavior, data, content, and presentation meet.**
5. **Blocks are PureUI.**
6. **User-facing text is content, not component implementation.**
7. **Runtime data is not presentation content.**
8. **Workflows are BusinessLogic™ Blocks.**
9. **Workflows are constituted, not physically composed.**
10. **The user never manually edits dependency closure.**
11. **Presentation customization may vary appearance and compatible controls without changing business semantics.**
12. **The Arrangement contains real source code and preserves these boundaries.**

---

# 27. Companion Authorities

This source document is accompanied by:

- `10.PROJECTS.CODEPENDENTCODING.Anthimeria.Canonical-Catalog.md`
- `10.PROJECTS.CODEPENDENTCODING.Anthimeria.Generic-Reference-Implementation.md`

The catalog indexes the current normalized presentation and BusinessLogic™ inventories.

The generic reference implementation gives Codex a concrete, non-domain-specific implementation pattern for the architecture defined here.
