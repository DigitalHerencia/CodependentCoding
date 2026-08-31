# Chapter 04: Engineering System Definition

**The Book of Implementation™**

## Canonical repository topology

```text
app/                     # routes, layouts, metadata, HTTP/framework outcomes
features/                # server-first page/use-case orchestration
components/
  ui/                    # domain-agnostic primitives
  blocks/                # reusable pure presentation compositions
lib/
  fetchers/              # protected reads
  actions/               # thin Server Action adapters
  <domain>/
    workflows/           # named application use cases
  auth/                  # Clerk-to-local Actor adaptation
  authz/                 # membership, capability, scope, policy
  db/
    selects/             # explicit Prisma projections
    dto/                 # DTO types/mappers
    transactions/        # canonical RLS runner + atomic helpers
    internal/            # narrowly scoped owner-local DB helpers when actually needed
  cache/                 # cache tags/keys and approved framework cache adapter
  config/                # validated environment and static configuration
  observability/         # logging/tracing adapters and safe correlation
  integrations/          # provider adapters
  webhooks/              # durable provider reconciliation
schemas/                 # runtime trust-boundary schemas
types/                   # shared transport/application contracts
prisma/                  # schema, migrations, grants, RLS
```

## Placement rule

- `lib/application/` is not a canonical catch-all. Workflows are domain-owned: `lib/<domain>/workflows/`.
- `components/shared/` and `components/<domain>/` are not architectural layers. Use `components/ui/` for primitives and `components/blocks/` for pure composed presentation; domain grouping may exist beneath `blocks/` when useful.

## Application flow

```text
Page → Feature → Fetcher(s) → authorized DTOs → Blocks → Primitives
Client intent → Server Action → Schema → Actor → Workflow → Transaction/Integration → Result
Provider → Route Handler → Verification → Durable Inbox → Reconciliation → Local State
```
