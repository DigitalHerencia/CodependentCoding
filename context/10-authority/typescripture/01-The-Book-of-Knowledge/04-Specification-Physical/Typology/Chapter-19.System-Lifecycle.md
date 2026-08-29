---
title: Codependent Coding System-Lifecycle Specification
type: contract
scope: domain
project: CodependentCoding
domain: lifecycles
artifact: system-lifecycles
kind: contract
namespace: codependentcoding.docs.system-lifecycles.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.layer-contracts.contract]]"
  - "[[codependentcoding.patterns.system-lifecycle.reference]]"
supersedes: []
tags:
  - codependentcoding/lifecycles
  - codependentcoding/contracts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/13-system-lifecycles.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 8aab35dfc3f55c0f21f91439a9363351b24b97e8
source_format: markdown
---
# System-Lifecycle Specification

## Purpose and lifecycle contract

A lifecycle defines how a stateful entity, operation, request, delivery, or engineering process enters the system, crosses trust/authority boundaries, changes or advances, fails, retries, completes, and leaves durable evidence.

A status enum, table row, route flow, or switch statement is not sufficient by itself. Every required lifecycle in this document uses the same runtime lifecycle contract:

1. Purpose / identity
2. Entry conditions
3. Actors / triggers
4. Trust / authorization
5. Canonical owners
6. Ordered stages
7. Invariants
8. Transaction behavior
9. Failure behavior
10. Retry / recovery
11. Concurrency / idempotency
12. Outputs / completion
13. Observability
14. Validation / conformance evidence
15. Source traceability

For durable state transitions, the stricter Golden Lifecycle grammar also requires identity, tenant ownership or explicit global scope, truth source, initial/active/recoverable/terminal states, named legal transitions, guards, atomic writes, dedicated timestamps, and one authoritative workflow per transition.

## Global lifecycle invariants

- One layer owns each decision or side effect. Routes adapt; Features orchestrate; Components render; Fetchers read; Server Actions adapt mutations; Workflows coordinate use cases; Authorization decides; Transactions preserve atomic database facts; Integration Adapters own provider mechanics; Webhooks reconcile external truth.
- Browser input, route parameters, form values, tenant/resource IDs, provider-derived fields, webhook payloads, and cached state are not authority merely because they are typed.
- Clerk owns authentication identity/session truth. The application database owns local User, Membership, authorization relationships, workflow state, and normalized product state. Stripe owns provider payment/account truth. Verified webhook/retrieval flows reconcile provider truth into bounded local mirrors and legal product transitions.
- Tenant-scoped database work uses the canonical transaction-local tenant context and restricted runtime role. RLS contains rows but does not replace product authorization.
- Provider/network operations do not execute inside database transactions.
- Expected state/version, unique constraints, idempotency keys, leases, and conditional writes reject stale or competing operations where applicable.
- Audit/outbox records that describe a committed state change commit with that change when atomicity requires it.
- Provider state and domain state use separate vocabularies. Redirects, browser timers, and provider delivery order never create product truth.
- Expected, failed, skipped, blocked, inferred, and executed-pass evidence remain distinct.

---

## RL-01 — Server-rendered page

**Purpose / identity.** Convert one Next.js page request into a safe page resolution and React Server Component response without turning the route or Feature into a persistence layer.

**Entry conditions.** A request reaches a page route with route parameters and optional search parameters. Those values are untrusted transport input. Public pages may not require a user actor; protected page data still enters through self-securing Fetchers.

**Actors / triggers.** Browser/navigation request, framework router, and any deliberate server-side navigation that resolves the route.

**Trust / authorization.** Route/search values are runtime-validated before product use. Layout/route gating may improve UX but is not authoritative authorization. Protected Fetchers resolve the current Actor and legal tenant/resource scope themselves.

**Canonical owners.** `app/` owns URL/params/search/metadata/redirect/not-found/framework boundaries. The Feature loader/orchestrator owns page-state composition. Fetchers own protected reads. Components own rendering.

**Ordered stages.** `request → resolve params/search → validate route context → invoke Feature loader/entrypoint → execute required Fetchers (parallel only when independent) → resolve render/not-found/redirect/blocked/empty state → compose Feature and Components → stream through Suspense where appropriate → return response`.

**Invariants.** Routes and Features do not import Prisma or provider SDKs. Components receive DTO/page state rather than unrestricted persistence/provider objects. A read that establishes legal/logical preconditions completes before dependent reads begin.

**Transaction behavior.** The route/Feature does not open business transactions. Any tenant-scoped database read uses the Fetcher's approved database/RLS mechanism.

**Failure behavior.** Expected not-found, redirect, empty, blocked, and onboarding outcomes remain explicit page resolutions. Unexpected failures reach the route error boundary with safe user messaging and internal correlation evidence.

**Retry / recovery.** Repeating a read-only page request is safe. A retry re-resolves current server truth rather than replaying stale page state.

**Concurrency / idempotency.** Independent reads may execute concurrently. No write authority is derived from the rendered page. Concurrent navigation cannot bypass server authorization.

**Outputs / completion.** Completion is one React response, redirect, not-found, or other intentional framework outcome derived from current authorized page state.

**Observability.** Request/correlation ID where available, route identity, page-resolution kind, unexpected error class, and timing for materially expensive loaders/read groups. Secrets and unrestricted DTO contents are not logged.

**Validation / conformance evidence.** Route/Feature import-boundary checks; route-schema tests; Fetcher tests for protected data; page-state unit tests where used; TypeScript/build validation; Playwright for critical page outcomes and Suspense/loading behavior.

**Source traceability.** `hipsterstack.patterns.route-feature-orchestration.reference.md` (canonical route/loader/Feature ownership and page resolution); `hipsterstack.patterns.fetcher.reference.md` (self-securing reads); `hipsterstack.patterns.layer-contract.reference.md` (trust/output/import contract); `How-I-Build-Opinionated-SaaS-Applications.txt` (thin routes and Feature orchestration).

---

## RL-02 — Authenticated request

**Purpose / identity.** Convert an external Clerk-authenticated request into trusted local application identity and, when required, scoped membership/capability context without confusing authentication with authorization.

**Entry conditions.** A protected server boundary requires a user Actor. A Clerk session may or may not exist; the local application User and Membership may also be absent, inactive, suspended, or revoked.

**Actors / triggers.** User request requiring authentication; `requireActor()`-style auth boundary; downstream Fetcher or Server Action/Workflow requiring user identity.

**Trust / authorization.** Clerk proves external identity/session. Local User lookup establishes application identity/status. Membership establishes tenant participation. Capability/resource/workflow policies establish operation legality. Clerk metadata never becomes canonical role, tenant, entitlement, or workflow state.

**Canonical owners.** `lib/auth/` owns Clerk session adaptation and local Actor resolution. `lib/authz/` owns Membership, role/capability, scopes, and resource policies. Workflows own current resource/workflow legality.

**Ordered stages.** `protected boundary → resolve Clerk session → require authenticated identity → load matching local User → require allowed account state → construct user Actor → when tenant-scoped, load active Membership → derive capabilities/legal scope → evaluate resource/workflow policy at authoritative use-case boundary`.

**Invariants.** User IDs or roles supplied by the browser are never trusted. A global User role does not substitute for Membership scope. System/webhook actors use explicit system identity and never masquerade as users.

**Transaction behavior.** Authentication itself does not create product state. Tenant-scoped reads/writes subsequently use the canonical RLS context where protected tenant tables are involved. Opportunistic user creation during normal authenticated reads is prohibited.

**Failure behavior.** Missing/invalid session or inactive local account yields `UNAUTHENTICATED`. Inaccessible tenant/resource may deliberately produce `NOT_FOUND` to avoid existence disclosure. Missing capabilities/policy yields `FORBIDDEN` or the canonical safe equivalent.

**Retry / recovery.** A later request may succeed after identity synchronization, membership activation, or account-state correction. The request does not locally fabricate missing provider or membership state.

