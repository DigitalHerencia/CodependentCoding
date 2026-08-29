---
title: Hipster Stack Golden Layer Contract Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: layer-contract
kind: reference
namespace: hipsterstack.patterns.layer-contract.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/layer-contracts
  - patterns/canonical
  - status/review
created: 2026-08-05
updated: 2026-08-05
---

# Canonical Pattern 008: The Golden Layer Contract

A layer contract defines:

- what a layer may receive,
- what it may return,
- what it may know,
- what side effects it may perform,
- what errors it may expose,
- and which dependencies it may import.

Without explicit contracts, architectural layers become folder names.

With explicit contracts, boundaries become reviewable, testable, and enforceable.

## Core rule

> **Every layer must have a narrow input contract, a stable output contract, and an explicit side-effect budget.**

The input should contain the minimum trusted information required to perform the responsibility.

The output should expose the minimum stable representation required by the caller.

---

# Trust progression

Data moves through increasing levels of trust.

```text
external / untrusted
        ↓
runtime validated
        ↓
authenticated
        ↓
authorized
        ↓
domain-valid
        ↓
persistence-ready
        ↓
committed
        ↓
transport-safe
```

Do not treat TypeScript compilation as runtime validation.

Do not treat an authenticated actor as authorized for every tenant.

Do not treat a valid provider payload as valid domain state.

---

# Canonical layer matrix

| Layer | Input | Output | May perform | Must not expose |
|---|---|---|---|---|
| Route/Page | Params, search params, request context | React tree, redirect, not-found | Framework adaptation | Prisma/provider objects |
| Route Handler | Raw HTTP request | HTTP response | Signature/auth validation, workflow invocation | Domain internals |
| Feature loader | Validated route context | Page-resolution union | Fetcher orchestration | Persistence records |
| Feature component | Page state / DTOs | React tree | Presentation composition | Secrets, database clients |
| Fetcher | Untrusted read input | DTO, list DTO, `null` | Authenticated and authorized reads | Prisma payloads |
| Server Action | Untrusted mutation input | `ActionResult<DTO>` | Validation, actor resolution, workflow invocation | Raw exceptions |
| Workflow | Actor + validated command | `MutationOutcome<DTO>` | Use-case coordination | Next.js framework behavior |
| Domain policy | Plain domain facts | Decision or typed domain error | Pure reasoning | Prisma, Clerk, Stripe |
| Query | Authorized scope + read criteria | Selected persistence record | Database reads | UI and transport behavior |
| Command | Trusted write data | Persistence result | Database writes | Provider orchestration |
| Transaction helper | Transaction client + trusted mutation input | Atomic persistence result | Atomic reads/writes | Network calls |
| Select | No runtime input | Prisma projection definition | Field selection | Business decisions |
| DTO mapper | Selected persistence record | DTO | Representation translation | Database access |
| Integration adapter | Provider-neutral command | Provider-normalized result | Provider API calls | Product authorization |
| Webhook processor | Verified provider event + system actor | Processing result | Idempotent reconciliation | Browser session assumptions |
| Outbox worker | Claimed outbox job | Delivery result | Retryable secondary effects | Primary transaction truth |
| Config module | `process.env` / static config | Typed configuration | Startup validation | Unvalidated strings |
| RLS context | Actor/tenant database context | Scoped transaction | Database containment | Product policy decisions |

---

# Contract shape

Use object parameters for any nontrivial boundary.

Good:

```ts
export interface ArchiveProjectWorkflowInput {
  actor: UserActor;
  input: {
    organizationId: string;
    projectId: string;
    expectedVersion: number;
  };
}

export async function archiveProject(
  command: ArchiveProjectWorkflowInput,
): Promise<MutationOutcome<ProjectSummaryDTO>> {
  // ...
}
```

Avoid:

```ts
archiveProject(
  actor,
  organizationId,
  projectId,
  version,
  true,
  false,
);
```

Object contracts:

- communicate names,
- tolerate additive evolution,
- improve logs,
- reduce positional mistakes,
- support schema validation and test fixtures.

