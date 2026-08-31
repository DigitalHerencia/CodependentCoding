# System Architecture Specification

# 1. Architectural Definition

The Codependent Coding WebApp Architecture is a single product surface over a family of mutually related architectural artifacts. The website must preserve the distinction between knowledge, domain definition, presentation constitution, business orchestration, application definition, generation, generated artifact, and agent governance.

# 2. System Context

```text
Digital Herencia
│
└── Codependent Coding™ WebApp Architecture
├── TypeScripture™
├── Hipster Stack™
├── Maximal Template™
├── Ontologies™
├── Simples™
│ ├── PureUI Blocks™
│ └── BusinessLogic Blocks™
├── Anthimeria™
├── Virgule™
├── Arrangement™
├── Loaded Vibes™
└── Visual Vibes™
```

# 3. Runtime Architecture

```text
Browser
│
▼
Next.js App Router
│
├── Public routes / docs / catalogs
│ └── Server Components
│
├── Interactive workbench/demo surfaces
│ └── bounded Client Components
│
└── Server boundaries
├── definition loading
├── validation / normalization
├── protected workflows (when present)
└── download / route handlers

Repository-owned authorities
├── content/
├── Ontology / Simples metadata
├── Maximal Template implementation
├── configuration schemas
└── public brand assets
```

# 4. Presentation Architecture

```text
app/ route
↓
feature
├── PureUI Block
│ └── UI primitives + variants + semantic tokens
│
└── BusinessLogic Workflow
└── server operations + helpers + contracts + integrations
```

A feature is the user-facing orchestration boundary. PureUI Blocks do not acquire business authority merely because a feature renders them. Workflows do not become presentation components merely because their state is displayed.

# 5. Workflow Constitution

A workflow is an orchestration unit constituted from lower-level server operations and helpers. It is not merely a folder containing unrelated functions.

```text
Fetcher/read ─┐
Action/write ───┤
Authorization ──┤
Schema/types ───┤
Integration ────┤──► BUSINESSLOGIC WORKFLOW
Transaction ────┤
Helpers ────────┘
```

The workflow is the folded business-logic form of those constituents. Unfolding the workflow exposes its constituents; it does not imply the business meaning ceased to exist.

# 6. PureUI Constitution

```text
UI Primitive
+ variant
+ semantic token
+ bounded composition
↓
PureUI Block
```

PureUI Blocks are reusable presentation constitutions. They may expose compatible variants to Anthimeria, but they do not own authorization, persistence, provider credentials, or domain invariants.

# 7. Ontology Architecture

An Ontology is a normalized application starting definition. It selects a coherent supported capability graph from the Maximal Template and establishes the behavioral frame that Anthimeria is allowed to present/configure.

```text
Maximal Template superset
↓ normalize/select
Ontology
├── routes
├── features
├── workflows
├── integrations
├── dependencies
├── presentation candidates
└── foundation requirements
```

# 8. Anthimeria and Virgule

```text
Ontology
↓
Anthimeria presentation constitution
↓
validated + normalized configuration
↓
Virgule™ Application Definition
↓
Hipster Stack generator / CLI
```

Anthimeria is not the generator. Its durable output is the portable definition. The generator consumes that definition through the same normalization and validation contract used by other supported entry points.

# 9. Generation Architecture

```text
Virgule
↓
Validate
↓
Normalize
↓
Resolve dependency closure
↓
Materialization plan
↓
Maximal Template source selection/transforms
↓
Arrangement™
↓
Install / validate / handoff
```

- Generation must be deterministic for the same supported inputs and repository version.
- Unsupported state fails explicitly.
- Generated output is an ordinary standalone application, not a runtime dependency on the configurator.
- The generated Arrangement owns its resulting source after materialization, subject to whatever provenance metadata the generator intentionally preserves.

# 10. Documentation Architecture

```text
content/
├── docs/
├── patterns/
├── provenance/
├── governance/
└── typescripture/
↓
repository loader / metadata
↓
/typescripture/[[...slug]]
↓
documentation UI
```

- Canonical content remains repository-owned.
- The website is a renderer/navigator, not a second conflicting knowledge authority.
- Provenance and traceability material may link architecture claims to implementation evidence.

# 11. Loaded Vibes Boundary

