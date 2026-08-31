---
title: The Hipster Stack™ Technology Stack — Authoritative Constitution-System Specification
type: architecture-specification
scope: generation-system
project: Codependent Coding
domain: hipster-stack
artifact: master-source-document
namespace: codependentcoding.hipster-stack.authoritative
status: active
authority: canonical
repository_evidence: DigitalHerencia/TheHipsterStack
created: 2026-08-22
updated: 2026-08-22
---

# The Hipster Stack™ Technology Stack

## Authoritative Constitution-System Specification

**Status:** Canonical Source Specification  
**Architecture:** The Codependent Coding™ WebApp Architecture  
**Technology / Constitution System:** The Hipster Stack™ Technology Stack  
**Domain Library:** The Maximal Template™ Domain Library  
**Configuration Workbench:** The Anthimeria™ Workbench  
**Application Definition:** The Virgule™ Application Definition  
**Generated Artifact:** The Arrangement™ Generated Artifact  
**Agent Plugin:** Loaded Vibes™  

---

# 1. Governing Definition

> **The Hipster Stack™ Technology Stack is the concrete technology stack plus deterministic constitution/generation system and CLI that turns a normalized, dependency-closed Virgule™ Application Definition into a standalone Arrangement™ by resolving it against The Maximal Template™ Domain Library.**

The Hipster Stack is simultaneously:

1. the fixed supported technology substrate;
2. the runtime Application Definition schema;
3. the normalization and dependency-resolution system;
4. the artifact-ownership and generation-planning system;
5. the source transformation/materialization engine;
6. the CLI adapter over those shared semantics;
7. the shared configuration semantics consumed by Anthimeria;
8. the validation/handoff boundary for generated projects.

It is **not**:

- the Codependent Coding architecture itself;
- a collection of independent starter repositories;
- The Maximal Template;
- The Arrangement;
- the Anthimeria UI;
- the Loaded Vibes Codex plugin;
- a hosted control plane required by generated applications.

---

# 2. Product Boundary

```text
Codependent Coding™ WebApp Architecture
        ↓ governs
The Hipster Stack™ Technology Stack
        ├── schema
        ├── resolver
        ├── dependency closure
        ├── ownership catalog
        ├── generation plan
        ├── transforms
        ├── materializer
        └── CLI
              ↑
              │ one shared meaning
              │
Anthimeria ───┼── Virgule™
config file ──┘
        ↓
The Maximal Template™
        ↓ retain / remove / transform
The Arrangement™
```

The architecture defines the rules.

The Hipster Stack implements deterministic constitution and materialization.

The Maximal Template owns the application source implementation.

The Arrangement is the resulting application.

---

# 3. Fixed Technical Foundation

The generator does not ask the user to redesign architecture that the system already owns.

The fixed foundation includes the repository-supported form of:

- TypeScript;
- JavaScript / Node runtime as required by the stack;
- React;
- Next.js App Router;
- React Server Components by default;
- pnpm;
- Zod;
- Prisma ORM;
- PostgreSQL;
- Neon as the supported PostgreSQL provider in the current implementation;
- Clerk authentication;
- application-owned users, organizations, memberships, roles/capabilities, and authorization;
- PostgreSQL RLS for tenant containment where required by the application model;
- fetchers;
- actions;
- BusinessLogic™ Workflows;
- transaction helpers;
- Prisma selects;
- DTO mappers;
- provider integration adapters/helpers;
- webhook HTTP boundaries and reconciliation;
- shadcn-compatible / BoldKit-adapted UI primitives;
- Tailwind CSS semantic design tokens;
- Vercel-oriented deployment assumptions;
- architecture and validation contracts owned by the generated application where appropriate.

The stack doctrine is **constituted, not composable**: technologies and architectural responsibilities are normalized into a known system rather than offered as an unconstrained technology shopping cart.

---

# 4. Canonical Package Responsibilities

The live Hipster Stack repository currently exposes three principal packages:

```text
packages/
├── schema/
├── core/
└── cli/
```

Their canonical responsibilities are:

## 4.1 `packages/schema`

Owns deterministic runtime and TypeScript contracts for the Virgule/configuration domain.

Examples of schema concepts:

- Application Definition;
- Property mechanism;
- Property state/provenance;
- Provider;
- Capability;
- Resource;
- Role;
- Route Surface;
- Artifact;
- Artifact Set;
- Output policy;
- dependency/constraint shape.

`schema` defines valid shape.

It does not own filesystem materialization.

## 4.2 `packages/core`

Owns configuration meaning and generation mechanics.

Canonical responsibilities include:

- normalization;
- Ontology/preset seeding;
- dependency closure;
- capability/provider/resource resolution;
- property-state resolution;
- artifact ownership;
- inclusion/exclusion legality;
- generation-plan construction;
- source transforms;
- safe materialization;
- generated-project manifest/provenance;
- preflight/diagnostic helpers;
- reusable browser-safe resolution projections where appropriate.

`core` is the semantic engine shared by CLI and Anthimeria.

## 4.3 `packages/cli`

Owns terminal interaction only.

Canonical responsibilities include:

