---
title: Codependent Coding Pattern 003 Application Workflow
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: application-workflow
kind: reference
namespace: codependentcoding.patterns.application-workflow.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.patterns.transaction-helper.reference]]"
  - "[[codependentcoding.patterns.auth-authz-policy.reference]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/workflow
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/03-application-workflow.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 0dfd43b6ebb335b9aab5da9c259894619960b880
source_format: markdown
---
# Pattern 003: Application Workflow

**Purpose/context.** A workflow owns one named business use-case sequence across policy, persistence, provider, audit, recovery, and result shaping.

**Responsibilities.** Receive trusted Actor and validated command; load current facts; authorize actual resource; enforce lifecycle/readiness; coordinate queries, transactions, commands, integration adapters; establish stable idempotency and durable intent; return framework-neutral DTO and invalidation plan.

**Non-responsibilities.** No `use server`, FormData, JSX, raw HTTP, signature verification, Next.js navigation/cache calls, provider SDK syntax, or long DB transaction around network work.

**Contract.** Actions, handlers, and jobs call it. It calls policy/domain, DB ports, transaction helpers, integration adapters, audit/outbox. IDs are criteria, not authority. Expected failures use stable application codes; cross-system partial failures remain recoverable.

**Transaction/cache.** Atomic local phases use transaction helpers. Provider calls occur after commit; final persistence/reconciliation is separate. The workflow returns logical invalidation intent but never applies it.

**Security/tenant.** Authorizes resource/current state and derives all provider-sensitive values server-side. Audit preserves safe Actor/tenant/operation identity.

**Naming/placement.** `lib/<domain>/workflows/<imperative>.workflow.ts`; one use case per file.

**Lifecycle/tests.** actor+command → facts → authorization → guards → local intent → provider → local completion/outbox → DTO/plan. Test ordering, no provider-in-tx, idempotency reuse, recovery after every partial failure, tenant mismatch, and correct invalidation.

**Anti-patterns/adjacent.** `workflows.ts` utility nation, provider object leakage, fake distributed transaction. Adjacent: action, transaction, integration, lifecycle, webhook.
