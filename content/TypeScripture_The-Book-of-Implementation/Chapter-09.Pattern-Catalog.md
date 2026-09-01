# Chapter 09: Pattern Catalog

**The Book of Implementation™**

This catalog names the recurring implementation patterns without inventing extra architectural layers. The folders below are the concrete homes established by the current architecture.

## Canonical placement

```text
lib/fetchers/                  P01  domain-organized reads
lib/actions/                   P02  domain-organized mutations
lib/workflows/                 P03  domain business-logic blocks
lib/db/transactions/           P04  atomic local database operations
lib/db/selects/                P05  exact typed Prisma projections
lib/db/dto/                    P06  persistence -> application DTO mapping
lib/auth/ + lib/authz/         P07  authentication + RBAC authorization
lib/integrations/<provider>/   P08  provider client + capability helpers
lib/cache/                     P09  invalidation, cache life, tags
lib/constants/                 P10  cross-cutting stable values
lib/utils/                     P11  generic reusable helpers
schemas/                       P12  domain-organized Zod runtime validation
types/                         P13  domain-organized TypeScript types/interfaces
prisma/                        P14  schema, migrations, seed, grants/RLS
generated/prisma/              P15  generated Prisma output; do not hand-edit
app/api/<provider>/.../route.ts
                               P16  provider HTTP webhook boundary
```

## Provider pattern

A normal integration follows a simple shape:

```text
lib/integrations/<provider>/
  client.ts
  <capability>.ts
  <capability>.ts
```

Examples include Cloudinary client + transformations/uploads, Hugging Face client + embeddings/inference, and Stripe client + checkout/portal/subscriptions/webhooks. Stripe has more files because the application uses more distinct Stripe capabilities; it is still the same provider-client-plus-capabilities pattern.

Authentication and persistence are concern-first exceptions. Clerk belongs under `lib/auth/`; Neon/Prisma belong to the database concern.

## Workflow pattern

Workflows are not stored in `lib/<domain>/workflows/`. The established convention is shallow domain-named files under `lib/workflows/`, such as `crmWorkflows.ts` and `projectsWorkflows.ts`.

## Webhook pattern

There is no separate canonical `lib/webhooks/` architectural layer in this convention. The HTTP endpoint remains in `app/api/.../route.ts`; provider-specific webhook helpers remain with the provider, normally `lib/integrations/<provider>/webhooks.ts`. Clerk webhook helpers may live under `lib/auth/` when they genuinely belong to the identity concern.

## Implementation rule

Use one obvious owner for each responsibility. Do not instantiate supporting patterns as folders merely for architectural ceremony, do not duplicate lower-level behavior inside Workflows, and prefer explicit direct imports over barrel exports by default.

For every closed vocabulary or cross-layer invariant, record the semantic owner and whether each other representation is derived or exhaustively translated. A type alias, Zod enum, Prisma enum, provider mapper, and UI option list that happen to contain the same strings are not five authorities.
