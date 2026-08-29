# Security Model

## Trust boundaries

Untrusted: browser fields, route/search params, cookies until verified, webhook bytes until signature verification, provider-derived metadata until mapped and runtime-validated, environment strings until parsed, cached values beyond their freshness contract. Trusted values are created only by server authentication, approved validation, authoritative retrieval, and bounded application construction.

## Identity and authorization

Clerk proves identity. `lib/auth` maps it to an active local User/Actor. PostgreSQL owns memberships and roles. Roles aggregate capabilities; business code evaluates capabilities and record-aware policies, not raw role strings. Route gating improves UX but fetchers/workflows perform authoritative authorization. Inaccessible cross-tenant resources SHOULD resolve as not found where disclosure would leak existence.

## Tenant isolation and RLS

- Every tenant-owned row has an explicit tenant key.
- Every protected query/mutation scopes tenant and resource in SQL-producing predicates.
- Runtime uses a pooled restricted role that owns no protected table and lacks `BYPASSRLS`.
- RLS is enabled and forced on protected tables; policies cover each operation.
- Tenant context is transaction-local in one reviewed helper; all work uses its transaction client.
- Migration ownership is separate and direct.
- Tests use production-equivalent runtime credentials and actively attempt cross-tenant SELECT/INSERT/UPDATE/DELETE.

RLS contains accidents; application policy still decides intended access and returns useful errors.

## Input, output, and secrets

Zod validates untrusted runtime values. Database constraints enforce persisted invariants. Selects minimize retrieval; DTOs minimize exposure. Output encoding and semantic HTML prevent injection in their contexts. Secrets exist only in approved secret stores/environment; are never committed, logged, returned, copied into governance, or exposed through public prefixes. `.env.example` names variables without values. Secret and dependency scanning run before integration.

## Provider security

Provider clients are server-only and isolated. Tenant/customer/price/account/resource IDs and return URLs are server-derived or allowlisted. Money is integer minor units plus explicit currency. Mutations use stable logical idempotency keys. Stripe Billing and Connect are separate modules. Connect calls preserve connected-account scope. Provider responses are normalized rather than copied wholesale.

## Webhooks

Signature verification uses the raw body before parsing. Events are replayable, concurrent, and out of order. Receipt is durably unique; claim is atomic; terminal duplicates acknowledge safely; active leases do not double-process; expired/failed work retries under policy; finalization requires the current lock token. Important state is reconciled from current provider truth. Raw unrestricted payload retention is prohibited; bounded sanitized evidence is retained according to policy.

## Transactions, idempotency, and replay

Database constraints, optimistic versions, conditional updates, serializable isolation where justified, and bounded retry protect concurrency. Provider and database calls are separated by durable operation state. Audit/outbox records commit atomically with primary state. Duplicate requests/events return the original logical result or a safe terminal result without additional effects.

## Logging and observability restrictions

Logs include correlation IDs, safe internal IDs, operation, state transition, duration, attempt, and error class. They exclude authorization headers, cookies, tokens, secrets, full webhook payloads, card/bank/identity data, raw SQL with sensitive values, and unrestricted personal content. Security-relevant events are durable and tamper-evident under the product's audit policy.

## Required tests and scans

Policy matrices; disabled/suspended identity; direct cross-tenant DB attacks; runtime role privilege inspection; webhook signature/duplicate/lease/stale-worker/out-of-order tests; idempotent provider sandbox tests; dependency and secret scanning; CSP/security-header review; safe error leakage tests; environment validation; and manual review of money, auth, tenant, migration, and provider changes.

## Forbidden decisions without human approval

Weakening tenant/RLS/authentication controls; broad production data access; new payment movement or refund discretion; secret disclosure/rotation; destructive production migration; bypassing provider verification; changing legal/compliance retention; or introducing privileged administrative escape hatches.