**Concurrency / idempotency.** Each request resolves current local account/membership facts. Concurrent membership revocation must not be bypassed by client state or stale role metadata.

**Outputs / completion.** Trusted `Actor` and, where required, `MembershipContext`/authorized scope suitable for the protected operation, or a stable safe application error.

**Observability.** Request ID, local actor ID when resolved, organization ID when authorized, denial class, and policy name. Session tokens, Clerk secrets, and raw identity payloads are never logged.

**Validation / conformance evidence.** Authentication adapter tests; inactive/suspended account cases; policy/capability matrix tests; tenant membership denial tests; architecture checks preventing Clerk server APIs outside the auth boundary; real RLS tests for tenant containment where applicable.

**Source traceability.** `hipsterstack.patterns.auth-authz-boundary.reference.md` (authentication/local identity/membership/capability/resource policy); `hipsterstack.patterns.fetcher.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` (Clerk owns identity, Prisma owns application identity, layered RBAC); `vouch.complete-system-documentation.md` §§0.2–0.5 as implementation evidence.

---

## RL-03 — Tenant read

**Purpose / identity.** Execute one protected tenant/resource read through an authorized database scope and return the minimum serializable DTO required by the caller.

**Entry conditions.** A Fetcher receives untrusted read criteria such as Organization ID, resource ID, filters, search text, cursor, or limit.

**Actors / triggers.** React Server Component/Feature loader or another approved server caller invokes a Fetcher for the current request.

**Trust / authorization.** Runtime schema validates input. The Fetcher resolves the Actor and derives the maximum legal read scope through authz. IDs identify candidate records only; they do not prove Membership or ownership.

**Canonical owners.** Fetcher owns the secure read use case. `lib/auth/` and `lib/authz/` own Actor/scope. `lib/db/selects/` owns explicit projection. Approved data-layer query/RLS helper owns DB access. `lib/db/dto/` owns mapping.

**Ordered stages.** `raw read input → runtime parse → Actor → Membership/capability-derived read scope → begin approved tenant/RLS database scope → query only inside authorized tenant/resource predicate → explicit select → DTO mapper → serializable DTO/null/bounded list → caller`.

**Invariants.** Query scope contains tenant/ownership authorization before retrieval. No broad fetch-then-authorize pattern. No writes, provider mutation, redirects, or framework invalidation. Lists are bounded/paginated. Prisma records and `Date`/Decimal/BigInt/provider objects do not leak across transport/presentation boundaries.

**Transaction behavior.** Protected tenant reads use the canonical transaction-scoped Prisma client when RLS context is required; tenant context is set transaction-locally under the restricted runtime role. The Fetcher remains read-only.

**Failure behavior.** Invalid input fails validation. Missing/inaccessible singular resource follows the defined `null`/typed-not-found contract without cross-tenant disclosure. Database/infrastructure failures are logged and surfaced through safe application/framework handling.

**Retry / recovery.** Read retries are safe when the caller's retry policy allows them. A retry re-evaluates authentication, authorization, tenant scope, and current persistence state.

**Concurrency / idempotency.** Reads do not create authoritative state. Cache/memoization never broadens tenant scope and never replaces freshness requirements for authorization/payment/security-sensitive state.

**Outputs / completion.** Deliberate cardinality: one DTO or `null`, a bounded list DTO with page information, or a typed application error as specified by the Fetcher contract.

**Observability.** Fetcher/use-case name, request ID, tenant/resource identifiers where safe, duration, pagination characteristics, and error classification. Do not log unrestricted selected records.

**Validation / conformance evidence.** Fetcher unit/integration tests; select/DTO compile-time checks; pagination limits; real cross-tenant database attack tests under runtime credentials; RLS privilege checks; architecture rule proving protected reads enter through Fetchers.

**Source traceability.** `hipsterstack.patterns.fetcher.reference.md`; `hipsterstack.patterns.auth-authz-boundary.reference.md`; `hipsterstack.patterns.transaction-helper.reference.md` for transaction-local DB invariants; `hipsterstack.patterns.layer-contract.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` Fetcher/RLS sections.

---

## RL-04 — Tenant mutation

**Purpose / identity.** Execute one authenticated tenant-scoped state change through a thin transport adapter and authoritative Workflow while preserving resource policy, lifecycle, transaction, provider, audit, and recovery invariants.

**Entry conditions.** An approved Server Action or Route Handler receives untrusted mutation input for a named operation. Browser-provided tenant/resource/provider identifiers remain identifiers only.

**Actors / triggers.** Authenticated user intent through Server Action or explicitly approved HTTP mutation adapter. System-triggered transitions use their own dedicated system lifecycle rather than pretending to be a browser user.

**Trust / authorization.** Transport input is normalized and runtime-validated. Actor is resolved server-side. Workflow loads current resource facts, verifies Membership/capability/resource policy, checks workflow/lifecycle invariants and provider readiness, and derives sensitive provider IDs/price/customer/URLs server-side.

**Canonical owners.** Server Action/Route Handler owns transport adaptation. Workflow owns use-case sequence. Authz/policy owns legality. Transaction Helper owns atomic DB facts. Integration Adapter owns provider mechanics. Action/route owns framework invalidation/redirect.

**Ordered stages.** `untrusted mutation intent → transport normalization → Zod/runtime schema → Actor → invoke one named Workflow → load current authorized facts → policy + lifecycle/readiness guards → prepare/commit atomic local intent as required → provider call outside DB transaction when required → persist/reconcile provider result → audit/outbox/recovery → return DTO + logical invalidation plan → framework applies invalidation/redirect/result`.

**Invariants.** Client tenant/user/role/capability/price/customer/connected-account/return-URL values never establish authority. Provider/database operations use stable idempotency/recovery design. No provider/network call remains inside a database transaction. A success redirect never grants entitlement/payment truth.

**Transaction behavior.** Each atomic DB unit is short, receives validated trusted input plus a transaction client, uses expected state/version/constraints where needed, and commits audit/outbox facts that must be atomic. Cross-system consistency uses local operation state rather than distributed ACID fiction.

**Failure behavior.** Validation, unauthenticated, forbidden/not-found, conflict, readiness, and provider failures map to stable application/action result codes. Unknown exceptions are logged with cause and hidden behind a generic safe result. A provider-success/local-persist failure remains recoverable rather than silently successful.

**Retry / recovery.** Stable logical idempotency keys, operation records, provider retrieval, webhooks, and reconciliation make repeated requests safe where required. Failed/stale operation state follows explicit retry/recovery policy.

**Concurrency / idempotency.** Optimistic version predicates, unique constraints, serializable transactions where justified, and provider idempotency keys reject duplicate/competing state changes. Double submission does not create duplicate business effects.

