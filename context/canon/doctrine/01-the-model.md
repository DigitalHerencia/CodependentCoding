---
title: The Model
slug: model
order: 1
summary: The two compositions, the dependency graph, the request lifecycles, and the classifier that decides where every file goes.
rules: [CC-FLOW-002, CC-FLOW-003, CC-NAME-002]
---

# The Model

## Two compositions

An application in this doctrine is built from two parallel compositions that meet in the **feature**.

```text
PRESENTATION (pure)                     LOGIC (server)
components/ui        primitive          lib/db/selects · lib/db/dto · lib/db/transactions
     ↓                                  lib/auth · lib/authz · lib/integrations · schemas
components/blocks    block                   ↓
     ↓                                  lib/fetchers (read)   lib/actions (write, "use server")
components/templates template                ↓                        ↓
     ↓                                  lib/workflows (compose)  ← ─ ─ ┘
     └──────────────►  features/<slice>  ◄──────────────┘
                              ↓
                       app/<group>/page.tsx  (route)
```

The presentation side never touches data. The logic side never renders. A feature is the only place both meet: it awaits logic, then hands DTOs to a template.

## The dependency graph

Imports point down. Nothing points up. There are no cycles.

| Layer                                   | MAY import                                                                                                                                               | MUST NOT import                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Route (`app/**/page.tsx`, `layout.tsx`) | features, blocks (public pages only), shells, `lib/auth/redirects`                                                                                       | db, fetchers, actions, workflows, integrations, primitives  |
| Route handler (`app/api/**/route.ts`)   | `lib/integrations/<provider>/webhooks` (verify, classify, re-fetch), `lib/db/transactions` (inbox, reconcile) through `withSystemTransaction`, `lib/env` | Prisma client, provider SDKs, presentation                  |
| Feature (server)                        | workflows, fetchers, templates, blocks, client islands, forms                                                                                            | db, transactions, integrations, provider SDKs, primitives   |
| Form (`*Form.tsx`)                      | actions, schemas, primitives, blocks                                                                                                                     | fetchers, workflows, db, integrations                       |
| Client island (`*.client.tsx`)          | actions, interactive primitives, blocks                                                                                                                  | fetchers, workflows, db, anything `server-only`             |
| Template / block / nav / shell          | blocks, primitives, types                                                                                                                                | anything in `lib/` except `lib/utils/cn`                    |
| Workflow                                | fetchers, transactions, integrations, authz, cache, schemas, types, utils, constants                                                                     | **actions**, Prisma client, provider SDKs                   |
| Action (`"use server"`)                 | workflows, transactions, db wrappers, selects, DTOs, authz, auth, schemas, cache, ratelimit                                                              | integrations directly (go through a workflow), presentation |
| Fetcher                                 | db wrappers, selects, DTOs, authz, auth, schemas                                                                                                         | actions, workflows, transactions, integrations              |
| Transaction helper                      | Prisma transaction client types, selects, errors                                                                                                         | network, integrations, auth                                 |
| Integration                             | its own SDK, `lib/env/<owner>`                                                                                                                           | db, actions, workflows                                      |

> **CC-FLOW-003** · `now` · `codependent/layer-boundaries`
> Workflows MUST NOT import a module that begins with `"use server"`.
> Each action commits its own transaction. A workflow that calls two actions performs two commits, so a failure between them leaves half a business operation in the database. Actions are also public POST endpoints; internal composition must not depend on them.

This is the one place the doctrine reverses an earlier lock (reconciliation ledger A-1). The symmetry you designed is preserved: helpers compose into workflows that features render (reads), and forms call actions that may delegate to workflows (writes).

## Request lifecycles

### Page render (read)

```text
GET /projects/42
 → proxy.ts            UX gate only (signed in?) + CSP nonce
 → (tenant)/layout.tsx shell + UX redirect (onboarding/pending)
 → projects/[projectId]/page.tsx    await params → <Suspense fallback={<ProjectSkeleton/>}><ProjectFeature id/></Suspense>
 → ProjectFeature      await getProjectWorkspace(id)              (workflow, or a fetcher directly)
     → fetcher         parse id → withTenantRead(tx, access) → assertPermission → findFirst({ where: {id, organizationId}, select }) → toDTO
 → template            <ProjectDetailTemplate project={dto} />
```

### Mutation

```text
<form> submit (client)
 → action             authenticate → rate-limit → parse → withTenantTransaction(tx, access)
                        → assertPermission (role) → scoped write / *.tx helper / workflow → audit row
                      → commit → invalidate tags → ActionResult
 → form               render field errors or toast; router refresh is implicit via cache invalidation
```

### Provider event

```text
POST /api/stripe/webhooks
 → route.ts (owns the lifecycle)
     raw body → integrations/stripe/webhooks.verify → parse envelope
     → inbox receipt tx (unique provider+eventId) → lease tx
     → integrations/stripe classify + re-fetch provider truth (outside any transaction)
     → reconcile tx (state + audit/outbox, one commit) → finalize tx → 2xx
```

## The classifier

Ask in order. The first "yes" decides the file.

```text
Static public presentation, no data?      app/(public)/…/page.tsx + components/blocks
A React Hook Form?                        features/<slice>/<slice><Verb><Thing>Form.tsx
Browser-only interaction?                 features/<slice>/<name>.client.tsx
Assembles a page from data?               features/<slice>/<slice><Thing>Feature.tsx
Loading placeholder?                      features/<slice>/<slice><Thing>Skeleton.tsx
Pure arrangement of blocks for a slice?   components/templates/<slice>-templates.tsx
Reusable presentation?                    components/blocks/<slice>-blocks.tsx
Reads persisted data?                     lib/fetchers/<slice>Fetchers.ts
Mutation entry point?                     lib/actions/<slice>Actions.ts
Composes reads/writes/providers?          lib/workflows/<slice>Workflows.ts
Atomic multi-row write?                   lib/db/transactions/<slice>-<verb>-<noun>.tx.ts
Column allowlist?                         lib/db/selects/<slice>.selects.ts
Record → DTO?                             lib/db/dto/<slice>.dto.ts
Who is calling?                           lib/auth
May they?                                 lib/authz
Provider SDK call?                        lib/integrations/<provider>/<concern>.ts
Provider HTTP request lifecycle?          app/api/<provider>/webhooks/route.ts
Runtime validation?                       schemas/<slice>Schemas.ts
Shared compile-time type?                 types/<slice>Types.ts
Copy?                                     content/<slice>.ts
Cache tag or lifetime?                    lib/cache
Tuning number?                            lib/constants
Pure helper?                              lib/utils
None of the above?                        Stop. Do not invent a layer.
```

> **CC-NAME-002** · `now` · `codependent/no-generic-names`
> No `services/`, `managers/`, `helpers/`, `handlers/`, `common/`, `misc/` directories.
> A generic folder is where classification gives up. If nothing above fits, the design is wrong, not the folder list.

## When to add a workflow

A workflow exists when **at least one** is true:

1. It combines two or more fetchers into one view model a feature needs.
2. It performs read → decide → write where the decision is domain logic, and the write is a transaction helper.
3. It calls a provider and a transaction in sequence (provider outside the transaction).
4. It is called from two or more places.

> **CC-FLOW-002** · `now` · `codependent/no-pass-through`
> A workflow whose body is a single call to another function MUST NOT exist.
> A second name with no added contract is drift with a type signature.

Trivial CRUD is form → action → write. That is the common case, and it is correct.
