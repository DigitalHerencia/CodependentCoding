---
title: Codependent Coding Pattern 004 Transaction Helper
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: transaction-helper
kind: reference
namespace: codependentcoding.patterns.transaction-helper.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.patterns.application-workflow.reference]]"
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/transaction
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/04-transaction-helper.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: e395a6a0e0bccc526d906d2d8e18e82c1f9ce600
source_format: markdown
---
# Pattern 004: Transaction Helper

**Purpose/context.** A transaction helper defines database facts that must succeed or fail together, especially concurrent lifecycle changes.

**Responsibilities.** Accept `Prisma.TransactionClient` first; perform atomic reads/writes; assert expected tenant/state/version; enforce DB-adjacent invariants; write audit/outbox atomically; return minimal selected persistence result.

**Non-responsibilities.** No root Prisma client union, Clerk, React, Next.js, network/provider calls, email, cache invalidation, raw FormData, user-facing formatting, or broad workflow sequence.

**Contract.** Workflows/webhook reconciliation call it through the canonical transaction/RLS runner. Input is validated trusted application data; output remains in the data/application boundary. Conflict/constraint errors map to stable application failures.

**Concurrency.** Use unique/check/FK constraints, conditional update predicates, optimistic versions, appropriate locks/isolation, and bounded retries only for known safe serialization errors. Tenant context is transaction-local.

**Cache/security.** No cache behavior. Tenant key is present in mutation predicates and RLS policies. Runtime role has no owner/BYPASSRLS privileges.

**Naming/placement.** `lib/db/transactions/<imperative>.tx.ts`; names expose atomic intent.

**Lifecycle/tests.** scoped transaction → read expected facts → conditional mutation → audit/outbox → commit. Real Postgres tests cover rollback, final-slot races, stale version, retry exhaustion, and cross-tenant SELECT/INSERT/UPDATE/DELETE.

**Anti-patterns/adjacent.** `PrismaClient | TransactionClient`, network call while locks are held, `transactionHelper`. Adjacent: runner, workflow, command, RLS, lifecycle.