Loaded Vibes is agent/development tooling adjacent to generated applications and the architecture repository. Its canonical plugin package must have one source authority. Repository-scoped .agents material may configure agents, but a duplicate full plugin tree must not silently become a second authoritative implementation.

```text
Architecture / Arrangement
↓
Loaded Vibes
├── agents
├── skills
├── prompts
├── references
├── validators
└── project assets
```

# 12. Dependency Direction

```text
UI primitives
↑
PureUI Blocks
↑
Features
↔
Workflows
↓
Server operations / integrations / persistence

Canonical definitions
↓
Resolvers / loaders
↓
Features / workbench / generator

Public assets
↓
Presentation only
```

- Lower-level presentation primitives do not import product features.
- Server-only modules do not import Client Components.
- Canonical domain definitions do not depend on page rendering.
- The generator may depend on schemas/core domain resolution, but the schema/domain authority must not depend on the CLI shell.
- Documentation rendering must not become a hidden runtime dependency of generation.

# 13. Error Architecture

| **Failure**                    | **Required Behavior**                                                       |
| ------------------------------ | --------------------------------------------------------------------------- |
| Unknown route/slug             | Not-found response with navigation back to a valid catalog.                 |
| Invalid application definition | Schema/contract error with actionable field-level information where safe.   |
| Unsupported combination        | Explicit unsupported-state error; no silent fallback.                       |
| Copy/download failure          | Visible local error and retry path.                                         |
| Server failure                 | Bounded error UI; sensitive internals logged server-side only.              |
| Offline state                  | Relevant interactive surfaces expose an understandable offline/retry state. |

# 14. Architectural Invariants

1.  There is one canonical authority for each domain definition.
2.  Simples has exactly two top-level families: PureUI Blocks and BusinessLogic Blocks.
3.  Features orchestrate presentation and behavior.
4.  Workflows constitute business logic from server operations and helpers.
5.  Anthimeria configures bounded presentation over an Ontology-defined behavioral graph.
6.  Virgule is the portable application-definition boundary.
7.  The Hipster Stack generator materializes an Arrangement from validated supported state.
8.  Generated applications do not require the website to run.
9.  Public documentation does not require authentication.
10. Authorization is server-enforced whenever protected state exists.
11. Brand assets come from the repository's public asset authority.
12. Transitional old names are migration concerns, not reasons to invent parallel concepts.

# 15. Current Repository Mapping

| **Current Path**   | **Architectural Role**                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| app/               | Next.js route shells and route handlers.                                                            |
| components/ui/     | UI primitives.                                                                                      |
| components/blocks/ | PureUI Block implementations.                                                                       |
| features/          | Feature orchestration.                                                                              |
| lib/               | Shared loaders, domain/configuration utilities, and bounded supporting code.                        |
| content/           | Rendered canonical documentation, patterns, governance, and provenance.                             |
| context/           | Specifications, mockups, and implementation context.                                                |
| public/            | Brand identity and static visual assets.                                                            |
| .agents/           | Repository agent state/configuration; not automatically canonical plugin source.                    |
| packages/          | Existing package boundaries retained only where they represent real separately consumable concerns. |

# 16. Migration Rule

The repository is mid-normalization. Existing names and paths may temporarily lag canonical terminology. Implementation should rename or redirect ordinary references as part of scoped work rather than treating a stale name as a new architecture. Where two artifacts conflict, the newer explicit authoritative specification governs unless repository-local implementation evidence proves a required compatibility constraint.

# Public website reconstruction boundary (2026-08-31)

The root application is a public, unprotected, repository-content and presentation product. It performs no application database reads or writes and requires no Clerk, tenant state, provider mutation, or application RBAC. Its presentation flow is `UI Primitive → PureUI Block → optional Page Template → Page`; presentation-only Feature wrappers are not required. This exception does not alter the Maximal Template application architecture under `template/`.

`SiteShell` owns the universal header, footer, near-black canvas, responsive outer gutters, shared content maximum width, and `Digital Herencia Desert BG.jpg` horizon. TypeScripture, Maximal Template, and Anthimeria add only their own inner documentation, source-browser, and workbench topologies.

Surface topology mapping is: BlogTemplate information topology for Ontology discovery, ProductTemplate information topology for PureUI details, DocsTemplate information topology for TypeScripture, and DashboardTemplate information topology for Anthimeria. These mappings reuse structure, not BoldKit visual identity.
