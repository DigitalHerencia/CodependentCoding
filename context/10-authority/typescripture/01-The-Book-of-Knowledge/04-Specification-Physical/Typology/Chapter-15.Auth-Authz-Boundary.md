---
title: Codependent Coding Security Model
type: contract
scope: domain
project: CodependentCoding
domain: security
artifact: security-model
kind: contract
namespace: codependentcoding.docs.security-model.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.layer-contracts.contract]]"
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
supersedes: []
tags:
  - codependentcoding/security
  - codependentcoding/contracts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/14-security-model.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 38a2508ff9d5604b9e131e6f7b5a6027863beb5c
source_format: markdown
---
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
---
title: Codependent Coding Pattern 005 Authentication Authorization and Policy
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: auth-authz-policy
kind: reference
namespace: codependentcoding.patterns.auth-authz-policy.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.docs.security-model.contract]]"
  - "[[codependentcoding.patterns.fetcher.reference]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/authz
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/05-auth-authz-policy.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 5d54dc15a03cb993290c36004392ff16242f5366
source_format: markdown
---
# Pattern 005: Authentication, Authorization, and Policy

**Purpose/context.** Separate identity, local account, membership, capability, resource policy, workflow legality, readiness, and RLS containment so each question has one owner.

**Responsibilities.** Auth maps verified Clerk session to active local Actor. Authz resolves active Organization Membership and role-derived capabilities, returns legal read scopes, and evaluates resource/workflow policies over facts. System actors are explicit and narrowly typed.

**Non-responsibilities.** Clerk metadata does not own roles/tenant/billing/workflow. UI hiding is not authorization. Capability policy is not readiness or lifecycle transition legality. RLS is not the complete product policy.

**Contract.** Server operations call auth/authz. User Actor includes local and external identity; system Actor includes named system and request/event correlation. Policy consumes plain facts and returns scope/allow or typed denial. Missing cross-tenant membership/resource fails closed.

**Transaction/cache.** Membership reads use approved data boundaries/RLS context. Pure policies have no transaction. Request-local Actor memoization is allowed; persistent authz cache requires revocation/freshness proof.

**Security/tenant.** Client user/tenant/role/capability is never authoritative. Role → capabilities → resource/workflow policy. RLS independently contains tenant rows.

**Naming/placement.** `lib/auth/actor.ts`; `lib/authz/<domain>.scope.ts`, `.policy.ts`; capability `<resource>.<operation>.<scope>`.

**Lifecycle/tests.** session → local User → Membership → capability → resource policy → workflow guard; test missing/disabled/suspended, every role/resource combination, system restrictions, stale membership, and real RLS bypass attempts.

**Anti-patterns/adjacent.** global admin by email, boolean soup, raw role comparisons, Clerk public metadata truth. Adjacent: fetcher, workflow, lifecycle, RLS.
---
title: Codependent Coding Supporting Quality Delivery and Policy Patterns
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: quality-policy-patterns
kind: reference
namespace: codependentcoding.patterns.quality-policy-patterns.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.supporting-patterns.reference]]"
depends_on:
  - "[[codependentcoding.docs.validation-conformance.contract]]"
  - "[[codependentcoding.docs.governance-model.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - codependentcoding/quality
  - codependentcoding/policy
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/11d-quality-policy-patterns.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 13c366f423477d273dbbb00a53e3b460240bcfb3
source_format: markdown
---
# Supporting Quality, Delivery, and Policy Patterns

## SP15 - Test fixture