**Outputs / completion.** Completion means authoritative local state is committed (and provider coordination has reached the use case's defined recoverable/completed phase), audit/recovery evidence exists as required, and the adapter returns a typed DTO/result or performs a framework outcome after success.

**Observability.** Operation/use-case name, request ID, actor/tenant/resource IDs, prior/next state where safe, idempotency/attempt identity, provider object IDs only when approved, duration, and classified failure/recovery state.

**Validation / conformance evidence.** Server Action transport tests; Workflow authorization/invariant tests; transaction integration/concurrency tests; provider adapter contract tests; idempotency/failure-injection tests; RLS containment; E2E for critical mutation outcome; architecture checks for layer imports.

**Source traceability.** `hipsterstack.patterns.server-action.reference.md`; `hipsterstack.patterns.application-workflow.reference.md`; `hipsterstack.patterns.transaction-helper.reference.md`; `hipsterstack.patterns.auth-authz-boundary.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` mutation/workflow/transaction sections.

---

## RL-05 — Form submission

**Purpose / identity.** Carry browser form intent through React interaction and a Server Action without allowing client form state, browser validation, hidden fields, or optimistic UI to become business authority.

**Entry conditions.** A rendered form accepts user input. The form may use React Hook Form for interaction/client validation and may submit `FormData` or a typed object to an approved Server Action.

**Actors / triggers.** User submits, activates a submit control, or triggers an explicitly equivalent accessible browser action. The browser/Client Component owns only interaction state.

**Trust / authorization.** Browser/form values are untrusted even when client validation passed. The Server Action normalizes values, runtime-validates them again, resolves Actor server-side, and invokes the authoritative Workflow. Hidden tenant/user/role/provider fields never prove authority.

**Canonical owners.** Client form/React Hook Form owns field state, accessible errors, pending state, and browser interaction. Server Action owns transport normalization/validation and framework result. Workflow and downstream layers own mutation legality and side effects.

**Ordered stages.** `render safe DTO/defaults → user edits fields → optional client validation → submit/pending UI → FormData/raw values cross server boundary → Server Action normalizes → runtime schema → Actor → Tenant mutation Workflow → typed outcome → successful cache invalidation/optional redirect OR stable field/form error → UI renders result`.

**Invariants.** Client validation is advisory. Server validation is authoritative. Disabled/hidden controls and action visibility are UX, not authorization. A broad `try/catch` does not swallow Next.js redirect control flow. Pending UI reduces duplicate clicks but does not replace server idempotency.

**Transaction behavior.** The form and Client Component open no DB transaction. The Server Action opens no transaction directly unless the canonical action contract explicitly delegates through a Workflow/transaction boundary; transaction mechanics remain downstream.

**Failure behavior.** Validation returns field/form errors; authentication/authorization/conflict/provider failures return stable safe codes/messages; unexpected errors are logged and hidden. UI preserves usable input state where appropriate and does not display raw database/provider errors.

**Retry / recovery.** User correction and resubmission are supported. Network/interruption retry is safe only because the server operation owns idempotency/concurrency. Provider/database partial states recover through the underlying Workflow, not client reconstruction.

**Concurrency / idempotency.** Double-clicks, multiple tabs, stale form versions, and repeated network submission cannot create duplicate or stale transitions; server-side expected-version/idempotency policy decides the result.

**Outputs / completion.** A typed `ActionResult`, safe redirect after successful mutation, or updated server-rendered state. Form completion never independently means workflow/provider completion.

**Observability.** Action/use-case name, request/correlation ID, validation failure class, operation outcome, and duration. Passwords, secrets, full FormData, payment data, or sensitive identity data are not logged.

**Validation / conformance evidence.** Action tests for invalid input/known errors/unknown errors/invalidation; form interaction tests; accessibility/keyboard tests; Playwright duplicate/stale submission cases for consequential forms; Workflow/transaction tests for authority and idempotency.

**Source traceability.** `hipsterstack.patterns.server-action.reference.md` (FormData adapter and ActionResult); `hipsterstack.patterns.route-feature-orchestration.reference.md` (client islands and action references); `How-I-Build-Opinionated-SaaS-Applications.txt` (React Hook Form, Server Action and Workflow separation); `hipsterstack.patterns.layer-contract.reference.md`.

---

## RL-06 — Application workflow

**Purpose / identity.** Execute one named application use case by sequencing trusted Actor/validated command, current resource facts, authorization, lifecycle/readiness rules, atomic persistence, optional provider operations, recovery, audit/outbox, and a framework-neutral result.

**Entry conditions.** Transport input has passed runtime normalization/validation and the caller supplies a trusted Actor. IDs remain identifiers; the Workflow has not yet assumed resource ownership or legal state.

**Actors / triggers.** User Actor from Server Action/approved HTTP adapter or a narrowly authorized system Actor from webhook/job entrypoint.

**Trust / authorization.** Workflow loads the actual resource facts required by policy, verifies tenant/membership/capability/resource access, enforces domain/lifecycle guards, and checks provider/operational readiness. It never trusts browser-supplied authority or provider state that has not been verified/normalized.

**Canonical owners.** One Workflow owns one use case/authoritative transition. Authz/domain policy owns decisions; DB query/command/transaction modules own persistence mechanics; Integration Adapter owns provider syntax; Workflow owns sequence and recovery semantics.

**Ordered stages.** `trusted Actor + validated command → load authorized current facts → authorize operation → enforce lifecycle/domain/readiness invariants → create/reuse local operation intent when cross-system → commit atomic pre-provider state → perform provider operation with stable idempotency outside DB tx → persist/attach normalized provider result → audit/outbox/recovery bookkeeping → return DTO + logical invalidation plan`.

**Invariants.** One named use case per Workflow. No JSX, `FormData`, redirect, `next/cache`, raw HTTP response, signature verification, or provider SDK syntax. No long/open transaction around network. Provider IDs/URLs are server-derived or validated/allowlisted according to integration contract.

**Transaction behavior.** Workflow may invoke multiple short atomic DB transactions/commands separated by provider calls. Each transaction preserves its own invariant. Local operation state represents recoverable cross-system phases.

**Failure behavior.** Expected domain/auth/readiness/conflict/provider failures become stable `ApplicationError` semantics. Unknown failures preserve internal cause for logs while exposing safe boundary messages. Provider success followed by local failure is recorded/recoverable.

**Retry / recovery.** Reuse stable logical operation/idempotency identity. Reconcile provider truth after ambiguous outcomes. Retry only operations/errors defined safe. Stale recovery may be performed by webhook/reconciliation/job under explicit policy.

**Concurrency / idempotency.** Expected version/state, unique operation identities, serializable transactions where justified, and provider idempotency prevent duplicate/competing transitions.

**Outputs / completion.** Framework-neutral `MutationOutcome<DTO>` or equivalent application result with logical invalidation intent and explicit recoverable/completed state. Completion is the use case's defined authoritative state, not merely provider request return.

**Observability.** Use-case name, Actor/system identity, tenant/resource/operation IDs, version/state transition, provider operation identity where safe, attempt/recovery status, duration, and error classification.

**Validation / conformance evidence.** Workflow unit/integration tests for policy/invariant sequence; provider failure injection; duplicate/retry cases; transaction rollback/concurrency; no-framework/provider-SDK import rules; lifecycle transition matrix.

**Source traceability.** `hipsterstack.patterns.application-workflow.reference.md`; `hipsterstack.patterns.system-lifecycle.reference.md`; `hipsterstack.patterns.layer-contract.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` Workflow sections.

---

## RL-07 — Database transaction

**Purpose / identity.** Preserve one atomic PostgreSQL fact so all required reads/writes/audit/outbox changes commit or roll back together under correct tenant context and concurrency semantics.

**Entry conditions.** A Workflow has validated trusted mutation data and invokes the shared transaction runner with a Transaction Helper accepting `Prisma.TransactionClient`.

**Actors / triggers.** Workflow/system reconciliation operation; never a direct Component/Route/Feature caller.

**Trust / authorization.** Product authorization is already established or rechecked at the appropriate Workflow/policy boundary. The transaction still asserts tenant key, expected state/version, uniqueness, and database-adjacent invariants. RLS uses trusted transaction-local tenant context.

**Canonical owners.** Shared transaction runner owns isolation/retry mechanics and tenant context. Transaction Helper owns one atomic persisted invariant. Prisma/PostgreSQL own constraints/RLS. Workflow owns broader use-case sequence.

**Ordered stages.** `begin approved transaction/isolation → set transaction-local tenant/user context where required → read only rows needed for mutation → assert DB-adjacent expected state/version/constraint preconditions → conditional writes → required audit/outbox writes → return minimal persistence result → commit`.

**Invariants.** Helper accepts TransactionClient only. No Clerk, React, Next navigation/cache, provider SDK, email, or network. Runtime DB role owns no protected table and lacks BYPASSRLS. Protected tenant operations stay on the transaction-scoped client after context is set.

**Transaction behavior.** This lifecycle is the transaction boundary. Serializable isolation and bounded P2034-style retry are used where concurrency correctness requires them; arbitrary exceptions are never blindly retried.

**Failure behavior.** Any required write/constraint/invariant failure rolls back the entire atomic unit. Conditional write count mismatch becomes a typed conflict. Database failures preserve internal cause without leaking SQL/provider secrets.

**Retry / recovery.** Only known retry-safe serialization conflicts retry within the bounded runner. Exhaustion propagates. Cross-system provider failures are not retried inside the transaction because provider calls are outside it.

**Concurrency / idempotency.** Unique constraints, expected-version/state predicates, locks where justified, serializable isolation, and RLS enforce concurrent correctness. Exactly one winner is expected for contested unique/capacity/state transitions.

**Outputs / completion.** Minimal selected persistence result after successful commit, or a typed/application error after rollback. A returned value from a failed/rolled-back transaction never becomes authoritative.

**Observability.** Transaction/use-case identity, attempt number, retry classification, tenant/resource IDs where safe, isolation level, duration, and final commit/rollback outcome. SQL secrets/row payloads are bounded.

**Validation / conformance evidence.** Real PostgreSQL integration tests for rollback, constraints, stale version, concurrent contenders, serialization retry/exhaustion, tenant A→B attack under runtime role, runtime privilege/BYPASSRLS assertions.

**Source traceability.** `hipsterstack.patterns.transaction-helper.reference.md`; `hipsterstack.patterns.auth-authz-boundary.reference.md` RLS relationship; `hipsterstack.patterns.system-lifecycle.reference.md` conditional transitions/concurrency; `How-I-Build-Opinionated-SaaS-Applications.txt` transaction/RLS sections.

---

## RL-08 — Clerk webhook

**Purpose / identity.** Verify replayable Clerk events and idempotently reconcile external identity changes into bounded local User/application identity state without browser-session assumptions.

**Entry conditions.** Clerk sends an HTTP webhook request with raw body/signature data to the configured canonical webhook route.

**Actors / triggers.** Clerk delivery; after signature verification the application creates a narrow `system: clerk-webhook` Actor/request context.

**Trust / authorization.** Raw request is untrusted until signature verification over the correct raw body. Provider event type/derived fields are runtime-validated before domain use. System Actor authorization is explicit and narrow; it receives no user Membership capabilities.

**Canonical owners.** Route Handler owns raw request/signature/HTTP acknowledgement. Clerk integration adapter owns provider verification/mapping mechanics. Durable Event Ledger owns receipt/lease/retry state. Clerk webhook processor/identity reconciliation Workflow owns local synchronization. Transaction Helper owns atomic User/mirror/audit updates.

**Ordered stages.** `raw request → require/verify signature → parse verified event → record/reuse unique Event Ledger receipt → atomically claim lease → classify supported identity event → retrieve/normalize provider truth when required → runtime-validate normalized fields → transactionally reconcile local User/identity mirror + audit/outbox → finalize ledger with current lock token → acknowledge provider`.

**Invariants.** `(provider, providerEventId)` uniqueness prevents duplicate receipt identity. Existing ledger row does not prove completion. Finalization requires current lease token. Raw provider payload/secrets are not stored unrestricted. Normal authenticated reads do not opportunistically create Users.

**Transaction behavior.** Receipt/lease claim and local reconciliation use short DB transactions. Provider retrieval, if required, occurs outside DB transaction. Required local identity/audit changes commit atomically.

**Failure behavior.** Invalid signature receives provider-compatible client error. Supported-event processing failure records bounded sanitized failed state and returns retry-inducing HTTP status when policy requires. Unsupported events may finalize `ignored` safely.

**Retry / recovery.** Terminal processed/ignored duplicates acknowledge without reapplying state. Failed records and processing records with expired leases may be reclaimed according to explicit next-attempt/lease policy. Reconciliation uses current provider truth where event order may be stale.

**Concurrency / idempotency.** Atomic unique receipt plus conditional lease claim permits one active processor. Stale workers cannot finalize after lease loss. Repeated/parallel event delivery cannot duplicate local mutations.

**Outputs / completion.** HTTP acknowledgement plus ledger terminal state `processed` or `ignored`; or a failed/recoverable state that correctly causes/permits provider retry. Local User state reflects the legal normalized identity transition.

**Observability.** request ID, provider event ID/type, ledger ID/status/attempt, lease expiry, local User ID where safe, processing duration, sanitized failure code/message. Raw secrets/payloads are excluded.

**Validation / conformance evidence.** Signature tests; unsupported-event tests; duplicate delivery; concurrent claim; expired lease reclaim; stale lock finalization failure; invalid provider-derived fields; local User sync/rollback; no browser session dependency; bounded failure-metadata tests.

**Source traceability.** `hipsterstack.patterns.webhook-processor.reference.md` generic durable processor; `hipsterstack.patterns.auth-authz-boundary.reference.md` system Actors; `How-I-Build-Opinionated-SaaS-Applications.txt` Clerk/local User synchronization; `vouch.complete-system-documentation.md` Clerk webhook evidence as implementation reference.

---

## RL-09 — Stripe webhook

**Purpose / identity.** Verify replayable Stripe events and idempotently reconcile current provider payment/subscription/connected-account truth into provider mirrors and permitted local product transitions.

**Entry conditions.** Stripe sends an HTTP webhook request containing raw body and `stripe-signature`; Connect events may additionally carry connected-account scope.

**Actors / triggers.** Stripe delivery; after successful signature verification the application creates a narrow `system: stripe-webhook` Actor/request context.

**Trust / authorization.** Raw request is untrusted until signature verification using raw body. Event-derived amount/currency/status/IDs/account scope are runtime-validated. Important state reconciles against current provider object when delivery order is not sufficient. Connected-account retrieval preserves event account scope.

**Canonical owners.** Route Handler owns HTTP/signature adaptation. Stripe integration adapters own SDK/signature/retrieval/provider normalization. Event Ledger owns receipt/lease. Stripe webhook processor dispatches event families. Reconciliation Workflow/policy owns legal product transition. Transaction Helper owns mirror/domain/audit/outbox atomic writes.

**Ordered stages.** `raw body + signature → verify → parse event → durable unique receipt → atomic lease claim → classify event family → preserve connected-account scope → retrieve current provider truth when required → normalize + runtime validate money/status/IDs → transactionally upsert mirror and apply only legal product transition + audit/outbox → token-bound finalize → acknowledge`.

**Invariants.** Events are at-least-once, duplicated, concurrent, and out of order. Provider event order is never product transition authority. Provider state and domain state remain distinct. Money is explicit amount/currency. Checkout success page grants no entitlement/payment authority.

**Transaction behavior.** Receipt/lease and local reconcile writes use short transactions. Stripe API retrieval/mutation is never inside DB transaction. Mirror/domain/audit/outbox changes that must agree commit atomically.

**Failure behavior.** Invalid signature fails before receipt/mutation. Unsupported event may be `ignored`. Processing failure records bounded sanitized failure and preserves retry/recovery. Local/provider divergence never silently marks success.

**Retry / recovery.** Terminal duplicates acknowledge safely. Failed/expired processing may be reclaimed. Current provider retrieval and stable object/event identifiers allow convergence after out-of-order or ambiguous delivery.

**Concurrency / idempotency.** Unique `(provider,eventId)`, conditional lease with token/expiry, provider object uniqueness, transition expected-state/version, and idempotent reconciliation prevent duplicate or stale application effects.

**Outputs / completion.** Provider-compatible HTTP acknowledgement plus terminal/recoverable Event Ledger result. Local provider mirror reflects verified Stripe truth; domain state changes only through explicit legal reconciliation.

**Observability.** request/event/ledger IDs, event type, connected account ID where approved, provider object ID, attempt/lease status, from/to local state where safe, duration, bounded failure details.

**Validation / conformance evidence.** Signature/raw-body tests; duplicate/concurrent/out-of-order event tests; lease claim/finalization; Connect account-scope tests; amount/currency mismatch; provider retrieval reconciliation; illegal transition rejection; crash/failure recovery; audit/outbox atomicity.

**Source traceability.** `hipsterstack.patterns.webhook-processor.reference.md`; `hipsterstack.patterns.application-workflow.reference.md` provider/database recovery; `hipsterstack.patterns.system-lifecycle.reference.md` delivery/recovery grammar; `How-I-Build-Opinionated-SaaS-Applications.txt` webhook/provider truth; `vouch.complete-system-documentation.md` Stripe webhook evidence as implementation reference.

---

## RL-10 — Cache invalidation

**Purpose / identity.** Make a successful authoritative mutation visible to subsequent reads by translating framework-neutral invalidation intent into exact Next.js cache effects after authoritative state has committed.

**Entry conditions.** A Workflow has completed its authoritative mutation phase and returned a logical invalidation plan containing approved resource/tenant tags and/or paths.

**Actors / triggers.** Successful Server Action/approved framework adapter after Workflow outcome; never client-selected arbitrary tags/paths.

**Trust / authorization.** Invalidation intent is server-created from authorized resource facts. The browser cannot choose tenant/resource cache keys. Cache contents never authorize operations.

**Canonical owners.** Workflow owns logical invalidation intent. Framework cache adapter/Server Action owns `updateTag`/`revalidatePath` or current approved Next.js effects. Fetchers/read boundaries own cache/freshness policy.

**Ordered stages.** `authoritative mutation commits → Workflow returns DTO + invalidation plan → Server Action verifies successful outcome → apply exact tags/paths → next read misses/revalidates → Fetcher re-evaluates current auth/scope/data → refreshed presentation`.

**Invariants.** No invalidation before failed/rolled-back mutation. Invalidate the smallest affected scope. Cached tenant/security/payment/readiness state cannot outlive the freshness guarantees required by its owner. Cache is never source of truth.

**Transaction behavior.** Framework invalidation is outside the database transaction and does not roll back committed domain state. Workflow must not import `next/cache`.

**Failure behavior.** Invalidation failure is classified separately from domain mutation result. The committed mutation is not falsely rolled back in documentation. Consequential stale-cache risk is logged and, where required by product policy, queued/retried or mitigated with uncached reads.

**Retry / recovery.** Reapplying the same tag/path invalidation is safe. Recovery policy depends on cache criticality; authorization/payment decisions must already be protected by fresh authoritative server checks.

**Concurrency / idempotency.** Multiple overlapping invalidations are safe and must not broaden tenant scope. Concurrent writes may invalidate the same resource/collection independently.

**Outputs / completion.** Completion means the framework accepted the required invalidation effects and subsequent reads follow the declared freshness policy; the domain mutation completion remains independent.

**Observability.** Operation/resource/tenant invalidation identifiers, applied tag/path counts, cache adapter failure, and correlation with the mutation request where useful.

**Validation / conformance evidence.** Server Action tests prove invalidation only after success; cache-key tenant-scope tests; freshness tests for sensitive reads; architecture rule forbidding framework cache imports from Workflows; browser/read-after-write tests where consequential.

**Source traceability.** `hipsterstack.patterns.server-action.reference.md` cache invalidation plan/application; `hipsterstack.patterns.application-workflow.reference.md` framework-neutral outcome; `hipsterstack.engineering-system.definition.source-document(1).md`; `How-I-Build-Opinionated-SaaS-Applications.txt` cache/workflow evidence.

---

## RL-11 — Error propagation

**Purpose / identity.** Carry expected and unexpected failures from the owning layer to the appropriate application/framework boundary while preserving internal cause/correlation and exposing only stable safe semantics.

**Entry conditions.** Any approved layer encounters invalid input, unauthenticated/forbidden access, missing resource, conflict, readiness/provider failure, database/infrastructure failure, or programming defect.

**Actors / triggers.** User/system request under execution; originating module raises/returns failure according to its contract.

**Trust / authorization.** Error objects, provider payloads, SQL/database exceptions, stack traces, and logs are internal data. Only approved codes/messages/field errors cross browser/HTTP boundaries. Security-sensitive existence may intentionally map to not-found.

**Canonical owners.** Originating layer classifies domain/provider/database semantics it owns. Application error abstraction carries stable codes. Server Action/Route Handler/Page boundary adapts to ActionResult/HTTP/not-found/error UI. Logging/observability owns internal evidence.

**Ordered stages.** `failure occurs → owning layer classifies expected vs unexpected → preserve safe code + internal cause/correlation → transaction rolls back if active → propagate to application/framework boundary → boundary maps safe result/status/page outcome → log/metric/tracing records internal evidence → caller/UI renders stable response`.

**Invariants.** Unknown exceptions are not converted into detailed browser output. Redirect/not-found framework control flow is not swallowed by broad catches. Expected errors remain typed/stable. Secrets/raw provider/DB payloads never appear in UI or unrestricted logs.

**Transaction behavior.** If failure occurs inside an atomic DB transaction, it aborts/rolls back according to transaction semantics. Error mapping itself opens no transaction and does not perform compensating provider writes ad hoc.

**Failure behavior.** If logging/secondary telemetry fails, it must not expose secrets or mutate the intended failure into success. Error-mapping defects are treated as unexpected failures and surfaced safely.

**Retry / recovery.** Retry is determined by the originating error/lifecycle policy, not by generic catch/retry. Validation/auth/conflict failures usually require changed input/state; transient provider/serialization failures follow bounded explicit retry policies.

**Concurrency / idempotency.** Repeated failed requests remain subject to the operation's idempotency/version rules; an error response never proves whether an ambiguous external provider operation did or did not occur without reconciliation.

**Outputs / completion.** Stable ActionResult/application error/HTTP response/route outcome plus internal traceable evidence. Completion means the caller receives the correct safe semantics and the system preserves any required rollback/recovery state.

**Observability.** request ID, operation, actor/tenant/resource IDs where safe, error code/class, causal error internally, duration, provider/recovery identity where approved. Sanitization/bounds apply.

**Validation / conformance evidence.** Action error mapping tests; route HTTP/status tests; safe-message/secret-leak tests; redirect/not-found handling tests; transaction rollback tests; provider ambiguous-failure recovery tests; log sanitization tests where implemented.

**Source traceability.** `hipsterstack.patterns.server-action.reference.md` stable ActionResult/ApplicationError; `hipsterstack.patterns.layer-contract.reference.md` expected/unexpected error contract; `hipsterstack.patterns.application-workflow.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` typed result/security evidence.

---

## RL-12 — Test execution

**Purpose / identity.** Execute one declared validation/test suite in an isolated, reproducible environment and produce truthful evidence tied to the exact code/configuration under test.

**Entry conditions.** A developer, agent, or CI gate selects the narrowest relevant test/validation command with required fixtures/environment available.

**Actors / triggers.** Human developer, authorized coding agent, or CI workflow. Production customer requests do not trigger engineering test suites.

**Trust / authorization.** Test fixtures/credentials are non-production or explicitly safe test resources. Destructive production migrations/provider mutations are never disguised as test execution. Environment assumptions are validated before use.

**Canonical owners.** Package scripts define canonical command surface. Test framework owns execution/assertions. Fixtures/helpers own deterministic setup/cleanup. Specialized validators own architecture/contracts. CI records integration evidence.

**Ordered stages.** `select declared command → validate/provision test environment/fixtures → execute isolated test/validator → collect assertions/errors → cleanup/rollback fixtures → record command + environment + revision + result + scope + limitations → publish evidence when required`.

**Invariants.** A test not executed is never recorded passed. Tests do not silently weaken or mutate production/canonical rules to obtain green. Real DB/RLS/concurrency claims require production-equivalent PostgreSQL/runtime-role execution rather than mocks alone.

**Transaction behavior.** Tests may use rollback fixtures or isolated databases where compatible, but transaction tests must exercise the real transaction behavior they claim. Test harness cleanup is not product transaction authority.

**Failure behavior.** Failed required assertion/validator produces nonzero/failing evidence and blocks its applicable gate. Fixture/environment inability is `blocked`/infrastructure failure, not passed.

**Retry / recovery.** Retry transient infrastructure only when classified; repeated reruns do not erase the original failing evidence. Flaky behavior is a defect requiring disposition, not permission to cherry-pick green runs.

**Concurrency / idempotency.** Parallel tests use isolated fixture identities/resources. Concurrency tests deliberately create competing operations and assert deterministic winner/rollback outcomes.

**Outputs / completion.** Exit code, structured/test report where supported, logs/artifacts, and explicit evidence metadata. Completion means setup/cleanup succeeded as required and all applicable assertions have a recorded disposition.

**Observability.** command, runtime/tool versions, environment type, commit/branch, run ID, timing, test counts/results, blocked/skipped reasons. Secrets are masked.

**Validation / conformance evidence.** Validator self-tests/negative fixtures; unit/integration/browser reports; exact command output; CI artifact retention; review of test scope against the claim it supports.

**Source traceability.** `hipsterstack.engineering-system.definition.source-document(1).md` validation ownership; `software-development.engineering-practice.descriptive-model.reference(1).md` evidence discipline; `How-I-Build-Opinionated-SaaS-Applications.txt` testing/validation/CI sections; `Codependent-Coding-Knowledge-System.txt` §§11.7–11.8.

---

## RL-13 — Continuous integration

**Purpose / identity.** Reproduce declared repository integration gates for a specific revision and prevent merge/release when required executed checks fail.

**Entry conditions.** Pull request, push to protected/default branch, release workflow, or explicit authorized dispatch triggers the CI workflow for a resolvable source revision.

**Actors / triggers.** GitHub Actions/system workflow and repository event/authorized dispatcher.

**Trust / authorization.** Checkout is tied to the event SHA/merge ref as declared. Workflow token permissions are least-privilege. Secrets are injected only into jobs that require them. External status integrations do not redefine repository conformance unless explicitly required by policy.

**Canonical owners.** `.github/workflows/*` owns CI orchestration. Package scripts/validators/tests own checks. `.agents/contracts/validation.yaml` and canonical validation documentation own required gate semantics. GitHub records run/job/check/artifact evidence.

**Ordered stages.** `event → resolve exact revision → checkout → configure pinned/declared runtime/toolchain → frozen/reproducible dependency install where applicable → generate required artifacts/clients → execute required format/lint/type/contracts/schema/unit/integration/build/E2E gates as defined for repository/product → upload evidence → publish final check conclusion`.

**Invariants.** Required failure blocks merge/release under repository policy. CI reports only checks actually executed. A green unrelated status does not override failed required conformance. No test is deleted/disabled merely to make the pipeline green.

**Transaction behavior.** CI does not own product DB transactions. Integration-test jobs use isolated test resources and explicit setup/cleanup. Production migrations/deployments are separate authorized lifecycles.

**Failure behavior.** A genuine check failure remains failed until root cause is fixed. Transient runner/provider infrastructure is distinguished from product/conformance failure. Logs identify the failing command/job.

**Retry / recovery.** Retry failed jobs only for classified transient infrastructure or after a corrective commit. Superseded runs may be cancelled according to workflow policy without rewriting earlier evidence.

**Concurrency / idempotency.** Workflow concurrency groups may cancel stale runs; evidence remains tied to the exact revision. Duplicate workflow dispatch does not create product state.

**Outputs / completion.** GitHub check/run conclusion plus durable logs/artifacts required by the validation contract. Completion means all required jobs have terminal conclusions for the exact revision.

**Observability.** workflow/run/job IDs, event, head SHA, tool/runtime versions, commands, step results, artifact IDs/digests, timing, retries/cancellations.

**Validation / conformance evidence.** CI workflow syntax/read-back; required job/check inspection; logs proving commands executed; uploaded artifacts; negative validator/test runs where required; post-merge main run for canonical integration evidence.

**Source traceability.** `hipsterstack.engineering-system.definition.source-document(1).md` Delivery/Review and validation ownership; `How-I-Build-Opinionated-SaaS-Applications.txt` CI/CD sequence; `Codependent-Coding-Knowledge-System.txt` §§11.7–11.8; governance/validation canonical docs.

---

## RL-14 — Deployment

**Purpose / identity.** Promote one approved application revision into a target runtime environment with explicit migration/configuration compatibility and a reversible/forward-fixable operational plan.

**Entry conditions.** Required integration/release gates for the target revision are satisfied, deployment is authorized, environment configuration/secrets exist, and migration/provider change plans are reviewed when applicable.

**Actors / triggers.** Authorized human/release automation/Vercel integration according to project deployment policy.

**Trust / authorization.** Deployment uses the intended immutable source revision and approved environment. Production credentials are available only to deployment/runtime systems that need them. Production migration/provider mutation requires explicit authorization and is not treated as harmless validation.

**Canonical owners.** Release/CI governance owns approval and source revision. Vercel/deployment platform owns build/runtime promotion mechanics. Prisma/migration artifacts own schema evolution. Product/integration configuration owners own environment/provider settings.

**Ordered stages.** `approved revision → verify target/environment and configuration → validate backward/forward migration compatibility → apply explicitly authorized migration phase as designed → production build/artifact promotion → deploy exact revision → wait for platform readiness/health → emit deployment identity → hand off to post-deploy verification`.

**Invariants.** Deployment revision is identifiable. Migration and application compatibility is deliberate. Provider mutations and schema changes are not hidden in unrelated build steps. Secrets never enter repository artifacts/logs. A deploy does not grant product entitlement/payment truth.

**Transaction behavior.** Application deployment is not a distributed DB transaction. Migrations use their own database transaction semantics/expand-contract plan. Irreversible schema/provider changes require rollback/forward-fix design before execution.

**Failure behavior.** Build failure prevents promotion. Migration/deploy/health failure produces an explicit failed deployment state and preserves previous good service where platform/schema compatibility permits. Partial migration requires the documented recovery/forward-fix path.

**Retry / recovery.** Redeploying the same immutable revision is allowed when platform operation is retry-safe. Rollback to a prior application revision is allowed only if migration/provider compatibility permits; otherwise use forward fix.

**Concurrency / idempotency.** Production promotion policy prevents ambiguous competing releases. Deployment identity includes exact source revision so later verification cannot accidentally inspect a newer deployment.

**Outputs / completion.** Deployment URL/environment/revision/build identity and ready/failed platform state. Deployment lifecycle hands off to post-deploy verification; platform `ready` alone is not full release acceptance.

**Observability.** deployment ID/URL, source SHA, environment, build/migration logs, runtime health, start/completion timestamps, rollback/forward-fix action, operator/system actor.

**Validation / conformance evidence.** Production build result; migration validation/plan; deployment provider read-back; exact SHA mapping; health check; secret/transient artifact checks; post-deploy verification evidence.

**Source traceability.** `hipsterstack.engineering-system.definition.source-document(1).md` Delivery/Review; `How-I-Build-Opinionated-SaaS-Applications.txt` CI/CD and migration/deployment cautions; `software-development.engineering-practice.descriptive-model.reference(1).md` delivery/operation evidence model.

---

## RL-15 — Post-deploy verification

**Purpose / identity.** Independently confirm that the deployed revision is the intended revision and that critical product/system behavior is healthy before the deployment is accepted as operationally successful.

**Entry conditions.** A deployment reports ready/available and exposes a resolvable deployment identity/URL/source revision.

**Actors / triggers.** Authorized CI/release automation or operator performing the declared smoke/observability verification.

**Trust / authorization.** The verifier resolves the actual deployed revision/configuration rather than assuming the latest requested deploy is live. Test accounts/credentials are scoped and non-destructive. Provider/payment checks use safe test/smoke operations defined by product policy.

**Canonical owners.** Release/validation governance owns acceptance criteria. Smoke/E2E tooling owns behavior checks. Deployment platform/observability providers expose deployment/log/metric/error evidence. Operator/release automation owns accept/rollback decision under policy.

**Ordered stages.** `deployment ready → resolve deployment ID/URL/source SHA/config class → run critical non-destructive smoke flows → inspect required logs/metrics/error health → compare observed behavior with release acceptance → accept deployment OR initiate allowed rollback/forward-fix → record evidence`.

**Invariants.** Evidence is tied to the deployment actually tested. A smoke test that ran against a different revision/environment cannot approve the target. Critical security/auth/tenant/payment invariants are never skipped silently.

**Transaction behavior.** Verification should avoid production mutation; any required smoke mutation uses explicitly safe test data and normal application transaction/provider boundaries. Verification never performs ad hoc database correction as part of passing the check.

**Failure behavior.** Critical smoke/security/runtime regression yields failed acceptance and invokes rollback/forward-fix policy. Observability unavailability that prevents required evidence is blocked, not passed.

**Retry / recovery.** Safe smoke checks may be repeated to distinguish transient infrastructure, but failure evidence remains recorded. A corrective deployment creates a new verification target/revision.

**Concurrency / idempotency.** Before and after smoke, verifier confirms target deployment identity so a concurrent later deployment does not make evidence ambiguous. Smoke operations use unique test identities/idempotency as required.

**Outputs / completion.** Explicit accepted/failed/blocked post-deploy verdict tied to exact deployment/source revision, with smoke and observability evidence locations. Completion requires all mandatory checks to have terminal dispositions.

**Observability.** deployment/source IDs, smoke command/run IDs, HTTP/browser outcomes, error-rate/log/metric observations, timing, operator/system actor, rollback/forward-fix outcome.

**Validation / conformance evidence.** Deployment read-back; critical Playwright/HTTP smoke output; observability checks; exact revision comparison; negative behavior where relevant; release record/handoff with PASS/FAIL/BLOCKED distinctions.

**Source traceability.** `hipsterstack.engineering-system.definition.source-document(1).md` post-deployment smoke verification; `How-I-Build-Opinionated-SaaS-Applications.txt` delivery sequence; `software-development.engineering-practice.descriptive-model.reference(1).md` production feedback/operation model.

---

## Supplemental durable lifecycle classes

The fifteen runtime lifecycles above are the required architecture lifecycle set for this specification. Durable product/operation records additionally follow the Golden Lifecycle grammar and must be specialized by a product/domain specification rather than invented generically here.

### Webhook and outbox delivery

Webhook/Event Ledger uses `received → processing → processed | ignored | failed`, with failed/expired-processing reclaim policy. Outbox delivery uses `pending → processing → delivered | failed → dead_letter` or the approved product equivalent. Both define unique identity, lease/token, attempt count, next attempt, terminal states, bounded failure metadata, idempotency, observability, and dead-letter/recovery policy. Domain state may be complete while a secondary outbox delivery remains pending.

### Membership

Reference Membership uses states such as `invited → active ↔ suspended → revoked`, with exact product transition policy defined in the application specification. Active Membership is the default authorization-eligible state. Uniqueness and owner-preservation/resource-reassignment/session consequences are explicit product/security invariants, not inferred from UI.

### Billing and entitlement

Stripe Subscription/provider status, local provider/subscription mirror, and application Entitlement are separate lifecycles/truth domains. A generated product defines grace/suspension/cancellation timing and entitlement mapping explicitly. Webhook-normalized local state is authoritative for product access checks under that mapping. Checkout/Portal redirects never create entitlement authority.

### Release governance

Engineering change flows through `intent → context → contract → specification → approval → implementation → validation → review → release → observation → deprecation → archive`. Each stage has explicit entry/exit evidence. Public-boundary change synchronizes canonical context, machine contracts, implementation, tests, decision/provenance, migration/rollout, and release evidence.

## Recovery and audit contract

Every nontrivial lifecycle must answer:

- What if execution stops after each consequential stage?
- What if the logical request is repeated?
- What if two actors/processors race?
- What if provider truth arrives late or out of order?
- What if local and provider truth diverge?
- What records make recovery supportable without rewriting history?

Recovery mechanisms include stable idempotency keys, expected versions, unique constraints, processing leases, retry/recovery records, outbox records, provider retrieval/reconciliation, compensating transitions where domain-legal, and operator review only where the product explicitly permits it.

Consequential audit evidence should identify event/operation, entity/resource, tenant, actor/system identity, prior/next state where meaningful, request/provider event identity, timestamp, and bounded reason/metadata. Audit describes what happened; it is not the only canonical state store.

## Lifecycle consistency rule

A lifecycle change is incomplete until its canonical owner, adjacent layer/security/workflow/pattern contracts, validation, tests, and provenance are synchronized. Product-specific states or provider semantics may specialize this document but may not weaken its trust, authorization, transaction, idempotency, concurrency, evidence, or recovery invariants without an explicit approved canonical decision.
---
title: Codependent Coding Pattern 009 System Lifecycle
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: system-lifecycle
kind: reference
namespace: codependentcoding.patterns.system-lifecycle.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/lifecycle
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/09-system-lifecycle.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: f6eec5c055813fd9e3f7e1d63f740203e1bc0815
source_format: markdown
---
# Pattern 009: System Lifecycle

**Purpose/context.** Define how stateful concepts and consequential runtime processes enter, transition or advance, terminate, retry, recover, and remain observable under concurrency and partial failure.

**Responsibilities.** Define identity/tenant/truth owner where state persists; initial/active/recoverable/terminal states where applicable; named transitions/stages; actors/triggers; trust and authorization; guards vs invariants; canonical owners; transaction/atomic-write behavior; failure; idempotency; concurrency; recovery; outputs/completion; audit/observability; validation evidence and source traceability. Every durable state transition has one named authority, one legal transition definition, and one persistence strategy. One Workflow owns each authoritative product transition.

**Non-responsibilities.** Enum/status/switch alone is not a lifecycle. Provider state is not collapsed into domain state. Audit is not the sole canonical state. A runtime process lifecycle does not invent persistence states merely to resemble a state machine.

**Contract.** Durable transition requests supply expected state/version and authorized Actor/system trigger. Conditional database mutation produces the next legal state or conflict. Important transition timestamps are dedicated. Non-persisted runtime lifecycles use the same authority/failure/recovery/evidence grammar without fabricating entity states.

**Runtime lifecycle fields.** Every required runtime lifecycle defines: Purpose / identity; Entry conditions; Actors / triggers; Trust / authorization; Canonical owners; Ordered stages; Invariants; Transaction behavior; Failure behavior; Retry / recovery; Concurrency / idempotency; Outputs / completion; Observability; Validation / conformance evidence; Source traceability.

**Security/tenant.** Every lifecycle-bearing record has tenant ownership or explicit global scope; actors and legal cross-tenant operations are named. System transitions use narrow system actors. Runtime lifecycles identify every trust boundary and the layer that performs authoritative authorization.

**Transaction/cache.** State, audit, and required outbox commit together when they describe one atomic invariant. Provider work uses separate recoverable phases outside database transactions. Cached state never authorizes a transition without freshness proof. Runtime processes with no transaction say so explicitly instead of implying atomicity.

**Failure/recovery.** Every lifecycle explains what happens on invalid input/state, provider or infrastructure failure, interruption after each consequential stage, repetition, competing actors, stale leases/versions, and local/provider divergence where applicable. Expected, failed, blocked, retryable, terminal, and completed outcomes remain distinguishable.

**Naming/placement.** Lifecycle name is a domain or runtime-process noun; durable transitions are imperative; resulting events are past tense; stable lifecycle IDs are used where machine comparison is needed. [[codependentcoding.docs.system-lifecycles.contract]] owns the complete required runtime lifecycle set.

**Lifecycle/tests.** Test every allowed and forbidden source state where state persists, required invariant/timestamp/version, concurrent contender, idempotent retry, crash point, out-of-order event, recovery/dead-letter path, and required runtime field. Lifecycle completeness validation must fail when a mandatory runtime field is removed.

**Anti-patterns/adjacent.** Polluted status enum, multiple transition authorities, irreversible partial state with no recovery, combined lifecycles whose trust/transaction semantics differ, provider-delivery order as business authority, completion claims without executed evidence. Adjacent: Workflow, Transaction Helper, Webhook Processor, auth/authz policy, cache invalidation, error handling, validation/CI, deployment, governance release lifecycle.
---
title: Codependent Coding Runtime Lifecycle Source Traceability
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: lifecycle-traceability
kind: reference
namespace: codependentcoding.provenance.lifecycle-traceability.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
  - "[[codependentcoding.patterns.system-lifecycle.reference]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/lifecycles
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/lifecycle-traceability.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: d46fb948e82b09743d98a74f31f56de9e9278312
source_format: markdown
---
# Runtime Lifecycle Source Traceability

This matrix supports `DEF-HIGH-006` by mapping each required runtime lifecycle to its canonical owner set, authoritative source evidence, and applicable validation. It is issue-scoped evidence; repository-wide atomic provenance remains `DEF-HIGH-009`.

| Lifecycle | Canonical owners / adjacent contracts | Primary source evidence | Required validation / evidence |
|---|---|---|---|
| `RL-01` Server-rendered page | `app/`, Feature loader/orchestrator, Fetchers, Components; `docs/12-layer-contracts.md` | `hipsterstack.patterns.route-feature-orchestration.reference.md`; `hipsterstack.patterns.fetcher.reference.md`; `How-I-Build-Opinionated-SaaS-Applications.txt` Route/Feature sections | route-schema/page-state tests, import boundaries, build, critical Playwright |
| `RL-02` Authenticated request | `lib/auth/`, `lib/authz/`, Workflow policy; `docs/14-security-model.md` | `hipsterstack.patterns.auth-authz-boundary.reference.md`; How-I-Build Authentication/RBAC; Vouch §§0.2–0.5 as implementation evidence | auth adapter/account-state tests, policy matrix, tenant denial, architecture/RLS checks |
| `RL-03` Tenant read | Fetcher, auth/authz scope, DB select/RLS helper, DTO mapper | Golden Fetcher; Auth/Authz Boundary; Layer Contract; Transaction/RLS evidence | Fetcher/select/DTO tests, pagination bounds, runtime-role cross-tenant attack tests |
| `RL-04` Tenant mutation | Server Action/HTTP adapter, Workflow, authz, Transaction Helper, Integration Adapter | Golden Server Action; Application Workflow; Transaction Helper; Auth/Authz Boundary; How-I-Build mutation sections | action/workflow/transaction/idempotency/failure-injection/RLS/E2E evidence |
| `RL-05` Form submission | Client form/RHF interaction, Server Action, Workflow | Golden Server Action FormData adapter; Route/Feature client-boundary guidance; How-I-Build React Hook Form and actions | client/form interaction, action validation/error, duplicate/stale submission, accessibility/E2E |
| `RL-06` Application workflow | Workflow + policy/domain + DB/integration/recovery | `hipsterstack.patterns.application-workflow.reference.md`; System Lifecycle; Layer Contract | policy/invariant sequence, provider failure, retry/recovery, transaction/concurrency, import rules |
| `RL-07` Database transaction | transaction runner, Transaction Helper, Prisma/Postgres constraints/RLS | `hipsterstack.patterns.transaction-helper.reference.md`; Auth/Authz RLS section; System Lifecycle | real Postgres rollback/concurrency/serialization/runtime-role/RLS attack tests |
| `RL-08` Clerk webhook | webhook Route Handler, Clerk adapter, Event Ledger, identity reconciliation Workflow/Tx | Golden Webhook Processor generic contract; Auth/Authz system Actor; How-I-Build Clerk synchronization; Vouch Clerk webhook implementation evidence | signature, dedupe, lease/reclaim, stale-token, provider-value validation, sync rollback |
| `RL-09` Stripe webhook | webhook Route Handler, Stripe adapters, Event Ledger, reconciliation Workflow/Tx | Golden Webhook Processor; Application Workflow provider recovery; System Lifecycle; How-I-Build Stripe webhook; Vouch implementation evidence | signature/raw-body, duplicate/concurrent/out-of-order, Connect scope, amount/currency, recovery |
| `RL-10` Cache invalidation | Workflow logical plan + framework action/cache adapter + Fetcher freshness | Golden Server Action invalidation; Golden Workflow framework-neutral result; engineering-system definition | success-only invalidation, tenant/resource key scope, read-after-write/freshness, import boundary |
| `RL-11` Error propagation | origin layer, ApplicationError/error contract, Server Action/route boundary, observability | Golden Server Action; Layer Contract error semantics; Application Workflow error mapping | stable mapping, secret leakage, redirect/not-found control flow, rollback/provider ambiguity cases |
| `RL-12` Test execution | package scripts, validator/test frameworks, fixtures, CI evidence | engineering-system validation ownership; engineering-practice evidence discipline; How-I-Build testing; Codependent §§11.7–11.8 | exact command/environment/result, cleanup, negative/self-tests, real DB proof where claimed |
| `RL-13` Continuous integration | GitHub workflow + canonical commands + validation contract | engineering-system Delivery/Review; How-I-Build CI/CD; Codependent §§11.7–11.8 | workflow read-back, run/job logs, exact revision, artifact/digest, required failure behavior |
| `RL-14` Deployment | release governance, Vercel/deployment platform, migration/config owners | engineering-system Delivery/Review; How-I-Build deployment/migration; engineering-practice delivery/operation | build/migration plan, provider deployment read-back, exact SHA, health and secret checks |
| `RL-15` Post-deploy verification | release/validation governance, smoke tooling, deployment/observability providers | engineering-system post-deployment smoke; How-I-Build delivery sequence; engineering-practice production feedback | deployed-revision read-back, smoke/observability, PASS/FAIL/BLOCKED verdict, rollback/forward-fix evidence |

## Canonical grammar trace

The common lifecycle field set is derived from `hipsterstack.patterns.system-lifecycle.reference.md`, which requires identity/ownership/truth source/states/transitions/actors/guards/invariants/side effects/timestamps/idempotency/concurrency/recovery/observability/tests, and is extended for runtime-process lifecycles by the issue contract to make trust/authorization, canonical owners, transaction behavior, failure, outputs/completion, and conformance evidence explicit.

[[codependentcoding.patterns.system-lifecycle.reference]] is the canonical pattern owner for that complete runtime field set. [[codependentcoding.docs.system-lifecycles.contract]] instantiates it across the fifteen required runtime lifecycles.

## Required-set completeness

| Requirement | Evidence |
|---|---|
| Tenant mutation and form submission are separate | `RL-04` and `RL-05`; lifecycle validator rejects the legacy combined marker |
| Entry conditions and actors/triggers | mandatory fields in every `RL-*` record |
| Trust boundary and authorization | mandatory `Trust / authorization` field in every record |
| Ordered steps and owners | mandatory `Canonical owners` + `Ordered stages` fields |
| Invariants and transaction behavior | mandatory fields in every record, including explicit no-transaction cases |
| Failure, retry/recovery, concurrency/idempotency | mandatory fields in every record |
| Outputs, completion, observability | mandatory fields in every record |
| Validation/conformance evidence | mandatory field per record |
| Source traceability | mandatory field per record plus matrix above |
| Mechanical completeness | `scripts/validate-lifecycles.mjs` checks all 15 lifecycle IDs × all 15 mandatory fields and runs a negative self-test that removes one field |
| Adjacent consistency | lifecycle validator checks key markers in Pattern 009, layer contracts, and security; PR review compares semantics with architecture/workflow/security/contracts |

## Scope boundary

This matrix does not claim that product-specific domain lifecycles, provider status mappings, all machine contracts, or the repository-wide validator are fully repaired. Product-specific durable states remain owned by scoped product specifications and the Golden Lifecycle grammar. Machine-contract and validator completeness remain `DEF-HIGH-005` and `DEF-HIGH-001` respectively.
