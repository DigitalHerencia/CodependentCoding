# Product Requirements Document

# 1. Product Definition

The Codependent Coding™ WebApp Architecture is the unified public, documentation, configuration, demonstration, generation, and distribution surface for the Codependent Coding architecture. It turns the architecture from a collection of doctrine, domain libraries, normalized definitions, blocks, workflows, generators, and agent tooling into one navigable executable product.

| **Product Surface**                  | **Responsibility**                                                              |
|--------------------------------------|---------------------------------------------------------------------------------|
| TypeScripture™ Canonical Doctrine    | Governing architectural knowledge and implementation doctrine.                  |
| The Hipster Stack™ Technology Stack  | Technology constitution, configuration model, resolver, generator, and CLI.     |
| The Maximal Template™ Domain Library | Runnable superset implementation containing supported application capabilities. |
| Ontology™ Normalized Defaults        | Normalized application starting definitions.                                    |
| Simples™ Normalized Blocks           | PureUI Blocks and BusinessLogic Blocks.                                         |
| The Anthimeria™ Workbench            | Stateless visual application configuration interface.                           |
| Virgule™ Application Definition      | Portable normalized application definition.                                     |
| The Arrangement™                     | Generated standalone application artifact.                                      |
| Loaded Vibes™ Codex Plugin           | Architecture-aware agent governance, validation, and delivery tooling.          |
| Visual Vibes™                        | Shared visual language and design system.                                       |

# 2. Product Goal

The site MUST make the architecture understandable, inspectable, configurable, demonstrable, and usable from a single interface.

```text
UNDERSTAND
TypeScripture / Docs
↓
DISCOVER
Ontologies + Simples
↓
CONFIGURE
Anthimeria
↓
DEFINE
Virgule
↓
GENERATE
Hipster Stack
↓
ARRANGE
Arrangement
↓
DEVELOP
Loaded Vibes
```

# 3. Governing Product Principle

The website is not merely marketing collateral. It is the public identity, canonical documentation interface, domain catalog, implementation demonstration, configuration surface, generator bridge, and agent-tooling distribution surface for the architecture.

# 4. Primary Users

| **User**              | **Primary Need**                                                                                             |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| Evaluator             | Understand what the architecture is, why it exists, what it uses, and what it generates.                     |
| Builder               | Choose a normalized starting point, customize it, obtain a portable definition, and generate an application. |
| Architecture Consumer | Read canonical definitions, patterns, contracts, security rules, provenance, and examples.                   |
| Template Consumer     | Inspect Maximal Template capabilities, Simples, workflows, variants, and generator support.                  |
| Loaded Vibes User     | Install and understand the Codex plugin, its agents, skills, prompts, validation, and project assets.        |

# 5. Primary Product Surfaces

## 5.1 Landing Page

- Establish The Codependent Coding™ WebApp Architecture and Digital Herencia identity.
- Introduce The Hipster Stack™ and the product family.
- Provide direct navigation into Ontologies, Simples, Anthimeria, Maximal, documentation, and related surfaces.
- Use supplied brand assets and the approved landing composition.
- Mandatory hero: WHEN EPISTEMOLOGIES FAIL, THE STACK STILL GOVERNS.
- Supporting identity: The Hipster Stack™ Technology Stack. Constituted not Composable.
- Supporting copy: Finally, a technology stack with provenance that won't rust. Nothing to borrow. We've already checked.

## 5.2 Ontologies

The Ontologies surface exposes normalized application starting definitions. Each Ontology defines a supported capability graph rather than a decorative category label.

- Browse all normalized Ontologies.
- Select an Ontology and inspect its description, routes, features, workflows, integrations, dependencies, presentation candidates, and shared foundation requirements.
- Inspect implementation or definition material.
- Obtain a portable definition where supported.
- Enter Anthimeria with the selected Ontology as the behavioral starting point.

## 5.3 Simples

```text
SIMPLES™
= PureUI Blocks™
+ BusinessLogic Blocks™
```
PureUI Blocks are reusable presentation constitutions built from UI primitives, variants, and semantic design tokens. BusinessLogic Blocks are normalized domain workflows constituted from server operations, helpers, schemas, types, integrations, and data transport. Features are the orchestration boundary where presentation and behavior meet.

- Provide separate catalogs for PureUI Blocks and BusinessLogic Blocks.
- Expose name, family, description, Ontology membership, implementation status, source or preview, and related documentation.
- Render real PureUI implementations where feasible.
- Represent workflows as orchestration units, not as arbitrary collections of user-toggleable server files.

## 5.4 Anthimeria Workbench

Anthimeria is the stateless visual configuration environment. The selected Ontology determines the behavioral capability graph; the user configures presentation within compatible constraints.

| **User-configurable**                                                                                                                                                                  | **Not arbitrarily user-configurable**                                                                                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Page topology; feature slots; compatible PureUI Blocks; block variations; primitive variants; semantic design tokens; typography; colors; radius; borders; spacing; configurable copy. | Authorization semantics; transaction boundaries; invariant-preserving workflow structure; arbitrary server-operation removal; unsupported dependency combinations. |

- Start from a preset or Ontology.
- Edit product identity and supported presentation choices.
- Show affected definition state as configuration changes.
- Produce a portable application definition.
- Support copy/download/share or CLI handoff where implemented.
- Do not pretend the browser builds or uploads the generated project if generation occurs locally.

## 5.5 Maximal Template

- Explain the Maximal Template as the runnable superset domain library.
- Expose supported capabilities and reference implementations.
- Show how normalized Ontologies select bounded subsets of the superset.
- Provide source-oriented demonstrations without implying every file is independently composable.

## 5.6 TypeScripture / Documentation

- Render canonical doctrine as navigable documentation.
- Support deep links and nested documentation routes.
- Expose architecture, terminology, patterns, security, lifecycle, governance, validation, and implementation material.
- Prefer repository-owned Markdown/content as the documentation source.

## 5.7 Loaded Vibes

- Explain the plugin's purpose and relationship to generated Arrangements.
- Document installation, agents, skills, prompts, references, validators, and project assets.
- Treat the plugin as an already-built product surface, not something the website silently reinvents.

# 6. Global Functional Requirements

- Persistent site header and footer across public product surfaces.
- Active navigation state and direct URLs for major product areas.
- Responsive layouts across desktop, tablet, and mobile.
- Accessible keyboard navigation, visible focus, semantic headings, and meaningful controls.
- Copy/download actions must provide explicit success/failure feedback.
- Code and definitions must remain readable and scrollable without destroying page layout.
- Unknown slugs and missing definitions must resolve to explicit not-found/error states.
- Interactive demonstrations must distinguish real behavior from static examples.

# 7. Non-Goals

- The website does not become an arbitrary low-code platform.
- Anthimeria does not permit users to invalidate domain invariants through presentation controls.
- The site does not require authentication merely to read public architecture documentation.
- The public site does not become the authority for secrets, production credentials, or provider administration.
- Marketing copy must not claim generation, validation, or deployment capabilities that the implementation does not actually perform.

# 8. Product Acceptance Criteria

- All primary product families are represented and navigable.
- Landing, Ontologies, Simples, Anthimeria, Maximal, documentation, and demonstration surfaces share one coherent identity.
- The site explains the Ontology → configuration → Virgule → generation → Arrangement lifecycle accurately.
- Mockup-defined visual hierarchy is recognizable in implemented pages.
- Public documentation is readable without authentication.
- Interactive controls produce deterministic, inspectable state.
- No obsolete name blocks implementation when a newer authoritative name is known; naming migration is handled as ordinary maintenance.