**Purpose / context.** Create deterministic minimal valid scenario data and handles for one test with explicit tenant, actor, state, time, provider IDs, and cleanup.
**Responsibilities.** Build only required relations, expose typed handles, control time/randomness where needed, isolate tests/tenants, declare cleanup/reset.
**Non-responsibilities.** No production seed clone, hidden invalid defaults, shared mutable global state, production secrets, or assertions for the behavior under test.
**Inputs.** Explicit fixture options and test-environment resources.
**Outputs.** Typed handles/records/IDs plus cleanup/reset mechanism.
**Dependencies.** Test-only DB/provider/browser helpers, deterministic clock/ID utilities, approved isolation mechanisms.
**Callers.** Unit, integration, security, concurrency, and E2E tests only.
**Callees.** Test-support builders and approved isolated test infrastructure.
**Invariants.** Equivalent options create equivalent logical scenarios; no cross-test leakage; invalid scenarios are explicitly named.
**Failure behavior.** Setup/cleanup failures surface and cannot silently contaminate later tests.
**Security.** Test resources/credentials only; synthetic bounded sensitive values; no production data.
**Tenant isolation.** Tenant-scoped fixtures identify tenant explicitly; cross-tenant tests create distinct tenants and runtime contexts.
**Transaction behavior.** DB fixture isolation may use rollback/schema/database patterns unless that would hide transaction/RLS/concurrency behavior being tested.
**Caching behavior.** Declare cache reset/namespace when cache affects tests; cross-test cache leakage forbidden.
**Validation.** Type/lint/test-support boundaries and no test-only import into production runtime.
**Testing.** Representative fixture determinism/isolation and constraint checks.
**Naming.** `createProjectFixture`, `tenantA`, `suspendedMembershipFixture`; avoid `seedAll`.
**Placement.** `tests/fixtures`, test support, or colocated test builders not exported to production.
**Lifecycle.** Setup before RL-12 Test execution and cleanup after terminal result.
**Anti-patterns.** Giant global seed, random uncontrolled time, production credentials, hidden extra permissions, mock fixture claiming real RLS proof.
**Adjacent relationships.** Test Execution owns run/evidence; Fixture supplies scenario; transaction/provider/browser harness supplies environment; assertions stay in test.

## SP16 - Validation script

**Purpose / context.** Mechanically check deterministic repository/product/architecture contracts and report exactly what was executed and proven.
**Responsibilities.** Parse artifacts, check presence/shape/cross-reference/tree/import/schema rules, emit deterministic diagnostics, run negative/self-tests, record limitations.
**Non-responsibilities.** No self-attestation of unimplemented semantics, silent arbitrary rewrite/delete, substitution for real DB/browser/provider tests, or manufactured audit counts.
**Inputs.** Canonical repository artifacts/contracts and explicit validation fixtures/options.
**Outputs.** Deterministic exit code, actionable diagnostics, structured evidence where required, proof/limitation metadata.
**Dependencies.** Real parsers/schemas/AST/import tools appropriate to scope, machine contracts, repository filesystem/tree.
**Callers.** Package scripts, CI, developers/agents during narrow/final validation.
**Callees.** Read-only parsers/checkers and explicitly declared safe tooling; default validation mutates nothing.
**Invariants.** Green means every implemented required check passed for exact input/revision; unimplemented checks are never implied.
**Failure behavior.** Invalid repository input and validator/parser defects fail visibly; errors are not swallowed.
**Security.** Read only needed files, avoid printing secrets/sensitive payloads, never execute untrusted content merely to parse it.
**Tenant isolation.** Usually tenant-neutral; runtime RLS claims require dedicated real-database tests, not text markers.
**Transaction behavior.** No product DB transaction except when explicitly invoking isolated test suites that own their own test resources.
**Caching behavior.** No stale persistent PASS cache; incremental results key by exact content/revision and scope.
**Validation.** Validator self-tests known-valid/known-invalid fixtures and negative cases for important rule families.
**Testing.** Unit rule tests, negative fixtures, CLI exit/output, repository integration run, CI evidence.
**Naming.** `validate-<scope>.mjs|ts` and stable rule IDs; avoid `checkStuff` or misleading `validate:all`.
**Placement.** `scripts/` plus approved validation fixtures/schemas; package script is canonical entrypoint.
**Lifecycle.** RL-12 and RL-13; evidence feeds governance/release completion but is not release authority itself.
**Anti-patterns.** Regex pretending to parse structured syntax, presence test claiming semantics, validator mutation, skipped failure reported pass, prose conformance detached from execution.
**Adjacent relationships.** Machine contracts define rules; Validation Script enforces deterministic subset; runtime tests prove behavior; CI executes; Conformance derives from evidence.

## SP17 - Deployment workflow