- command parsing;
- flags/options;
- interactive prompts;
- review/confirmation;
- progress presentation;
- human-readable explanations;
- safe destination acquisition;
- dispatch into `core`.

The CLI MUST NOT own a parallel dependency graph or independent defaulting rules.

---

# 5. One Rules Engine

The canonical invariant is:

```text
CLI ─────────────┐
Anthimeria ──────┼──> one Virgule schema
config file ─────┘        ↓
                       one resolver
                           ↓
                    dependency closure
                           ↓
                    generation plan
```

No adapter gets:

- hidden provider requirements;
- web-only defaults;
- CLI-only capability rules;
- independent artifact ownership;
- divergent conflict logic.

Equivalent input must resolve equivalently regardless of adapter.

---

# 6. Virgule Lifecycle

The configuration lifecycle is:

```text
draft
  ↓
normalized
  ↓
validated
  ↓
dependency-closed
```

Only a valid dependency-closed Virgule may be materialized.

The lifecycle states are semantic, not merely UI labels.

## Draft

May contain explicit user choices plus incomplete derived state.

## Normalized

Canonical defaults, Ontology foundation, identifiers, and supported representation have been applied.

## Validated

Structural and semantic constraints have been checked.

## Dependency-closed

Every required capability, BusinessLogic constitution, provider, artifact, route, resource, type/schema/helper dependency, and protected architectural requirement is resolved.

The dependency-closed Virgule is the materialization authority.

---

# 7. Property Provenance

Resolved properties may carry provenance states:

```text
DEFAULT
PRESET
USER
DERIVED
REQUIRED
LOCKED
```

Meaning:

| State | Meaning |
|---|---|
| `DEFAULT` | canonical base default |
| `PRESET` | supplied by selected Ontology/preset |
| `USER` | explicit supported user choice |
| `DERIVED` | calculated from other state |
| `REQUIRED` | enabled because dependency closure requires it |
| `LOCKED` | architecture-owned and not user-overridable |

The workbench/CLI may expose these states for explanation.

They MUST NOT misrepresent required/locked behavioral state as optional presentation choice.

---

# 8. User Configuration Boundary

The newest Anthimeria authority narrows ordinary user configuration primarily to presentation.

The user may configure supported presentation such as:

```text
page topology
Feature Slot geometry
compatible PureUI Block
Block variant
compatible UI Primitive constitution
Primitive variant
Semantic Design Tokens
content/copy
```

The user does not arbitrarily configure:

```text
BusinessLogic Block membership
Workflow constitution
Actions
Fetchers
Auth/Authz
Transactions
Selects
DTO Mappers
schemas/types/interfaces
provider mechanics
persistence invariants
authorization semantics
dependency closure
```

The resolver may still represent low-level capabilities and artifact policies internally.

Internal resolution machinery does **not** imply those mechanics are ordinary end-user behavioral toggles.

---

# 9. Generation Lifecycle

```text
Collect / load configuration
        ↓
Runtime validate
        ↓
Normalize + seed Ontology
        ↓
Apply supported explicit overrides
        ↓
Resolve dependencies + conflicts
        ↓
Resolve providers / resources / routes / artifacts
        ↓
Review dependency-closed Virgule
        ↓
Safe destination check
        ↓
Create generation plan
        ↓
Materialize Maximal Template into staging
        ↓
Remove excluded generator-owned artifacts
        ↓
Apply supported source transforms
        ↓
Write portable config + provenance
        ↓
Validate generated project as required
        ↓
Optional dependency install
        ↓
Optional Git initialization
        ↓
The Arrangement™
```

---

# 10. Generation Plan Contract

The generation plan is a deterministic derivative of the dependency-closed definition.

Conceptually it resolves:

```text
GenerationPlan
├── normalized definition
├── selected Ontology
├── required capabilities
├── required providers
├── required resources
├── roles / permissions
├── routes
├── modules
├── artifact sets
├── individual artifacts
├── environment requirements
├── setup instructions
├── required packages
├── files retained
├── files omitted
├── transforms
└── validation requirements
```

A generation plan is not user-facing application source.

It is generator-owned materialization intent.

---

# 11. Artifact Ownership

Every removable/transformed artifact must have enough metadata to determine:

- canonical owner;
- artifact set;
- dependencies;
- required-by relationships;
- whether removal is legal;
- whether transformation is required;
- why it is included/excluded;
- whether another retained capability shares it.

The generator MUST NOT delete a shared constituent merely because one Workflow or surface was excluded.

Generator support remains the truth test.

---

# 12. Safe Materialization

Canonical materialization behavior:

1. validate the canonical template exists and contains required metadata;
2. reject unsafe/conflicting destination conditions;
3. materialize into an isolated staging directory;
4. copy the canonical maximal source;
5. remove only dependency-closed excluded owned paths;
6. apply deterministic transforms;
7. write config/provenance/handoff artifacts;
8. validate required generated state;
9. promote the staging result into the destination;
10. clean staging on failure.

Partial generation MUST NOT be silently represented as a successful Arrangement.

---

# 13. CLI Contract

Canonical public vocabulary:

