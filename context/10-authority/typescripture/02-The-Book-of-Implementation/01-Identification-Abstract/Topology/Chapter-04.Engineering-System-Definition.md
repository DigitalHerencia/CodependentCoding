---
title: Hipster Stack Engineering System Definition
type: source-document
scope: domain
project:
domain: hipsterstack
artifact: engineering-system-definition
kind: source-document
namespace: hipsterstack.engineering-system.definition.source-document
status: review
authority: working-note
parent: "[[tech-stack.map]]"
depends_on:
  - "[[hipsterstack.patterns.catalog.map]]"
  - "[[web-development.knowledge-modeling.ontology-taxonomy.reference]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - engineering-system
  - architecture/saas
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Hipster Stack Engineering System Definition

## Purpose

The Hipster Stack is the current working definition of one repeatable, opinionated way to build production-oriented multi-tenant SaaS applications.

It is not merely a dependency list. It describes the architecture, boundaries, vocabulary, implementation patterns, repository conventions, integration ownership, validation strategy, and agent-governance assumptions used repeatedly across projects.

The intended outcome is a system complete enough that recurring architectural decisions do not need to be rediscovered or re-explained for every application.

This document remains under review. It is the consolidated high-level source for the system, while the linked canonical-pattern notes provide detailed implementation references.

## Downstream Use

The engineering system supplies the reusable knowledge required by two separate projects:

- [[loadedvibes.project.source-document]] encodes the fixed baseline into an interactive SaaS project initializer and scaffolding generator.
- [[codependentcoding.project.source-document]] constrains agent-driven feature implementation inside the generated application.

The relationship is:

```text
Hipster Stack engineering system
  → Loaded Vibes generated baseline
  → Codependent Coding specifications and execution
  → product-specific MVP
```

## Core Architectural Rule

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions receive mutations. Schemas validate. Workflows coordinate use cases. Authorization decides. Transactions preserve database invariants. Integration adapters own provider mechanics. Webhooks reconcile external truth.

The system treats applications as domain systems with explicit trust boundaries, not as pages connected directly to a database.

## Preferred Technical Baseline

The current baseline includes:

- TypeScript with strict compiler settings
- Next.js App Router
- React and React Server Components by default
- PostgreSQL on Neon
- Prisma ORM
- Clerk for identity and session management
- Application-owned users, organizations, memberships, roles, and capabilities
- PostgreSQL row-level security where tenant containment requires defense in depth
- Stripe and Stripe Connect where billing or platform payments are required
- Zod for runtime boundary validation
- React Hook Form where complex browser forms require it
- Tailwind CSS
- shadcn-compatible primitives and composed presentation blocks
- Vitest for unit, integration, and contract testing
- Playwright for browser and workflow verification
- pnpm with a pinned package-manager version
- GitHub Actions for integration gates
- Vercel for deployment

Versions are intentionally not frozen in this conceptual document. Concrete templates and projects must pin and validate the versions they actually support.

## System Topology

```text
Browser
  → Next.js route or route handler
    → feature orchestrator
      ├─ fetcher
      │   → actor resolution
      │   → authorized scope
      │   → explicit Prisma select
      │   → database query
      │   → DTO mapper
      │   → serializable DTO
      ├─ Server Action
      │   → runtime schema
      │   → actor resolution
      │   → application workflow
      │       ├─ resource authorization
      │       ├─ domain policy
      │       ├─ transaction helper
      │       ├─ integration adapter
      │       ├─ audit or outbox
      │       └─ invalidation intent
      └─ presentational components
```

Presentation code does not reach into persistence or provider SDKs. Persistence code does not reach upward into React, navigation, or page composition.

## Layer Responsibilities