**Purpose / context.** Promote one approved revision through reproducible build/migration/deployment and hand it to post-deploy verification.
**Responsibilities.** Resolve revision/environment, run gates, install reproducibly, coordinate compatible migration, invoke platform, enforce concurrency, record deployment ID/URL/SHA.
**Non-responsibilities.** No product auth redefinition, hidden failing gates, build-as-smoke assumption, secret logging, or unrelated infrastructure change.
**Inputs.** Exact commit/release ref, target environment, approved config/secrets, required approval.
**Outputs.** Deployment identity/source SHA plus ready/failed state and post-deploy verification handoff.
**Dependencies.** Package gates/build, GitHub Actions/release governance, Vercel or approved platform, migrations, Configuration/Env validation.
**Callers.** CI/release automation or authorized operator after integration gate.
**Callees.** Build/test commands, explicit migration, deployment provider, post-deploy verifier.
**Invariants.** One immutable source revision, required gates green, migration/app compatibility explicit, secrets isolated, platform ready != release accepted.
**Failure behavior.** Build/migration/deploy failure is terminal for that attempt; partial migration follows documented rollback/forward-fix.
**Security.** Least-privilege workflow/provider credentials, environment separation, masking, no preview-to-production trust shortcut.
**Tenant isolation.** Runtime tenant/RLS credentials and policies must remain correct through deployment/migrations.
**Transaction behavior.** Deployment is not distributed ACID; migrations own their transaction/expand-contract semantics.
**Caching behavior.** Build caches key to lockfile/toolchain/revision; application cache behavior is explicit after deploy if needed.
**Validation.** Workflow read-back, exact revision mapping, required gates, migration/build result, provider deployment read-back.
**Testing.** Preview/dry-run, migration compatibility, failure/recovery, post-deploy smoke according to risk.
**Naming.** Environment/stage-specific jobs and artifacts containing source SHA; avoid `deploy-latest` ambiguity.
**Placement.** `.github/workflows`, package scripts, deployment config; temporary admin workflow removed after use.
**Lifecycle.** RL-13 -> RL-14 -> RL-15 before operational acceptance.
**Anti-patterns.** Deploy failing branch, floating artifact, hidden migration, secret echo, “ready” treated as verified, competing production deploys.
**Adjacent relationships.** Validation/Test/CI gate input; Configuration supplies environment; migration owns schema; Post-deploy verification accepts/rejects deployment.

## SP18 - Authentication boundary

**Purpose / context.** Adapt external identity/session or verified system trigger into a trusted local discriminated Actor without conflating identity with product authorization.
**Responsibilities.** Resolve Clerk session, load matching local User, enforce account state, construct user Actor; create narrow system Actors only at verified system entrypoints.
**Non-responsibilities.** No Membership/capability/resource auth, provider readiness, billing entitlement, or workflow state.
**Inputs.** Clerk server session/identity or verified system-trigger context.
**Outputs.** Trusted `Actor` or stable unauthenticated error.
**Dependencies.** Clerk server auth adapter, approved local User query, error/security types, request-local memoization where safe.
**Callers.** Fetchers, Server Actions, protected coarse route gating, explicit system entrypoints.
**Callees.** Clerk identity/session API and local User lookup only.
**Invariants.** Provider identity maps to one local User; disallowed account state yields no active Actor; system Actor is not fake user ID.
**Failure behavior.** Missing session/User/allowed state returns safe unauthenticated semantics; infrastructure failures remain internal/unexpected.
**Security.** Server-only; no token logging; local User status is application account truth; client userId rejected.
**Tenant isolation.** Tenant-neutral identity step; Actor has no tenant authority until Membership resolution.
**Transaction behavior.** Read-only identity lookup; normal authenticated reads do not opportunistically provision User.
**Caching behavior.** Request-local memoization allowed; persistent identity cache needs explicit revocation freshness proof.
**Validation.** Import boundaries keep Clerk backend use in auth/integration; Actor/account-state mapping reconciles with security canon.
**Testing.** Missing session, unknown User, active/suspended/disabled state, system Actor, secret leakage, memoization.
**Naming.** `requireActor`, `getOptionalActor`, `createSystemActor`; avoid generic auth helper that also authorizes tenants.
**Placement.** `lib/auth`, server-only.
**Lifecycle.** RL-02 identity stage; user Actor feeds RL-03/RL-04; verified webhook routes create system Actors for RL-08/RL-09.
**Anti-patterns.** Clerk metadata as product role, auto-create User in Fetcher, client userId as Actor, fake system user, auth helper owning all permissions.
**Adjacent relationships.** Authorization consumes Actor + tenant criterion; Policy consumes authorized context/resource facts; Clerk webhook syncs local User lifecycle.

## SP19 - Authorization boundary

