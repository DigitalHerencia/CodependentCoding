# Arrangement Layer Contracts

## Routes
Own URL/request adaptation, metadata, HTTP/framework outcomes, and rendering of Features/presentation. Normal pages/layouts stay thin. They do not call Fetchers, Actions, Workflows, Prisma, or provider SDKs directly. Provider webhooks remain route handlers under `app/api/{provider}/.../route.ts`.

## Features
Own user-facing use-case orchestration. Features may compose Fetchers, action references, PureUI Blocks, and compatible UI Primitives. They do not own Prisma, provider SDK mechanics, product authorization, or Workflows directly.

## PureUI Blocks
`components/blocks/` is reusable presentation. Blocks may compose UI Primitives, variants, semantic tokens, presentation-safe props, and supplied callbacks/actions. They do not own protected I/O, authz, Prisma, provider SDKs, Workflows, transactions, or domain calculations.

## UI primitives
`components/ui/` is the lowest reusable domain-agnostic presentation layer. Primitives may be composed by Blocks or Features where the Feature contract calls for them; importing a Primitive does not transfer business authority into presentation.

## Fetchers
Server-only protected read boundaries. Parse criteria, resolve trusted actor/scope, apply auth/authz and tenant/RLS context, read through explicit selects, and map transport-safe DTOs. No writes, provider calls, or framework navigation/cache effects.

## Actions
Thin mutation transport adapters under `lib/actions/<domain>/`. Validate input, resolve identity/actor, call a Workflow, map the result, and apply success-only cache/navigation adapters. No Prisma, provider SDK, integration mechanics, or transaction implementation.

## Workflows
Named application use cases. Workflows coordinate authz/policy, approved DB helpers/transactions, integrations, lifecycle/readiness, idempotency/recovery, and framework-neutral results. No React, Next navigation/cache, raw HTTP/signature handling, or provider SDK mechanics directly.

## Transactions
Atomic database invariants only. Establish required tenant/RLS context and concurrency predicates. No external/provider/network calls or framework effects inside a DB transaction helper.

## Auth / Authz
Authentication establishes identity and adapts it to a local Actor. Authorization decides membership/capabilities/resource scope/policy. RLS contains rows but does not replace product authorization.

## Integrations
Provider-specific mechanics live under `lib/integrations/{provider}` except stronger responsibility mappings such as Clerk identity adaptation under auth and Prisma/Neon persistence under db. Integrations do not own product authorization or presentation.

## Webhooks
The HTTP route owns raw request/signature lifecycle. Durable receipt/claim/finalize, reconciliation, and idempotent local settlement live behind the webhook/application boundary with integration and transaction helpers supporting their own responsibilities.
