---
title: Hipster Stack Golden Governance System Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: governance-system
kind: reference
namespace: hipsterstack.patterns.governance-system.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/governance
  - patterns/canonical
  - status/review
created: 2026-08-05
updated: 2026-08-05
---

# Canonical Pattern 010: The Golden Governance System

Governance is the repository-level system that preserves product intent, architectural boundaries, execution state, and decision history across humans, agents, branches, and time.

It is not a pile of Markdown that everyone politely ignores.

It is not a YAML costume placed over an undocumented codebase.

The canonical governance system divides information by authority and purpose:

```text
human-readable canonical context
            +
machine-readable deterministic contracts
            +
scoped specifications
            +
mutable execution state
            +
mechanical validation
```

## Core rule

> **Durable truth, implementation intent, and current execution state must live in different artifacts.**

When those concerns are mixed, agents treat temporary notes as architecture and permanent constraints as disposable suggestions.

---

# Canonical repository structure

```text
/
├── AGENTS.md
├── README.md
│
├── context/
│   ├── 00-system/
│   │   ├── architecture.md
│   │   ├── engineering-conventions.md
│   │   ├── terminology.md
│   │   └── operating-model.md
│   │
│   ├── 10-product/
│   │   ├── product-definition.md
│   │   ├── domain-model.md
│   │   ├── user-roles.md
│   │   └── user-flows.md
│   │
│   ├── 20-engineering/
│   │   ├── data-access.md
│   │   ├── auth-authz.md
│   │   ├── integrations.md
│   │   ├── testing.md
│   │   ├── observability.md
│   │   └── security.md
│   │
│   ├── 30-design/
│   │   ├── design-system.md
│   │   ├── interaction-patterns.md
│   │   └── content-style.md
│   │
│   └── specs/
│       ├── active/
│       ├── completed/
│       └── archived/
│
├── .agents/
│   ├── contracts/
│   │   ├── product.yaml
│   │   ├── architecture-boundaries.yaml
│   │   ├── domain-model.yaml
│   │   ├── routes.yaml
│   │   ├── integrations.yaml
│   │   ├── lifecycles.yaml
│   │   └── quality-gates.yaml
│   │
│   ├── execution/
│   │   ├── backlog.json
│   │   ├── decisions.json
│   │   ├── progress.json
│   │   └── handoff.json
│   │
│   └── schemas/
│       ├── contract.schema.json
│       ├── backlog.schema.json
│       ├── decisions.schema.json
│       ├── progress.schema.json
│       └── handoff.schema.json
│
├── scripts/
│   ├── validate-governance.ts
│   ├── validate-architecture.ts
│   └── generate-context-index.ts
│
└── .github/
    └── workflows/
        └── ci.yml
```

The exact folder names may evolve.

The separation of authority should not.

---

# Governance artifact taxonomy

## `AGENTS.md`

`AGENTS.md` is the repository entrypoint for agents.

It should answer:

- What is this repository?
- Which documents are authoritative?
- What is the source-of-truth precedence?
- Which commands are safe to run?
- Which commands require explicit approval?
- Which boundaries are non-negotiable?
- Where is current execution state?
- What must an agent update before handoff?
- When must an agent stop rather than guess?

It should remain concise enough to be read at the beginning of every task.

It points to deeper context.

It does not duplicate every architecture document.

## `/context/**/*.md`

Context Markdown explains durable truth to humans and agents.

It owns:

- why the product exists,
- how the system is organized,
- terminology,
- architectural rationale,
- product constraints,
- engineering conventions,
- integration semantics,
- design intent,
- accepted tradeoffs,
- examples and explanatory diagrams.

Context is descriptive and explanatory.

It should be readable without parsing YAML.

## `/.agents/contracts/*.yaml`

Contracts encode deterministic constraints.

They own:

- allowed architecture dependencies,
- route inventory,
- domain vocabulary,
- required entities and fields,
- capability names,
- integration boundaries,
- lifecycle states and transitions,
- validation commands,
- prohibited behavior,
- required quality gates.

Contracts should describe claims that can be validated mechanically or compared deterministically.

They should not contain essays.

## `/context/specs/**/*.md`

Specifications define scoped implementation intent.

A specification owns:

- problem statement,
- goals,
- non-goals,
- user-visible behavior,
- affected routes,
- affected entities,
- acceptance criteria,
- authorization rules,
- lifecycle effects,
- data migration impact,
- integration impact,
- test plan,
- rollout and rollback when consequential.

