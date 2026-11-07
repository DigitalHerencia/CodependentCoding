# Architecture

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

How the app is built: boundaries, layers, data, flows and decisions. Follows a lightweight arc42 / C4 structure.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Context and scope

_The system and everything it talks to (C4 level 1)._

- **Users:** TODO:
- **External systems:** TODO:

**Feeds:** `ENG-M1-P1.2-SCAFF-T01`

## Constraints

_Fixed technical and organizational constraints._

- Server-first Next.js App Router; data access only on the server
- Tenancy and authorization enforced in the server layer and the database
- TODO:

**Feeds:** `ENG-M1-P1.2-SCAFF-T01`, `ENG-M3-P3.2-REVIEW-T05`

## Building blocks

_The layers and directories, and what each may import. Classify every new file before creating it._

| Layer        | Directory     | Responsibility                                   |
| ------------ | ------------- | ------------------------------------------------ |
| Routes       | `app/`        | Routing and composition only                     |
| Features     | `features/`   | Feature UI and view logic                        |
| Components   | `components/` | Shared UI primitives                             |
| Server logic | `lib/`        | Actions, fetchers, auth, authz, db, integrations |
| Schemas      | `schemas/`    | Input and output validation                      |
| Content      | `content/`    | Copy and static content                          |

**Feeds:** `ENG-M1-P1.2-SCAFF-T01`, `ENG-M2-P2.1-FEATURES-T01`

## Module composition

_The modules kept by the generator and how they depend on each other._

| Module | Depends on | Routes | Notes |
| ------ | ---------- | ------ | ----- |
| TODO:  |            |        |       |

**Feeds:** `ENG-M1-P1.1-INIT-T01`, `ENG-M1-P1.2-SCAFF-T01`

## Data model

_Entities, relationships, constraints, migrations and seed data. Source of truth is `prisma/schema/`._

| Model | Relations | Tenant column | Constraints / RLS |
| ----- | --------- | ------------- | ----------------- |
| TODO: |           |               |                   |

**Feeds:** `ENG-M1-P1.2-SCAFF-T03`, `ENG-M1-P1.3-DATA-T01`, `ENG-M1-P1.3-DATA-T02`, `ENG-M1-P1.3-DATA-T03`, `ENG-M1-P1.3-DATA-T04`, `ENG-M1-P1.3-DATA-T05`, `ENG-M2-P2.2-VALIDATE-T03`, `ENG-M3-P3.1-PERF-T02`

## Runtime flows

_How reads and writes move through the layers for the key journeys._

1. **Read:** route → fetcher (`lib/fetchers`) → authz → database
2. **Write:** form → server action (`lib/actions`) → schema validation → authz → database → revalidate
3. **TODO::**

**Feeds:** `ENG-M1-P1.3-ALPHA-T01`, `ENG-M2-P2.1-FEATURES-T02`, `ENG-M2-P2.2-VALIDATE-T03`

## Integration boundaries

_Inbound webhooks and outbound calls: verification, idempotency and ownership of state._

| Integration | Direction | Verification | Idempotency key | State owner  |
| ----------- | --------- | ------------ | --------------- | ------------ |
| Clerk       | inbound   | signature    | event ID        | app database |
| TODO:       |           |              |                 |              |

**Feeds:** `ENG-M1-P1.3-AUTH-T03`, `ENG-M2-P2.1-MVP-T02`

## Deployment view

_Where the app runs and how environments map to infrastructure._

- **Hosting:** Vercel
- **Database:** Neon, branch per environment
- **Domains:** TODO:

**Feeds:** `ENG-M1-P1.2-SCAFF-T02`, `ENG-M1-P1.3-ALPHA-T02`, `ENG-M2-P2.3-CICD-T02`, `ENG-M3-P3.3-DEPLOY-T02`, `ENG-M3-P3.3-DEPLOY-T04`

## Cross-cutting concerns

_Caching, feature flags, errors and results, i18n._

- **Caching:** TODO:
- **Feature flags:** TODO:
- **Errors:** typed results from actions; error boundaries per route
- **i18n:** TODO:

**Feeds:** `ENG-M2-P2.1-FEATURES-T03`, `ENG-M3-P3.1-PERF-T04`, `ENG-M3-P3.2-HARD-T04`

## Architecture decisions

_Significant decisions as short ADRs. Each also goes into `.agents/execution/decisions.json`._

| ID      | Decision | Reason | Date |
| ------- | -------- | ------ | ---- |
| ADR-001 | TODO:    |        |      |

**Feeds:** `ENG-M3-P3.2-REVIEW-T01`, `ENG-M3-P3.2-REVIEW-T04`, `ENG-M3-P3.2-REVIEW-T05`, `ENG-M3-P3.3-DOCS-T04`
