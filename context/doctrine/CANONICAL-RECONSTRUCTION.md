# Codependent Coding — Reconstructed Canon

This is a working canonicalization artifact derived from the surviving Codependent Coding corpus.

## Core architecture

Routes adapt framework concerns. Features orchestrate presentation/use-case composition. Components render. Fetchers own reads. Server Actions own the framework-facing mutation boundary. Workflows coordinate application mutations. Transactions preserve database invariants. Integrations own provider mechanics. Webhooks reconcile external events. Authentication identifies the caller; authorization determines permitted scope; PostgreSQL RLS provides independent tenant containment.

## Canonical request grammar

```text
Route
  -> Feature
     -> Fetcher (read)
     -> Server Action (mutation boundary)
        -> Workflow
           -> Policy/Authz
           -> Transaction / DB
           -> Integration
```

Protected reads:

```text
untrusted criteria
  -> runtime validation
  -> authenticated actor
  -> authorization / legal scope
  -> transaction-local tenant/RLS context
  -> bounded Prisma query
  -> explicit select
  -> DTO mapper
  -> application DTO
```

Protected mutations:

```text
untrusted input
  -> runtime validation
  -> authenticated actor
  -> Server Action
  -> Workflow
     -> authorization/resource policy
     -> workflow invariant
     -> transaction
     -> provider adapter (outside DB transaction)
  -> typed result
  -> framework invalidation/redirect at boundary
```

## Golden Fetcher

A Fetcher is a server-only read use case. It authenticates, authorizes, scopes, reads only what is needed, and returns an application DTO.

Canonical responsibilities:
- runtime validation when input crosses an untrusted boundary
- server-side actor resolution
- authorization-derived query scope
- tenant/RLS context
- bounded read
- explicit Prisma select
- DTO mapping

It does not mutate, call provider SDKs merely to assemble state, return Prisma models, perform navigation, or own framework cache effects.

Canonical shape:

```ts
import "server-only";

export async function getProjectDetail(input: unknown) {
  const parsed = inputSchema.parse(input);
  const actor = await requireActor();
  const scope = await requireProjectReadScope({
    actor,
    organizationId: parsed.organizationId,
  });

  const record = await withTenantRead(async (tx) =>
    tx.project.findFirst({
      where: {
        id: parsed.projectId,
        organizationId: scope.organizationId,
        ...(scope.kind === "owned"
          ? { ownerUserId: scope.ownerUserId }
          : {}),
      },
      select: projectDetailSelect,
    }),
  );

  return record ? mapProjectDetailDTO(record) : null;
}
```

The authorization scope belongs in the SQL-producing query. Do not fetch a broad record and authorize after retrieval.

## Authentication and authorization

Separate these decisions:

1. Authentication: who is calling?
2. Local identity: which application user is that identity?
3. Membership: which tenant may they operate in?
4. Capability: what class of operation may they perform?
5. Resource policy: may they operate on this resource?
6. Workflow invariant: is the transition currently legal?
7. Provider readiness: are external prerequisites satisfied?
8. RLS: can the database prevent accidental cross-tenant access?

Client-provided user IDs, tenant IDs, roles, or permissions never establish authority.

Clerk establishes external identity/session truth. The application database owns application identity, membership, roles, and product authorization.

RLS complements application authorization. It does not replace it.

## Golden Server Action

The Server Action is a thin framework adapter.

```ts
"use server";

export async function mutateThingAction(
  rawInput: unknown,
): Promise<ActionResult<ThingDTO>> {
  try {
    const input = inputSchema.parse(rawInput);
    const actor = await requireActor();
    const outcome = await mutateThing({ actor, input });

    applyInvalidation(outcome.invalidate);

    return { ok: true, data: outcome.data };
  } catch (error) {
    return mapActionError(error);
  }
}
```

It owns request adaptation, validation, actor establishment, workflow invocation, typed result/error mapping, and framework invalidation. It does not own Prisma, provider SDKs, transaction mechanics, or business workflow.

## Transaction boundary

Transactions own atomic database invariants. They receive trusted inputs, use the Prisma transaction client, establish transaction-local tenant context for protected operations, and do not perform network/provider calls.

Never perform provider network I/O inside the database transaction.

## Integration boundary

Provider adapters own provider-client mechanics, provider scope, request construction, response normalization, and stable idempotency keys. They do not own product authorization, presentation, or domain state transitions.

## Webhook boundary

Webhook processing is durable, verified, idempotent, and recoverable:

```text
verify raw event
 -> durable inbox
 -> atomic lease/claim
 -> reconcile
 -> idempotent state transition
 -> finalize processing token
 -> retry/recovery when required
```

Duplicate, concurrent, and out-of-order delivery must be safe.

## Golden lifecycle rule

Durable state transitions require explicit identity, tenant/global scope, truth source, states, legal transitions, guards, atomic writes, timestamps, and one authoritative workflow per transition. Recovery and concurrency behavior are part of the lifecycle contract, not optional implementation detail.

## Canonical documentation model

Use four levels:

1. Knowledge — what the concept is, why it exists, and how it relates to the system.
2. Contract — what must and must not be true.
3. Implementation — how to build it in the stack.
4. Golden Prototype — the canonical concrete code demonstrating the implementation.

These are complementary layers, not competing books.

## Canonical source rule

The current content corpus is not sufficient by itself. Older pattern references contain richer implementation evidence. Reconciliation should consolidate that evidence into the four levels above rather than preserving duplicated explanations.

A reference implementation demonstrates architecture; it does not automatically redefine generic doctrine. Product-specific implementations remain product-specific.

## Validation

Claims of correctness require evidence from the relevant executed gate. Static inspection is not runtime proof. Mocked tests do not prove real database/RLS/provider behavior. Critical tenant/RLS, authorization, provider-state, lifecycle, migration, and privileged-configuration properties require representative boundary tests.

