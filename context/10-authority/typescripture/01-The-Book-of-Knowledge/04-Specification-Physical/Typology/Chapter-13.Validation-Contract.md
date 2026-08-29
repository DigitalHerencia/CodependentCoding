---
title: Codependent Coding Validation and Conformance Model
type: contract
scope: domain
project: CodependentCoding
domain: validation
artifact: validation-conformance
kind: contract
namespace: codependentcoding.docs.validation-conformance.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.governance-model.contract]]"
  - "[[codependentcoding.agents.contracts.validation.contract]]"
supersedes: []
tags:
  - codependentcoding/validation
  - codependentcoding/conformance
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/17-validation-conformance.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 3acb9d2eb2c68ba7dce813c755ffa7e9624dc0cb
source_format: markdown
---
# Validation and Conformance Model

Validation belongs to the software being built. This knowledge repository defines the proof model; it does not need a parallel miniature CI platform to prove that its own Markdown exists.

## What each mechanism is for

| Mechanism | Proves | Does not prove |
|---|---|---|
| Prettier | deterministic formatting | semantics |
| TypeScript | compile-time interfaces and exhaustiveness | runtime trust or provider behavior |
| ESLint | configured code/import/API rules | business correctness |
| Zod/runtime schemas | runtime input/config shape | authorization or persistence invariants |
| Architecture rules | declared import/layer constraints | runtime tenant isolation |
| Vitest unit tests | pure policy, mapper, schema, and adapter behavior | real infrastructure behavior when mocked |
| Integration tests | collaboration between configured components | production-wide behavior |
| PostgreSQL/RLS tests | constraints, transactions, concurrency, and tenant containment | provider/UI behavior |
| Webhook tests | verification, dedupe, idempotency, retry, and recovery behavior | every live-provider failure mode |
| Playwright | critical browser workflows, keyboard, responsive behavior | backend isolation by itself |
| Accessibility checks | detectable semantic, keyboard, and contrast problems | complete human usability |
| Security scans | known dependency, secret, and static findings | absence of unknown vulnerabilities |
| Production build | framework compilation and integration | production correctness |
| Deployment smoke | deployed application responds in target environment | complete product behavior |
| Manual review | intent, tradeoffs, threat analysis, maintainability | reproducible runtime proof by itself |

## Gate sequence

Use the narrowest affected checks during iteration. A generated application should normally progress through:

1. **Fast:** format, lint, typecheck, architecture rules, unit tests.
2. **CI:** Fast plus Prisma/schema validation, contract checks, affected integration tests, production build.
3. **Release:** CI plus real database/RLS tests, critical E2E/accessibility, security scans, migration review, deployment, and smoke checks as applicable.

The exact scripts belong to the generated application and may evolve with its stack. The proof claim must never exceed the checks that actually ran.

## Evidence semantics

Distinguish four states when reporting work:

- **executed:** the check actually ran and has a passed or failed result;
- **skipped:** the check was known but deliberately not run;
- **blocked:** the check could not run because a prerequisite was unresolved;
- **inferred:** the conclusion came from inspection or reasoning rather than execution.

Expected output, confidence, issue status, or a previous revision's green run is not current executed evidence.

## High-risk validation

Authentication, authorization, tenant/RLS behavior, money movement, provider reconciliation, migrations, destructive data operations, and privileged configuration require checks at the real boundary whenever practical. Mock-only success is not enough for claims about those properties.

## Knowledge-repository maintenance

For changes to this repository, review the affected Markdown/YAML for coherent terminology, working relative references, contradictions, placeholders, and agreement with the controlling doctrine and source decisions. Do not build a second software product whose purpose is to test the documentation describing the first one.
---
title: Codependent Coding Validation Contract
type: contract
scope: domain
project: CodependentCoding
domain: validation
artifact: machine-contract
kind: contract
namespace: codependentcoding.agents.contracts.validation.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.validation-conformance.contract]]"
supersedes: []
tags:
  - codependentcoding/contracts
  - codependentcoding/validation
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: .agents/contracts/validation.yaml
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 3b25146e14342574dfb3cbea92d19096c3378dfb
source_format: yaml
---
# Validation Machine Contract

The original machine-readable payload is preserved verbatim below.

```yaml
version: 1
status: final
scope: generated-application-validation

principles:
  - validation-proves-only-what-executed
  - inspection-is-not-runtime-proof
  - failures-block-the-claim-they-protect
  - security-critical-properties-require-representative-real-boundary-tests
  - generated-applications-own-their-own-test-suites

product_fast:
  required_steps:
    - format-check
    - lint
    - typecheck
    - architecture-boundary-checks
    - unit-tests

product_ci:
  required_steps:
    - product-fast
    - prisma-validate
    - contract-validation
    - affected-integration-tests
    - production-build

product_release:
  required_steps:
    - product-ci
    - database-rls-tests
    - critical-e2e
    - accessibility
    - security-scans
    - migration-review
    - deployment-smoke

proof_limits:
  static-analysis: does-not-prove-runtime-data-isolation
  mocked-tests: do-not-prove-real-provider-or-database-behavior
  browser-tests: do-not-prove-backend-tenant-containment-by-themselves
  green-ci: proves-only-the-configured-gates-on-the-tested-revision

manual_review_required_for:
  - authentication-or-authorization
  - tenant-or-rls
  - money-or-provider-state
  - migration-or-data-loss
  - lifecycle-transition
  - secret-or-privileged-configuration
  - public-contract-change
```