A specification is narrower than architecture.

It may not override durable architecture without an explicit architectural decision.

## `/.agents/execution/*.json`

Execution JSON records current work state.

It owns:

- what is planned,
- what is active,
- what is complete,
- what remains,
- blockers,
- evidence,
- handoff state,
- scoped decisions made during implementation.

Execution state is mutable.

It must never silently redefine product or architecture.

---

# Source-of-truth precedence

Use one explicit precedence order.

```text
1. Platform, legal, security, and repository safety constraints
2. Current explicit user/task instruction
3. Approved scoped specification
4. Deterministic .agents/contracts
5. Canonical /context documentation
6. Accepted architectural and product decisions
7. Existing tests and implementation
8. Execution JSON
9. Agent inference and implementation judgment
```

Important nuance:

- A current task may request a contract change.
- The agent must identify that it is changing durable governance.
- It should not quietly violate the existing contract and call that implementation.
- Execution JSON never overrides contracts or canonical context.
- Existing code is evidence of current implementation, not automatically proof of intended architecture.

When authoritative sources conflict, stop and report the exact conflict.

Do not resolve it by choosing whichever file makes the task easier.

---

# `AGENTS.md` canonical shape

```md
# Repository Agent Guide

## Repository purpose

One-paragraph product and system definition.

## Required reading

1. `context/00-system/architecture.md`
2. `context/10-product/product-definition.md`
3. `.agents/contracts/architecture-boundaries.yaml`
4. `.agents/contracts/quality-gates.yaml`
5. Active specification for the task
6. `.agents/execution/handoff.json`

## Source precedence

Explicit precedence list.

## Non-negotiable boundaries

- No Prisma in routes, features, or components.
- No provider SDK outside integration adapters.
- Protected reads use fetchers.
- Mutations use Server Actions or Route Handlers delegating to workflows.
- Transaction helpers accept transaction clients only.
- Tenant isolation may not be weakened.

## Execution rules

- Make the smallest correct change.
- Do not invent product behavior.
- Do not run destructive commands without approval.
- Run narrow validation first.
- Update progress and handoff evidence.
- Stop on source conflict.

## Canonical commands

- `pnpm validate:fast`
- `pnpm validate:ci`
- `pnpm test:integration`
- `pnpm test:e2e`

## Handoff requirements

- changed files
- validation executed
- validation not executed
- known risks
- next action
```

---

# Product contract example

```yaml
# .agents/contracts/product.yaml

version: 1

product:
  name: Hipster Stack SaaS Template
  category: multi-tenant-b2b-saas
  tenant_term: organization

  required_surfaces:
    - public
    - authentication
    - tenant
    - administration
    - api
    - webhooks

  required_capabilities:
    - organization.read
    - organization.manage
    - membership.read
    - membership.manage
    - billing.read
    - billing.manage
    - audit.read

  prohibited_assumptions:
    - clerk_metadata_is_product_role_truth
    - route_group_creates_tenancy
    - client_role_check_is_authorization
    - webhook_delivery_is_exactly_once
```

---

# Architecture boundary contract example

```yaml
# .agents/contracts/architecture-boundaries.yaml

version: 1

layers:
  app:
    roots:
      - app
    may_import:
      - features
      - actions
      - fetchers
      - components
      - types
      - schemas
    forbidden_imports:
      - prisma
      - stripe
      - lib/db
      - lib/integrations/provider-sdk

  features:
    roots:
      - features
    may_import:
      - fetchers
      - actions
      - components
      - types
      - schemas
    forbidden_imports:
      - prisma
      - stripe
      - lib/db
      - clerk-server-sdk

  components:
    roots:
      - components
    may_import:
      - components
      - types
      - schemas
    forbidden_imports:
      - lib/db
      - lib/fetchers
      - lib/integrations
      - auth/server

  actions:
    roots:
      - lib/actions
    requires_directive:
      - use-server
    may_import:
      - schemas
      - auth
      - application
      - cache
      - errors
      - types
    forbidden_imports:
      - prisma
      - stripe

  transactions:
    roots:
      - lib/db/transactions
    required_first_parameter:
      type: Prisma.TransactionClient
    forbidden_imports:
      - next/cache
      - next/navigation
      - clerk
      - stripe
      - email

rules:
  - id: no-prisma-outside-data-layer
    severity: error

  - id: no-provider-sdk-outside-integrations
    severity: error

  - id: no-framework-effects-in-workflows
    severity: error
```

