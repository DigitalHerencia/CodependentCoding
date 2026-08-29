# Loaded Vibes™ WebApp Architecture

## Context and topology

Loaded Vibes™ is the reusable architectural form for a server-first multi-tenant B2B SaaS application. A browser reaches a Next.js application deployed on Vercel. Clerk supplies authentication, Neon Postgres stores application truth, Prisma mediates approved application persistence, and Stripe supplies optional subscription billing and/or Connect payment capabilities. Provider events enter through verified Route Handlers and reconcile into bounded local state.

## Architectural grammar

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Transactions preserve invariants. Webhooks reconcile external truth.

## Repository topology

| Root | Canonical ownership |
|---|---|
| `app/` | routes, layouts, metadata, params, redirects, Suspense, HTTP |
| `features/` | page/use-case presentation orchestration and page-state loaders |
| `components/ui/` | domain-agnostic accessible primitives |
| `components/shared/` | reusable product-agnostic presentation |
| `components/<domain>/` | domain presentation over DTO/display contracts |
| `lib/fetchers/` | authenticated, authorized, bounded reads |
| `lib/actions/` | thin public Server Action adapters |
| `lib/<domain>/workflows/` | named application use cases |
| `lib/auth/` | Clerk-to-local actor adaptation |
| `lib/authz/` | membership, capabilities, scopes, resource/workflow policies |
| `lib/db/selects/` | exact Prisma projections |
| `lib/db/dto/` | persistence-to-transport mapping |
| `lib/db/queries/` | internal trusted-scope reads |
| `lib/db/commands/` | bounded persistence writes |
| `lib/db/transactions/` | atomic database mechanics and canonical RLS transaction helper |
| `lib/integrations/` | provider SDK clients and semantic adapters |
| `lib/webhooks/` | durable verified event processing and reconciliation |
| `schemas/` | Zod runtime trust-boundary schemas |
| `types/` | stable transport and shared contracts |
| `prisma/` | schema, migrations, grants, RLS policies, generated client |
| `context/`, `.agents/` | human and machine governance |

## Dependency direction

Dependencies flow from framework/presentation adapters toward stable application/domain/data/provider ports. Data, domain, and integration layers MUST NOT depend on routes, features, or presentation. Detailed imports are governed by [Layer Contracts](12-layer-contracts.md).

## Tenant model

`Tenant` is the abstraction; `Organization` is the reference entity. Access is established through local `User` plus active `Membership`. Membership roles aggregate capabilities. Resource policies evaluate actual records; workflow policies evaluate legal state. A product MAY rename Organization only through an approved ADR and coherent reset of schema, migrations, RLS, code, contracts, copy, fixtures, and tests.

Every tenant-owned table MUST contain an unambiguous tenant key and supporting indexes. The runtime connection MUST set tenant context transaction-locally in the one canonical database helper. All tenant operations MUST use the returned transaction-scoped Prisma client.

## Read boundary

```text
untrusted read input → Zod → actor → membership/capability scope
→ RLS-scoped transaction → explicit select → DTO mapper → serializable DTO
```

Exported fetchers self-secure. They are read-only and MUST NOT hide synchronization writes. Singular absence returns `null` when expected; routes decide `notFound()`. Collections are bounded and paginated. Freshness is default for tenant-operational, authz, entitlement, readiness, and payment state.

## Mutation boundary

```text
form/client intent → Server Action → schema → actor → workflow
→ resource authorization → invariant/readiness checks
→ transaction/provider sequence → audit/outbox → invalidation intent
→ framework invalidation/redirect → ActionResult
```

Actions adapt transport. Workflows own sequence. Transaction helpers own atomic database facts. Integration adapters own provider mechanics. Framework effects remain in actions/routes.

## Provider consistency

PostgreSQL and providers do not share ACID transactions. A consequential provider workflow MUST persist stable local intent and idempotency before the provider call, make the network call outside a DB transaction, persist normalized results, and reconcile authoritative provider truth through retrieval and webhooks. Partial states MUST be operator-visible and recoverable.

## Presentation composition

```text
semantic tokens → primitives → shared components → domain components
→ blocks → feature orchestration → route
```

Server Components are default. Client boundaries exist only for browser events, local interaction, or browser APIs. Pure presentation accepts typed props/slots and action references; it MUST NOT call protected fetchers, Clerk backend APIs, provider SDKs, or Prisma. The asset contract includes accessibility, responsive behavior, fixtures, and registry metadata. Catalog/workbench routes are isolated from production defaults.

## Caching and revalidation

Request-local memoization MAY deduplicate actor/session resolution. Persistent cache requires named ownership, key and tenant scope, freshness budget, authorization analysis, invalidation owner, failure behavior, and tests. Workflows return logical invalidation plans; Server Actions apply precise tags/paths after success. Cache entries MUST NOT become authority for irreversible decisions.

## Errors and observability

Expected failures use stable codes such as `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, and `PROVIDER_ERROR`. Unknown failures receive correlation context and a safe external message. Logs MUST include operation, request/event ID, safe actor/tenant/resource identifiers, duration, outcome, and error class; they MUST exclude secrets, raw tokens, unrestricted provider payloads, payment data, and sensitive personal fields.

## Configuration and deployment

Environment is parsed centrally at startup into separate server/public typed objects. Runtime uses pooled restricted DB credentials; migrations use a direct privileged owner path. Package manager and supported versions are pinned in generated products. GitHub Actions invokes repository-owned gates. Vercel preview and production deployments follow approved environment separation, migration ordering, rollback planning, and post-deploy verification.

## Non-goals

The architecture does not require microservices, a generic service layer, client-side data authority, Clerk Organizations, Stripe Connect, persistent caching, or a sample Project domain. Optional modules MUST be removable without corrupting core boundaries.