| Layer | Owns | Must not own |
|---|---|---|
| `app/` | URLs, params, metadata, layouts, Suspense, redirects, HTTP adaptation | Prisma queries, provider SDKs, business rules |
| `features/` | Page and use-case orchestration, display-state branching, composition | Hidden persistence, provider mechanics |
| `components/ui/` | Low-level design-system primitives | Product or domain behavior |
| `components/shared/` | Reusable product-agnostic presentation | Protected data access |
| `components/<domain>/` | Domain presentation using safe DTOs | Database access, authorization decisions |
| `lib/fetchers/` | Self-securing read use cases | Writes, redirects, provider mutation |
| `lib/actions/` | Thin Server Action transport adapters | Entire workflows, Prisma, provider SDKs |
| `lib/application/` or domain workflows | Named use-case sequence and cross-boundary coordination | JSX, raw form parsing, framework navigation |
| `lib/auth/` | Clerk session and local actor resolution | Product authorization |
| `lib/authz/` | Membership, capabilities, scopes, resource policies | Provider readiness and general workflow state |
| `lib/db/selects/` | Explicit persistence projections | UI shaping beyond persistence concerns |
| `lib/db/mappers/` | Persistence-to-DTO translation | Queries and mutations |
| `lib/db/queries/` | Internal read mechanics using trusted scope | Session resolution and UI behavior |
| `lib/db/commands/` | Non-transactional persistence write mechanics where appropriate | Provider orchestration |
| `lib/db/transactions/` | Atomic PostgreSQL invariants | Network calls, email, cache invalidation |
| `lib/integrations/` | Provider clients, request mechanics, response normalization | Product authorization and UI |
| `lib/webhooks/` | Verified, durable, idempotent provider reconciliation | Browser-session authorization |
| `schemas/` | Runtime validation contracts | Persistence and navigation |
| `types/` | Stable transport and shared compile-time contracts | Unrestricted generated database models |
| `prisma/` | Models, migrations, generated client, database policy artifacts | Application presentation |
| `context/` and `.agents/` | Human and machine-readable governance | Product runtime behavior |

Imports communicate architectural intent. A component importing Prisma is not merely untidy; it crosses a security and ownership boundary.

## Server Ownership

Business truth is server-owned.

The browser may collect input, display state, manage focused interaction, and optimistically improve responsiveness. It does not authoritatively decide:

- whether an actor is authenticated or authorized;
- whether a tenant or resource belongs to that actor;
- whether a workflow transition is legal;
- which price, fee, entitlement, or settlement rule applies;
- whether an external provider operation succeeded;
- whether a deadline or readiness condition is satisfied.

Client state and timers are advisory. Server timestamps, canonical database state, and verified provider state are authoritative.

## Route and Feature Orchestration

Routes remain thin. They may resolve parameters, establish layouts and loading boundaries, select feature entrypoints, and translate between HTTP and application results.

Features sit between routes and components. They may call established fetchers, map DTOs into display models, select state- or role-aware presentation, bind actions, and compose UI.

Features must not become an alternate persistence layer.

The preferred hierarchy is:

```text
route
  → feature
    → fetcher or action
    → display mapper
    → domain component
      → shared component
        → UI primitive
```

A dedicated feature-and-route orchestration reference remains a known gap before this system can be promoted beyond review status.

## Authentication and Application Identity

Clerk owns:

- sign-up and sign-in;
- sessions and authentication tokens;
- identity verification;
- user-facing authentication flows.

The application database owns:

- local user identity and account status;
- organizations and memberships;
- product roles and capabilities;
- tenant access and resource relationships;
- workflow readiness and provider relationships;
- audit and operational records.

Clerk metadata is not the canonical location for product roles, tenant authorization, payment state, or workflow state.

Verified Clerk webhooks synchronize identity changes into local application records. Authenticated page reads do not opportunistically create local users.

The reference system uses an application-owned tenant abstraction, commonly named `Organization`, rather than making Clerk Organizations the product domain model.

## Authorization and Tenant Containment

Authorization is layered:

```text
authentication
  → local actor
  → active tenant membership
  → role-derived capability
  → resource policy
  → workflow invariant
  → provider or operational readiness
```

These questions must remain distinct.

Roles are bundles of stable business capabilities. Business code asks whether an actor has a capability instead of scattering role-string comparisons.

Protected reads derive the maximum legal database scope and include that scope directly in the query. Protected writes evaluate the actual resource and current state inside the workflow.