```text
hipster-stack create [directory]
hipster-stack add <supported-surface>
hipster-stack explain
hipster-stack doctor
hipsterstack.json
```

## `create`

Creates a new Arrangement from the normalized definition.

Supported concerns may include:

- target directory;
- package/product identity;
- config path;
- non-interactive mode;
- dry run;
- Git initialization;
- dependency installation.

## `add`

Adds only explicitly supported generator-owned optional surfaces.

It is not a general merge engine and not permission to import arbitrary Maximal Template code after generation.

## `explain`

Reads generated provenance/config and explains:

- starting Ontology/preset;
- resolved capabilities;
- providers;
- presentation;
- architecture;
- remaining setup.

## `doctor`

Diagnoses local/generated-project readiness.

It does not replace the application's full validation suite.

---

# 14. Portable Configuration

The portable configuration file is canonically represented as:

```text
hipsterstack.json
```

It is an adapter input and provenance/handoff representation of Virgule state.

It MUST NOT contain:

- secrets;
- provider credentials;
- hidden runtime authority;
- serialized TypeScript implementation.

It MAY contain enough normalized configuration/provenance to:

- reproduce supported generation;
- explain the generated state;
- support safe generator-owned additions;
- compare expected configuration with generated manifest.

---

# 15. Provider Handoff Boundary

The generator creates provider-ready code and configuration surfaces.

It does not automatically own:

- account creation;
- secret collection;
- production credential issuance;
- production infrastructure provisioning;
- destructive migrations;
- commercial policy;
- production deployment authorization.

Generated output may contain:

```text
.env.example
provider adapters
webhook routes
schema/migrations
setup instructions
doctor diagnostics
```

Production credentials and consequential external actions remain owner-controlled.

---

# 16. Determinism

For a supported generator revision:

```text
same dependency-closed Virgule
+
same Maximal Template revision
+
same generator semantics
=
equivalent Arrangement source constitution
```

Environment-specific install metadata or timestamps may differ where explicitly non-semantic.

Determinism concerns application constitution, not byte-for-byte identity of every incidental tool artifact unless separately specified.

---

# 17. Current Live Implementation Evidence

The live `DigitalHerencia/TheHipsterStack` repository already demonstrates important pieces of this model:

- `packages/schema` owns Zod Application Definition contracts;
- `packages/core` resolves definitions into a resolved application plus generation plan;
- `packages/core/src/generator/plan.ts` builds generation plans;
- `packages/core/src/generator/materialize.ts` stages, copies, prunes, transforms, and promotes output;
- `packages/cli` exposes `create`, `add`, `doctor`, and `explain`;
- generated projects retain `hipsterstack.json` and `.hipsterstack/manifest.json`;
- CLI and current web workbench use shared core semantics.

This is implementation evidence, not permission for older naming or configuration semantics to override the newest canonical product model.

---

# 18. Known Transition Reconciliation

The current live Hipster Stack still contains older/transitional concepts.

| Current implementation evidence | Canonical direction |
|---|---|
| web workbench called **The Constituter™** | **The Anthimeria™ Workbench** |
| four product presets such as `b2b-saas` | nine canonical Ontologies™ |
| generic capability include/exclude UI semantics | ordinary user customization is presentation-first; behavior normalized by Ontology |
| low-level output overrides exist in schema | generator-internal/advanced output policy must not imply arbitrary behavioral customization |
| some internals still use `LoadedVibesError` | Loaded Vibes™ is now the Codex plugin; Hipster Stack owns generator semantics |
| older docs call Loaded Vibes the WebApp Architecture | Codependent Coding™ WebApp Architecture is the governing architecture |

Migration must update these deliberately.

Do not global-replace names where they represent historical compatibility or serialized formats without a migration plan.

---

# 19. Canonical Invariants

1. Hipster Stack owns generation semantics.
2. Maximal Template owns application source implementation.
3. Virgule is the normalized definition authority for materialization.
4. Arrangement is the generated application.
5. Anthimeria and CLI share the same resolver.
6. The generator has one dependency graph.
7. The user cannot knowingly create a broken configuration.
8. Dependency closure is automatic.
9. Behavioral dependencies cannot be disabled through presentation configuration.
10. Generator-only metadata does not become application runtime architecture.
11. Ordinary generation uses one repository-owned maximal template.
12. Generation does not require a hosted control plane.
13. Provider credentials are not required merely to materialize source.
14. No secret is embedded in portable configuration.
15. Removals obey artifact ownership and shared dependencies.
16. Materialization failure is not successful generation.
17. Generated source remains normal source code.
18. Loaded Vibes is not the generator.

---

# 20. Canonical Sentence

> **The Hipster Stack™ Technology Stack is the concrete technology substrate and deterministic constitution system of the Codependent Coding™ WebApp Architecture. Its shared schema, resolver, dependency-closure engine, artifact-ownership model, generation planner, transforms, materializer, and CLI consume a validated dependency-closed Virgule™ and resolve it against The Maximal Template™ Domain Library to produce The Arrangement™ Generated Artifact. Anthimeria, the CLI, and portable configuration are adapters over the same semantics; they do not own parallel rules engines.**
