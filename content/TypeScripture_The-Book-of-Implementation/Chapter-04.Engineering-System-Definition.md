# Chapter 04: Engineering System Definition

**The Book of Implementation™**

## Canonical backend-ish topology

`lib` is the application's operations/infrastructure directory. It is often shorthand for "server operations," but it is deliberately not named `server` because not everything inside is server-only.

```text
lib/
  actions/               # domain-organized mutations: <domain>Actions.ts
  auth/                  # authentication/identity; Clerk lives here
  authz/                 # permissions, policies, resources, roles
  cache/                 # invalidation, cache life, tags
  constants/             # cross-cutting stable values
  db/
    dto/                  # persistence record -> application DTO mappers
    selects/              # explicit typed Prisma projections
    transactions/         # atomic local database operations
    client.ts             # Prisma client using Neon adapter
    provider.ts           # provider/external transaction context
    tenant.ts             # authenticated tenant/RLS transaction context
  fetchers/              # domain-organized reads: <domain>Fetchers.ts
  integrations/          # provider folders: client + capability helpers
  utils/                 # generic helpers; direct imports preferred
  workflows/             # domain business-logic blocks: <domain>Workflows.ts
schemas/                  # domain-organized Zod runtime validation
types/                    # domain-organized TypeScript types/interfaces
prisma/                   # schema, migrations, seed, grants/RLS
generated/prisma/         # generated Prisma output; do not hand-edit
proxy.ts                  # Clerk/Next request protection
prisma.config.ts          # Prisma tooling configuration
```

## Concern-first placement

Third-party code is not automatically an `integration`. The architectural concern wins over the vendor label. Clerk belongs in `lib/auth`; Neon/Prisma belong to the database concern; other external providers such as Stripe, Cloudinary, Hugging Face, SendGrid, and Vercel Blob belong in `lib/integrations/<provider>/`.

## Domain naming

Domain-oriented operational files stay shallow and predictable: `adminActions.ts`, `adminFetchers.ts`, `adminWorkflows.ts`, and the corresponding `adminTypes.ts` and `adminSchemas.ts`. The same pattern applies to the other domains.

## Operational flow

```text
Read:
caller -> Fetcher -> auth/authz -> tenant DB context -> Prisma select -> DTO mapper -> caller

Write:
caller -> Action -> Zod validation -> auth/authz -> tenant DB context -> transaction helper -> DTO -> caller

Business process:
caller -> Workflow -> existing Actions/Fetchers/Integrations/Utils/Types/Schemas -> business result

Provider webhook:
provider -> app/api/.../route.ts -> integration webhook helpers -> application/database operations
```

## Abstraction rule

Do not create a generic service layer just to have one. Prefer direct domain-named modules and explicit imports. Workflows are the business-logic composition layer; utilities are only for helpers that do not have a better architectural owner.