The validator should map these concepts to actual import and AST checks.

---

# Route contract example

```yaml
# .agents/contracts/routes.yaml

version: 1

routes:
  - id: public-home
    path: /
    surface: public
    auth: public
    feature: public-home

  - id: tenant-project-list
    path: /organizations/[organizationId]/projects
    surface: tenant
    auth: membership
    capability: project.read

  - id: tenant-project-detail
    path: /organizations/[organizationId]/projects/[projectId]
    surface: tenant
    auth: membership
    capability: project.read
    resource_policy: project-read

  - id: stripe-webhook
    path: /api/stripe/webhooks
    surface: webhook
    auth: stripe-signature
    method:
      - POST

prohibited_routes:
  - /debug
  - /api/internal/secrets
```

Validation can compare this inventory against the `app/` route tree.

---

# Domain contract example

```yaml
# .agents/contracts/domain-model.yaml

version: 1

entities:
  Organization:
    tenant_root: true
    required_fields:
      - id
      - slug
      - name

  Membership:
    tenant_owned: true
    tenant_key: organizationId
    unique:
      - [organizationId, userId]

  Project:
    tenant_owned: true
    tenant_key: organizationId
    lifecycle: project
    required_fields:
      - id
      - organizationId
      - ownerUserId
      - status
      - version

invariants:
  - id: every-tenant-record-has-tenant-key
  - id: membership-is-unique-per-user-and-organization
  - id: mutable-lifecycle-entities-have-version
```

This contract should be compared with the Prisma schema and migrations.

---

# Integration contract example

```yaml
# .agents/contracts/integrations.yaml

version: 1

integrations:
  clerk:
    owns:
      - authentication
      - sessions
      - identity-verification
    does_not_own:
      - tenant-membership
      - product-roles
      - billing-entitlements

  stripe:
    owns:
      - provider-payment-state
      - provider-customer-state
      - provider-subscription-state
    application_owns:
      - entitlements
      - invoice-lifecycle
      - tenant-authorization
      - reconciliation-policy

    required_controls:
      - stable-idempotency-keys
      - signed-webhooks
      - durable-webhook-inbox
      - processing-leases
      - provider-object-mirrors
      - reconciliation-jobs
      - outbox-for-secondary-effects
```

---

# Quality gate contract example

```yaml
# .agents/contracts/quality-gates.yaml

version: 1

commands:
  fast:
    command: pnpm validate:fast
    required_steps:
      - format-check
      - lint
      - typecheck
      - architecture-boundaries
      - unit-tests

  ci:
    command: pnpm validate:ci
    required_steps:
      - validate-fast
      - prisma-validate
      - governance-validation
      - integration-tests
      - production-build
      - e2e-smoke

release_requirements:
  - ci-passes
  - migrations-reviewed
  - no-unresolved-critical-findings
  - handoff-complete
```

CI should invoke the canonical command rather than reimplementing the list manually.

---

# Execution JSON contracts

## `backlog.json`

```json
{
  "version": 1,
  "updatedAt": "2026-08-05T21:00:00.000Z",
  "items": [
    {
      "id": "HS-042",
      "title": "Implement webhook processing leases",
      "status": "ready",
      "priority": "P0",
      "spec": "context/specs/active/HS-042-webhook-leases.md",
      "dependsOn": [],
      "acceptanceCriteria": [
        "Active leases cannot be concurrently claimed",
        "Expired leases can be reclaimed",
        "Stale workers cannot finalize"
      ]
    }
  ]
}
```

## `progress.json`

```json
{
  "version": 1,
  "activeItemId": "HS-042",
  "phase": "implementation",
  "status": "in_progress",
  "completedSteps": [
    "schema migration drafted",
    "claim transaction implemented"
  ],
  "remainingSteps": [
    "recovery worker",
    "concurrency integration tests"
  ],
  "blockedBy": [],
  "evidence": {
    "changedFiles": [],
    "validationRuns": []
  }
}
```

## `decisions.json`