---

# Route contract

## Input

```ts
interface PageProps {
  params: Promise<{
    organizationId: string;
    projectId: string;
  }>;

  searchParams: Promise<{
    tab?: string;
  }>;
}
```

The route resolves and validates this into:

```ts
interface ProjectDetailRouteInput {
  organizationId: string;
  projectId: string;
  tab: "overview" | "activity" | "settings";
}
```

## Output

```text
ReactNode
redirect
notFound
HTTP Response
```

The route does not return persistence records to a feature.

---

# Fetcher contract

## Input

```ts
interface GetProjectDetailInput {
  organizationId: string;
  projectId: string;
}
```

The exported fetcher may accept `unknown` when it is the first runtime boundary:

```ts
export async function getProjectDetail(
  rawInput: unknown,
): Promise<ProjectDetailDTO | null>;
```

## Output

Use cardinality deliberately:

```ts
Promise<ProjectDetailDTO | null>
```

means:

> zero or one authorized resource.

```ts
Promise<ProjectListDTO>
```

means:

> a bounded collection with page information.

```ts
Promise<ProjectDetailDTO>
```

means:

> the contract guarantees a result or throws a typed application error.

Do not make every read throw.

Do not make every missing record return `undefined` merely because JavaScript permits it.

## Side-effect budget

Allowed:

- authentication resolution,
- authorization scope derivation,
- database reads,
- request-local memoization,
- explicit read caching.

Forbidden:

- database mutation,
- provider mutation,
- email,
- redirect,
- revalidation.

---

# Action contract

## Input

The action accepts untrusted transport input:

```ts
unknown
FormData
previous state + FormData
```

It converts that input into a validated application command.

## Output

```ts
type ActionResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      code: ActionErrorCode;
      formError?: string;
      fieldErrors?: Record<string, string[]>;
    };
```

The action output must be serializable.

It must not expose:

- stack traces,
- raw Prisma errors,
- raw Stripe errors,
- SQL,
- secrets,
- provider request payloads.

---

# Workflow contract

## Input

```ts
interface UseCaseInput<TCommand> {
  actor: Actor;
  input: TCommand;
}
```

The command has already passed transport validation.

The workflow still validates:

- authorization,
- current resource state,
- business preconditions,
- readiness,
- provider consistency assumptions.

## Output

```ts
interface MutationOutcome<TData> {
  data: TData;

  invalidate?: {
    tags?: string[];
    paths?: string[];
  };
}
```

The workflow returns framework-neutral invalidation intent.

It does not call `redirect()` or render UI.

---

# Domain policy contract

Domain policy functions use plain values and plain domain types.

```ts
interface ProjectArchivePolicyInput {
  actorUserId: string;
  capabilities: ReadonlySet<Capability>;

  project: {
    organizationId: string;
    ownerUserId: string;
    status: ProjectStatus;
  };
}

export function requireProjectArchiveAuthorization(
  input: ProjectArchivePolicyInput,
): void;
```

A pure policy may:

- return a decision,
- return a scope,
- throw a typed domain/application error.

It may not:

- query Prisma,
- call Clerk,
- call Stripe,
- inspect cookies,
- revalidate a route.

---

# Query contract

A query receives an already authorized scope.

```ts
interface ProjectReadScope {
  organizationId: string;
  ownerUserId?: string;
}

interface QueryProjectDetailInput {
  scope: ProjectReadScope;
  projectId: string;
}
```

```ts
export async function queryProjectDetail(
  input: QueryProjectDetailInput,
): Promise<ProjectDetailRecord | null>;
```

The query returns a selected persistence record.

It does not map to presentation copy.

It does not resolve the current actor.

---

# Command contract

A command performs a persistence write that does not itself require a larger atomic unit.

```ts
export interface AttachCheckoutSessionInput {
  paymentAttemptId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  checkoutUrl: string;
}

export async function attachCheckoutSession(
  input: AttachCheckoutSessionInput,
): Promise<PaymentAttemptRecord>;
```

