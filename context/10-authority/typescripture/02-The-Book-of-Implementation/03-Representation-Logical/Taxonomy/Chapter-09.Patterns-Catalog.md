---
title: Hipster Stack Canonical Patterns Catalog
type: map
scope: domain
project:
domain: hipsterstack
artifact: canonical-patterns
kind: map
namespace: hipsterstack.patterns.catalog.map
status: review
authority: working-note
parent: "[[hipsterstack.engineering-system.definition.source-document]]"
depends_on:
  - "[[hipsterstack.patterns.fetcher.reference]]"
  - "[[hipsterstack.patterns.server-action.reference]]"
  - "[[hipsterstack.patterns.application-workflow.reference]]"
  - "[[hipsterstack.patterns.transaction-helper.reference]]"
  - "[[hipsterstack.patterns.auth-authz-boundary.reference]]"
  - "[[hipsterstack.patterns.webhook-processor.reference]]"
  - "[[hipsterstack.patterns.route-feature-orchestration.reference]]"
  - "[[hipsterstack.patterns.layer-contract.reference]]"
  - "[[hipsterstack.patterns.system-lifecycle.reference]]"
  - "[[hipsterstack.patterns.governance-system.reference]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - patterns/canonical
  - maps/domain
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Hipster Stack Canonical Patterns Catalog

These patterns define the default engineering grammar for the opinionated SaaS architecture.

## Canonical request paths

### Protected read

```text
Route
  → Feature loader
    → Fetcher
      → Actor
      → Authorized scope
      → Query + select
      → DTO mapper
    → Page state
  → Feature composition
  → Components
```

### User mutation

```text
Form or client intent
  → Server Action
    → Validate input
    → Require actor
    → Application workflow
      → Authorize resource
      → Enforce lifecycle
      → Transaction / provider operation
      → Audit / outbox
    → Cache invalidation
    → ActionResult
```

### Provider webhook

```text
Provider request
  → Route Handler
    → Verify signature
    → Durable inbox
    → Processing lease
    → Reconciliation workflow
    → Transaction + outbox
    → Finalize
  → HTTP acknowledgement
```

## Pattern catalog

1. [[hipsterstack.patterns.fetcher.reference|Canonical Pattern 001: The Golden Fetcher]]
   - Protected server-side reads
   - Authorized scopes
   - Selects, DTO mappers, and pagination

2. [[hipsterstack.patterns.server-action.reference|Canonical Pattern 002: The Golden Server Action]]
   - Thin mutation adapters
   - Typed action results
   - Framework-owned invalidation

3. [[hipsterstack.patterns.application-workflow.reference|Canonical Pattern 003: The Golden Application Workflow]]
   - Use-case sequencing
   - Provider/database consistency
   - Recovery and idempotency

4. [[hipsterstack.patterns.transaction-helper.reference|Canonical Pattern 004: The Golden Transaction Helper]]
   - Atomic PostgreSQL mutation
   - Serializable retry
   - Optimistic concurrency

5. [[hipsterstack.patterns.auth-authz-boundary.reference|Canonical Pattern 005: The Golden Auth/Authz Boundary]]
   - Authentication
   - Tenant membership
   - Capability RBAC
   - Resource policy
   - Readiness and RLS

6. [[hipsterstack.patterns.webhook-processor.reference|Canonical Pattern 006: The Golden Webhook Processor]]
   - Signature verification
   - Durable inbox
   - Processing leases
   - Idempotent reconciliation
   - Outbox-driven secondary effects

7. [[hipsterstack.patterns.route-feature-orchestration.reference|Canonical Pattern 007: The Golden Route and Feature Orchestrator]]
   - Framework adaptation
   - Page-state loading
   - Route outcomes
   - Feature composition
   - Suspense and parallel reads

8. [[hipsterstack.patterns.layer-contract.reference|Canonical Pattern 008: The Golden Layer Contract]]
   - Inputs and outputs
   - Trust levels
   - Side-effect budgets
   - Error and serialization contracts
   - Import-boundary enforcement

9. [[hipsterstack.patterns.system-lifecycle.reference|Canonical Pattern 009: The Golden System Lifecycle Definition]]
   - States and legal transitions
   - Actors, guards, and invariants
   - Concurrency and idempotency
   - Recovery and observability
   - Lifecycle validation

10. [[hipsterstack.patterns.governance-system.reference|Canonical Pattern 010: The Golden Governance System]]
    - Context documentation
    - YAML contracts
    - Scoped specifications
    - Execution JSON
    - Mechanical governance validation

## Layer ownership

| Layer | Owns | Must not own |
|---|---|---|
| Route | URL, params, metadata, HTTP/redirect/not-found | Prisma, Stripe, domain rules |
| Feature | Page-state and presentation orchestration | Protected persistence |
| Fetcher | Authorized read use case and DTO | Writes and provider mutation |
| Server Action | Mutation transport and result adaptation | Entire workflow |
| Workflow | Use-case sequence | JSX and Next.js navigation |
| Domain | Policies, transitions, invariants | Framework and provider SDKs |
| Query/Command | Persistence mechanics | Session and UI behavior |
| Transaction | Atomic database invariants | Network calls |
| Integration | Provider mechanics | Product authorization |
| Webhook processor | Provider reconciliation | Browser session assumptions |
| Governance | Durable intent and execution constraints | Secrets and undocumented exceptions |

## Recommended implementation order

```text
Governance and layer contracts
  → lifecycle definitions
  → actor and authorization
  → query/select/mapper/fetcher
  → route and feature orchestration
  → command and transaction
  → workflow
  → Server Action
  → webhook inbox and outbox
  → caching
  → RLS
```

## Enforcement principle

```text
Architectural statement
  → machine-readable contract
  → import or AST rule
  → unit/integration test
  → CI gate
```

A convention becomes architecture when the repository can detect its violation.