PostgreSQL RLS may supplement application authorization as a final tenant-containment boundary. RLS must use trusted transaction-local context under pooled connections, production-equivalent database roles, and tests that prove the application role cannot bypass policies.

RLS does not replace application authorization, capability checks, resource policies, or useful application errors.

## Read Pipeline

The canonical protected read is:

```text
untrusted input
  → runtime validation
  → trusted actor
  → authorized query scope
  → tenant- and ownership-scoped query
  → explicit select
  → DTO mapper
  → serializable DTO
```

Exported fetchers are self-securing. Routes and features should not be required to remember a separate authentication preamble before calling a read function.

Database rows, generated Prisma models, provider objects, and `Date` instances do not leak into client-facing presentation contracts.

See [[hipsterstack.patterns.fetcher.reference]].

## Mutation Pipeline

The canonical mutation is:

```text
form or request intent
  → thin Server Action or route adapter
  → runtime schema
  → trusted actor
  → named application workflow
  → resource authorization
  → domain and workflow invariants
  → transaction and provider coordination
  → audit or outbox
  → cache invalidation at the framework boundary
  → typed result
```

Server Actions receive and adapt mutations. They do not become database, billing, authorization, email, and domain subsystems in one file.

See [[hipsterstack.patterns.server-action.reference]] and [[hipsterstack.patterns.application-workflow.reference]].

## Transactions and Concurrency

Transaction helpers own the database changes that must commit or roll back together.

They accept a transaction client, contain no provider or network calls, preserve atomic invariants, and may create audit or outbox records that must commit with primary state.

Concurrency-sensitive operations use explicit database constraints, conditional mutations, optimistic versions, serializable isolation where justified, and bounded retries only for known retry-safe failures.

See [[hipsterstack.patterns.transaction-helper.reference]].

## Provider Integrations

Provider SDKs remain behind domain-oriented adapters.

Adapters own:

- SDK initialization and version configuration;
- provider request syntax;
- connected-account scope;
- provider idempotency keys;
- signature verification helpers;
- response normalization and status translation.

The rest of the application invokes domain-oriented operations rather than constructing raw provider requests in routes, actions, or components.

PostgreSQL and external providers do not share a distributed ACID transaction. Cross-system workflows therefore require local operation records, stable idempotency keys, recoverable intermediate states, auditability, and later webhook reconciliation.

## Webhook Reconciliation

Webhooks are at-least-once, potentially duplicated, concurrent, and out of order.

The canonical processor:

```text
verifies raw-body signature
  → records a durable inbox event
  → atomically claims a processing lease
  → retrieves provider truth when required
  → reconciles local state transactionally
  → records audit and outbox effects
  → finalizes using the current lock token
  → acknowledges the provider
```

Heavy or noncritical effects such as email run through an outbox rather than controlling payment or identity truth.

See [[hipsterstack.patterns.webhook-processor.reference]].

## Data Modeling

The model distinguishes:

- domain records representing product truth;
- provider mirror records representing external identifiers and states;
- operational records supporting audit, retries, recovery, idempotency, and outbox delivery.

Conventions include:

- separate internal and public identifiers where needed;
- integer minor units and explicit currency for money;
- constrained status enums and dedicated lifecycle timestamps;
- unique provider and webhook identifiers;
- explicit tenant keys and supporting indexes;
- restrictive deletion behavior for financial and audit relationships;
- no provider payload treated as the application domain model;
- no derived presentation state persisted unless it is independently meaningful domain state.

## Schemas, Selects, DTOs, and Types

Zod validates untrusted runtime values at trust boundaries.

Prisma selects define exact persistence projections and minimize both exposure and query cost.

DTO mappers translate persistence representations into stable, serializable application contracts.

Generated Prisma types remain inside the data layer. Shared public types represent domain concepts, transport DTOs, action results, normalized provider results, security context, or presentation models.

## Presentation System

The presentation hierarchy is:

```text
semantic tokens
  → UI primitives
  → shared blocks
  → domain components
  → feature composition
  → routes
```

Global CSS owns semantic tokens, base typography, accessibility defaults, focus and selection behavior, document surfaces, and truly global motion utilities. It is not a dumping ground for page-specific styles.