A command may use the root Prisma client.

A transaction helper must accept `Prisma.TransactionClient`.

That distinction is part of the contract.

---

# Transaction contract

```ts
export async function settleInvoicePaymentTx(
  tx: Prisma.TransactionClient,
  input: SettleInvoicePaymentTxInput,
): Promise<SettledPaymentRecord>;
```

The transaction input contains only trusted application data.

The transaction helper may reject:

- stale version,
- illegal expected state,
- tenant mismatch,
- duplicate claim,
- constraint conflict.

It does not resolve a Clerk session.

It does not call Stripe.

---

# Mapper contract

```ts
export function mapProjectDetailDTO(
  record: ProjectDetailRecord,
): ProjectDetailDTO;
```

A mapper is:

- synchronous,
- deterministic,
- side-effect free,
- exhaustive about enum translation,
- responsible for serialization.

A mapper should not return `any`.

A mapper should not quietly spread an entire record:

```ts
return {
  ...record,
};
```

That defeats the boundary.

---

# Integration adapter contract

Use provider-neutral inputs and normalized outputs.

```ts
export interface CreateCheckoutInput {
  attemptId: string;
  amountCents: number;
  currency: string;
  customerProviderId: string;
  idempotencyKey: string;
}

export interface CreatedCheckout {
  provider: "stripe";
  checkoutSessionId: string;
  paymentIntentId: string | null;
  url: string;
}

export async function createCheckout(
  input: CreateCheckoutInput,
): Promise<CreatedCheckout>;
```

The workflow should not need to know:

- Stripe SDK overloads,
- API-version options,
- header placement,
- Connect request syntax,
- provider response unions.

The adapter should not decide:

- whether the invoice is payable,
- whether the actor owns it,
- which tenant the actor belongs to.

---

# Error contract

Use stable error classes and codes across application boundaries.

```ts
type ApplicationErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "PROVIDER_ERROR"
  | "INTERNAL_ERROR";
```

## Expected failures

Expected failures have stable semantics:

- missing membership,
- illegal transition,
- stale version,
- invalid form input,
- unavailable provider prerequisite.

## Unexpected failures

Unexpected failures are:

- programming defects,
- corrupted assumptions,
- unavailable infrastructure not yet classified,
- impossible states.

Unexpected failures are logged with correlation context and hidden from the browser.

---

# Null, error, and empty contracts

These are not interchangeable.

## `null`

Use when a singular authorized lookup may legitimately find nothing:

```ts
ProjectDetailDTO | null
```

## Empty list

Use when a collection exists but has no items:

```ts
{
  items: [],
  pageInfo: {
    hasNextPage: false,
    nextCursor: null,
  },
}
```

## Typed error

Use when the operation cannot proceed:

```text
FORBIDDEN
CONFLICT
PROVIDER_ERROR
```

## `notFound()`

Use only at the route/framework boundary.

---

# Serialization contract

Values crossing into Client Components, Server Action results, HTTP responses, or persisted JSON must be serializable.

Translate:

```text
Date
  → ISO string

Decimal
  → string or integer minor units

BigInt
  → string

Prisma enum
  → application enum

provider object
  → normalized provider DTO

Set
  → array when crossing serialization boundary
```

Do not assume a value is safe because TypeScript accepted it.

---

# Side-effect contract

Every exported boundary should have an understood side-effect class.

```ts
type SideEffectClass =
  | "pure"
  | "read"
  | "database-write"
  | "provider-write"
  | "framework-effect"
  | "secondary-effect";
```

Examples:

| Function | Side-effect class |
|---|---|
| `hasCapability()` | pure |
| `getProjectDetail()` | read |
| `archiveProjectTx()` | database-write |
| `createInvoiceCheckout()` | provider-write |
| `archiveProjectAction()` | framework-effect |
| `sendPaymentReceipt()` | secondary-effect |

A function named `get...` should not perform provider writes.

A mapper should never have hidden I/O.

