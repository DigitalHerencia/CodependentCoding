# Arrangement Layer Contracts

## Routes
Own URL and HTTP boundaries. Keep normal pages thin. Provider webhooks are route handlers under `app/api/{provider}/.../route.ts`.

## Features
Own application-capability orchestration. Normal features compose Blocks plus server/application helpers. Create `.client.tsx` companions only for browser behavior.

## PureUI Blocks
`components/blocks/` is pure reusable presentation. No Prisma, authz, provider SDK, workflow, persisted read/write, or React Hook Form ownership.

## UI primitives
`components/ui/` is the lowest-level presentation layer. Normal features do not import it directly. React Hook Form feature forms are the explicit exception.

## Fetchers
Every persisted application read. Read-only. Apply auth/authz/tenant scope when required, use precise selects, map to DTOs where appropriate.

## Actions
Ordinary persisted CRUD mutation boundary. Authenticate, authorize, validate, scope, write, invalidate cache. Call workflows/transactions when the mutation actually requires them.

## Workflows
Named reusable business/application logic constituted from existing server operations and helpers. Constituents retain their own responsibilities. Do not turn workflows into generic services.

## Transactions
Atomic database invariants only. No external/provider/network calls inside a DB transaction helper.

## Auth / Authz
Authentication establishes identity. Authorization decides access. Application tenancy/roles/policies remain application-owned unless repository-local adoption explicitly says otherwise.

## Integrations
Provider-specific mechanics live under `lib/integrations/{provider}` except the stronger responsibility mappings: Clerk → auth; Neon → db; Prisma → db + root prisma lifecycle.

## Webhooks
The HTTP route owns raw request/signature lifecycle, supported-event classification, reconciliation, idempotent persistence, and provider acknowledgement. Provider helpers and transaction helpers support it but are not themselves the webhook.