The concrete brand may change between generated applications. The hierarchy, semantic-token strategy, accessibility requirements, and separation between pure UI and orchestration remain stable.

## Configuration and Environment

Root configuration is architectural infrastructure.

The baseline expects:

- strict TypeScript settings;
- path aliases aligned with architectural layers;
- Next.js security and image configuration;
- a centralized Zod-backed environment module separating server and public variables;
- a credential-free `.env.example` describing every integration surface;
- a pinned package manager and reproducible frozen-lockfile installs;
- one canonical package-script vocabulary for formatting, types, linting, database work, tests, builds, and contract validation;
- pooled Neon connections for runtime traffic and an intentionally separate migration path where required.

## Validation and Enforcement

Validation is layered, with one primary owner for each class of rule:

| Mechanism | Primary responsibility |
|---|---|
| Prettier | deterministic formatting |
| TypeScript | type and interface correctness |
| ESLint | static imports, boundaries, forbidden APIs, and file-local architecture rules |
| Contract validator | repository-wide architecture, product, and validation invariants |
| Unit tests | pure rules, mappings, policies, and focused module behavior |
| PostgreSQL integration tests | transactions, constraints, RLS, and concurrency |
| Playwright | critical browser workflows and presentation behavior |
| Production build | framework integration and deployable compilation |
| CI | repeatable integration gate |
| PR review | semantic correctness, security, maintainability, and architectural judgment |

The normal sequence uses the narrowest relevant checks during implementation and broader gates before integration or release.

Mechanical validators should fail with actionable explanations. They should not silently delete or rewrite unexpected code unless an explicitly safe formatter or codemod owns that transformation.

Pre-commit frameworks are optional and should not introduce disproportionate friction for a solo operator. The authoritative gate is the repository validation and PR workflow.

## Delivery and Review

The preferred delivery flow is:

```text
scoped change
  → focused local validation
  → pull request
  → CI and contract gates
  → automated and human-readable review
  → merge
  → Vercel deployment when authorized
  → post-deployment smoke verification
```

Code review should cover architectural boundaries, trust boundaries, tenant scope, provider idempotency, error handling, test evidence, and unnecessary complexity—not merely style.

External review tools may assist, but repository contracts and project intent remain authoritative.

## Agent Governance

Human-readable governance lives under `context/` and includes durable project documentation plus implementation specifications.

Machine-readable governance lives under `.agents/`:

```text
.agents/contracts/
  product.yaml
  architecture.yaml
  validation.yaml

.agents/execution/
  decisions.json
  progress.json
  handoff.json
```

Markdown communicates human intent and explanation. YAML encodes deterministic contracts. JSON records execution state.

Agents must read governance before changing behavior, make the smallest correct change, preserve fixed boundaries, avoid inventing product or architecture, run the narrowest permitted validation, record durable decisions, and stop when an instruction conflicts with security, tenant isolation, payments, or lifecycle invariants.

## Sources of Truth

The system currently assigns authority as follows:

- Clerk owns authentication and external identity state.
- PostgreSQL owns application users, organizations, memberships, product state, and authorization relationships.
- Stripe owns provider settlement and payment-object truth.
- Verified webhooks and deliberate retrieval reconcile provider truth into local mirrors.
- Application workflows interpret external and local facts into product transitions.
- Server time owns deadlines and lifecycle timing.
- The Hipster Stack knowledge system owns reusable engineering conventions.
- Project-specific documentation and contracts own the product-specific application intent.

## Current Review Gaps

The existing pattern set is substantial but incomplete. Before promotion to active source-of-truth status, the system still needs dedicated definitions for:

1. feature and route orchestration;
2. layer contracts, including inputs, outputs, allowed dependencies, and forbidden dependencies;
3. the end-to-end system lifecycle and canonical data flows.

The complete system also requires a deliberate review for security, performance, unnecessary abstraction, internal contradictions, and implementation currency.

## Governing Principle

> Keep identity, authorization, domain state, persistence, providers, orchestration, and presentation separate, then connect them through small, typed, validated, mechanically enforced interfaces.