```json
{
  "version": 1,
  "decisions": [
    {
      "id": "DEC-017",
      "date": "2026-08-05",
      "status": "accepted",
      "scope": "webhooks",
      "decision": "Use expiring leases with lock tokens.",
      "reason": "Prevents concurrent ownership and stale-worker finalization.",
      "supersedes": null,
      "affectedContracts": [
        ".agents/contracts/integrations.yaml",
        ".agents/contracts/lifecycles.yaml"
      ]
    }
  ]
}
```

Durable architectural decisions should also be promoted into canonical context or an ADR.

The execution log is not the final resting place for permanent architecture.

## `handoff.json`

```json
{
  "version": 1,
  "taskId": "HS-042",
  "status": "ready_for_review",
  "summary": "Implemented expiring webhook leases and stale-worker protection.",
  "changedFiles": [],
  "validation": {
    "executed": [
      {
        "command": "pnpm test:integration webhooks",
        "result": "passed"
      }
    ],
    "notExecuted": [
      {
        "command": "pnpm test:e2e",
        "reason": "No browser-facing behavior changed."
      }
    ]
  },
  "knownRisks": [],
  "nextAction": "Review migration and merge."
}
```

Handoff must distinguish:

- inspected,
- implemented,
- validated,
- not validated,
- inferred.

Do not write “all tests pass” when only one mocked unit test ran.

---

# Specification contract

A canonical feature specification should include:

```md
# Feature: Organization invitations

## Problem

## Goals

## Non-goals

## User roles

## User flows

## Routes

## Data model impact

## Authorization

## Lifecycle transitions

## Integrations

## Inputs and outputs

## Failure states

## Acceptance criteria

## Test plan

## Migration and backfill

## Observability

## Rollout and rollback

## Affected contracts
```

The specification translates product intent into implementation constraints.

It should not dictate incidental implementation details unless those details protect a required property.

---

# Governance lifecycle

```text
Ideation
  ↓
Canonical context
  ↓
Deterministic contract
  ↓
Scoped specification
  ↓
Execution plan
  ↓
Implementation
  ↓
Validation evidence
  ↓
Decision and handoff
  ↓
Context/contract update
  ↓
Archive
```

## Ideation

Explores alternatives without pretending a decision exists.

## Context

Records the accepted mental model and rationale.

## Contract

Encodes deterministic constraints.

## Specification

Defines the scoped change.

## Execution

Tracks current work.

## Validation

Produces evidence.

## Handoff

Explains current state to the next human or agent.

## Archive

Preserves history without polluting active instructions.

---

# Agent operating loop

```text
1. Read AGENTS.md.
2. Identify the active specification.
3. Load affected context documents.
4. Load affected deterministic contracts.
5. Inspect current execution and handoff state.
6. Inspect implementation evidence.
7. Report conflicts before changing code.
8. Make the smallest contract-compliant change.
9. Run the narrowest useful validation.
10. Run required integration/release gates when authorized.
11. Update progress, decisions, and handoff.
12. Promote durable discoveries into context/contracts.
```

The loop prevents agents from repeatedly rediscovering the same architecture and making incompatible local decisions.

---

# Conflict handling

A governance conflict should be reported in a fixed shape.

```text
Conflict ID:
Sources:
Claim A:
Claim B:
Affected implementation:
Risk of choosing A:
Risk of choosing B:
Recommended resolution:
Work blocked:
```

Example:

```text
Claim A:
  architecture-boundaries.yaml forbids Prisma in app/**

Claim B:
  existing app/(tenant)/layout.tsx imports Prisma

Resolution:
  Treat the contract as intended architecture.
  Move the read behind a fetcher unless the task explicitly changes the contract.
```

Do not quietly “follow existing patterns” when the existing pattern violates a higher-authority contract.

---

# Governance validation

Validation must progress beyond syntax.

## Level 1: Presence

Verify required files exist.

## Level 2: Syntax

Verify YAML and JSON parse and conform to JSON Schema.

## Level 3: Cross-document semantics

Verify:

- route IDs are unique,
- capabilities referenced by routes exist,
- lifecycle names referenced by entities exist,
- quality-gate commands exist in `package.json`,
- integration names are consistent,
- execution files reference real specifications.

## Level 4: Codebase conformance

Verify:

- route contract matches route tree,
- domain contract matches Prisma schema,
- import boundaries match source imports,
- Server Actions contain `"use server"`,
- provider SDK imports remain in integration modules,
- transaction helpers accept transaction clients,
- prohibited routes do not exist.

## Level 5: Runtime properties