---

# Import contract

A layer contract includes dependency direction.

```text
app
  → features, actions, fetchers, components, types

features
  → fetchers, actions, components, types

components
  → components, types, action references

actions
  → schemas, auth, workflows, cache adapters, types

workflows
  → authz, domain, queries, commands, transactions, integrations

domain
  → domain types and shared error vocabulary

db
  → Prisma and persistence-only utilities

integrations
  → provider SDKs, typed config, normalized provider types
```

Forbidden examples:

```text
components → Prisma
domain → Next.js
transaction helper → Stripe
integration adapter → feature component
fetcher → redirect()
workflow → FormData
```

---

# Contract registry

A machine-readable contract can document and validate layer rules.

```yaml
version: 1

layers:
  app:
    may_import:
      - features
      - actions
      - fetchers
      - components
      - types
    may_not_import:
      - db
      - integrations/provider-sdk

  features:
    may_import:
      - fetchers
      - actions
      - components
      - types
    may_not_import:
      - db
      - integrations/provider-sdk

  components:
    may_import:
      - components
      - types
    may_not_import:
      - db
      - fetchers
      - integrations
      - auth/server

  workflows:
    may_import:
      - authz
      - domain
      - db/queries
      - db/commands
      - db/transactions
      - integrations
      - types
    may_not_import:
      - app
      - features
      - components
      - next/navigation
      - next/cache

contracts:
  fetcher:
    input: untrusted-read-input
    output: dto
    side_effects:
      - authenticated-read
    forbidden_outputs:
      - prisma-record
      - provider-object

  action:
    input: untrusted-mutation-input
    output: action-result
    side_effects:
      - framework-invalidation
    forbidden_dependencies:
      - prisma
      - stripe-sdk
```

This YAML does not enforce itself.

A validator and import-boundary tests must consume it.

---

# Contract tests

## Static contract tests

Verify:

- forbidden imports,
- `server-only` placement,
- `"use server"` placement,
- DTO files do not import Prisma,
- domain files do not import framework/provider modules,
- transaction helpers accept `Prisma.TransactionClient`,
- actions do not import Prisma or provider SDKs.

## Runtime contract tests

Verify:

- fetchers return serializable DTOs,
- action errors have valid codes,
- mappers handle every enum value,
- workflow outputs contain valid invalidation plans,
- provider adapters normalize every supported response,
- unknown exceptions do not leak to clients.

## Integration contract tests

Verify:

- tenant scopes constrain database results,
- transaction conflicts roll back,
- RLS blocks cross-tenant access,
- webhook claims remain exclusive,
- provider retries remain idempotent.

---

# Contract evolution

Contracts may evolve additively when possible.

Safe:

```text
add optional DTO field
add new ActionResult success metadata
add new capability
add new page-state variant with exhaustive handling
```

Breaking:

```text
rename DTO field
change null to thrown error
change currency representation
return Prisma Date instead of ISO string
change role meaning
alter side-effect behavior under the same function name
```

Breaking contract changes require:

- explicit decision record,
- migration plan,
- caller inventory,
- tests updated before implementation,
- release note when externally observable.

---

# Golden layer contract checklist

```text
[ ] Input trust level is explicit
[ ] Input type is narrow and named
[ ] Runtime validation ownership is clear
[ ] Output cardinality is explicit
[ ] Output is stable and serializable where required
[ ] Side-effect class is known
[ ] Expected errors use stable codes
[ ] Unknown errors do not cross external boundaries
[ ] Persistence records do not leak above the data layer
[ ] Provider objects do not leak above integration adapters
[ ] Framework effects remain at framework boundaries
[ ] Import direction is mechanically enforced
[ ] Contract changes are classified as additive or breaking
```

## Compressed canonical model

```text
Layer contract =
  allowed input
  + guaranteed output
  + permitted side effects
  + stable errors
  + allowed dependencies
  + forbidden leakage
```

A folder becomes an architectural layer only when callers can rely on what crosses its boundary.