**Purpose / context.** Convert trusted Actor plus tenant criterion/current facts into active Membership context, capabilities, and legal scope.
**Responsibilities.** Resolve active Membership, map Role to Capabilities, derive read scope, expose capability helpers, return safe denial semantics.
**Non-responsibilities.** No Clerk authentication, provider readiness, domain mutation, provider SDK, UI, or replacement of resource/workflow policy with role check.
**Inputs.** Trusted Actor, target Organization/Tenant identifier, requested capability/read class, and plain resource facts where required.
**Outputs.** MembershipContext, legal scope/capability decision, or stable not-found/forbidden denial.
**Dependencies.** Membership/Role data access, Actor type, capability vocabulary, pure Policy helpers, ApplicationError.
**Callers.** Fetchers, Workflows, coarse protected route/layout gates where explicitly allowed.
**Callees.** Approved Membership query and pure policy/capability helpers.
**Invariants.** Membership is tenant-scoped and eligible; Roles bundle capabilities; IDs are not authority; resource ownership/state is checked where required.
**Failure behavior.** Inaccessible tenant may map to not-found; insufficient capability returns stable denial; unexpected persistence error remains internal.
**Security.** Server-authoritative, no client role/capability trust, capability/policy vocabulary replaces scattered raw role comparisons.
**Tenant isolation.** Membership joins User to Organization; legal read scope contains tenant/owner restrictions; RLS remains independent containment.
**Transaction behavior.** Read-scope derivation read-only; race-sensitive mutation policy evaluates current facts within Workflow/transaction design.
**Caching behavior.** Request-local reuse allowed; persistent Membership/capability cache needs tenant key and revocation freshness proof.
**Validation.** Capability/role mapping, policy consistency, anti-role-string architecture checks where feasible.
**Testing.** Role/capability matrix, Membership statuses, owned/all scope, cross-tenant denial, existence-disclosure semantics, companion real RLS tests.
**Naming.** `requireMembership`, `requireProjectReadScope`, `hasCapability`; avoid broad `isAdmin` API.
**Placement.** `lib/authz` plus approved data query helpers; pure resource policies per documented convention.
**Lifecycle.** RL-02 after Actor; RL-03 scope; RL-04/RL-06 authorization before transition.
**Anti-patterns.** Hidden-nav security, global user role, client tenant proof, fetch broadly then authorize, raw role comparisons in UI/workflow.
**Adjacent relationships.** Authentication produces Actor; Authorization produces Membership/scope; Policy evaluates resource facts; RLS contains rows; Workflow handles lifecycle/readiness.

## SP20 - Policy

**Purpose / context.** Express one pure authorization or domain/workflow decision over explicit plain facts.
**Responsibilities.** Evaluate actor kind, capabilities, tenant relationship, resource ownership/state, operation, and other required domain facts.
**Non-responsibilities.** No Prisma, Clerk/Stripe, cookies/request, transactions, cache revalidation, UI, or fact retrieval.
**Inputs.** Trusted plain Actor/Membership/capability context and minimal resource/workflow facts.
**Outputs.** Allow/void, legal scope/transition result, or stable typed denial/conflict according to policy contract.
**Dependencies.** Stable domain/security types, capability vocabulary, pure constants, ApplicationError/domain error.
**Callers.** Authorization boundary, Fetcher scope derivation, Workflow after current-fact load, pure lifecycle helpers.
**Callees.** Pure helpers only.
**Invariants.** One named business decision; all deciding facts explicit; same facts produce same result; tenant/resource mismatch never ignored.
**Failure behavior.** Expected denial/conflict uses stable semantics; unknown closed-union state fails exhaustively rather than default-allowing.
**Security.** Default deny on unrecognized actor/capability/state; no provider/browser authority; denial follows existence-disclosure policy.
**Tenant isolation.** Tenant/resource relationship is explicit input; policy supports but does not replace query scope/RLS.
**Transaction behavior.** Pure; Workflow decides when fact load/evaluation must be atomic to avoid race.
**Caching behavior.** Persistent policy-result caching is generally inappropriate; any memoization must key all deciding facts under guaranteed freshness.
**Validation.** Type/exhaustiveness and pure-import boundary; vocabulary reconciles with canonical contracts.
**Testing.** Exhaustive decision/property tables over roles/capabilities/ownership/state/system actor/illegal cases.
**Naming.** `requireProjectArchiveAuthorization`, `assertInvoicePayable`, `getProjectReadScope`; avoid `checkAccess` boolean soup.
**Placement.** `lib/authz/<domain>.policy.ts` or pure domain policy module under documented convention.
**Lifecycle.** Authorization/guard stages of RL-03/RL-04/RL-06 and durable domain transitions; never advances state itself.
**Anti-patterns.** Prisma query in policy, UI role switch, hidden default allow, provider readiness inside generic RBAC, unhandled unknown state.
**Adjacent relationships.** Authentication supplies Actor; Authorization supplies Membership/capabilities; Workflow supplies current resource/readiness facts; Transaction enforces atomic expected state; Lifecycle defines legal transitions.