Verify through integration tests:

- tenant isolation,
- RLS,
- transaction concurrency,
- webhook lease exclusivity,
- provider idempotency,
- lifecycle transition invariants.

A YAML parser is not architectural enforcement.

---

# Validator shape

```ts
// scripts/validate-governance.ts

async function main(): Promise<void> {
  const governance = await loadGovernanceFiles();

  validateSchemas(governance);

  validateCrossReferences(governance);

  await validateRouteInventory({
    contract: governance.routes,
    appDirectory: "app",
  });

  await validateArchitectureImports({
    contract: governance.architectureBoundaries,
    sourceRoots: [
      "app",
      "features",
      "components",
      "lib",
    ],
  });

  await validatePrismaContract({
    contract: governance.domainModel,
    schemaPath: "prisma/schema.prisma",
  });

  validatePackageCommands({
    contract: governance.qualityGates,
    packagePath: "package.json",
  });

  console.log("Governance validation passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

The actual implementation may use:

- JSON Schema,
- YAML parsers,
- TypeScript AST inspection,
- dependency graph tooling,
- route-tree inspection,
- Prisma DMMF or schema parsing.

---

# CI integration

```json
{
  "scripts": {
    "validate:governance": "tsx scripts/validate-governance.ts",
    "validate:architecture": "tsx scripts/validate-architecture.ts",
    "validate:fast": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm validate:architecture && pnpm test:unit",
    "validate:ci": "pnpm validate:fast && pnpm prisma:validate && pnpm validate:governance && pnpm test:integration && pnpm build && pnpm test:e2e:smoke"
  }
}
```

GitHub Actions:

```yaml
- name: Validate
  run: pnpm validate:ci
```

The workflow invokes the repository contract.

It does not maintain a second drifting definition of validation.

---

# Contract change protocol

Changing durable governance requires an explicit protocol.

```text
1. Identify the contract being changed.
2. Explain why existing behavior is insufficient.
3. Update canonical context.
4. Update machine-readable contract.
5. Update implementation.
6. Update validation.
7. Record the decision.
8. Migrate affected execution/spec files.
9. Run the full affected gate.
```

Do not modify code first and rewrite governance afterward to justify it.

---

# Archival rules

Active governance should remain current.

Move superseded material into explicit archives:

```text
context/specs/archived/
context/archive/
.agents/execution/archive/
```

Archived documents must be marked:

```yaml
status: superseded
superseded_by: path/to/current-document.md
```

Agents should not treat archived sources as current authority.

---

# Secret-handling rule

Governance artifacts must never contain:

- API keys,
- webhook secrets,
- database credentials,
- session tokens,
- private certificates,
- raw production payloads,
- copied `.env` values.

Contracts may name required environment variables.

They may not contain their values.

Generated evidence must redact secrets before persistence.

---

# Governance tests

Test:

- all YAML and JSON conform to schemas,
- all referenced files exist,
- route contract matches route tree,
- capabilities are defined once,
- lifecycle references resolve,
- quality commands exist,
- architecture imports conform,
- domain entities match Prisma,
- execution JSON cannot introduce unknown contract identifiers,
- archived documents are not included in active indexes,
- secrets patterns are rejected,
- handoff evidence distinguishes executed and unexecuted validation.

---

# Golden governance checklist

```text
[ ] AGENTS.md is a concise repository entrypoint
[ ] Context Markdown explains durable truth and rationale
[ ] YAML contracts encode deterministic constraints
[ ] Specifications define scoped implementation intent
[ ] Execution JSON records mutable work state only
[ ] Source precedence is explicit
[ ] Conflict handling requires stopping and reporting
[ ] Existing code is not automatically treated as intended architecture
[ ] Contracts are schema-validated
[ ] Cross-document references are validated
[ ] Codebase conformance is mechanically checked
[ ] Runtime properties have integration tests
[ ] CI invokes one canonical validation command
[ ] Durable discoveries are promoted out of execution files
[ ] Superseded material is archived and marked
[ ] Governance files contain no secrets
```

## Compressed canonical model

```text
Governance =
  context
  + deterministic contracts
  + scoped specifications
  + execution state
  + decisions
  + handoff evidence
  + mechanical validation
```

The governance system tells agents what is true, what is allowed, what is being changed, what has actually been validated, and when they must stop instead of confidently manufacturing a new architecture.
