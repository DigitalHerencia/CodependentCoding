# Supporting Infrastructure and Integration Patterns

## SP10 - Configuration

**Purpose / context.** Centralize validated application/framework/integration settings into typed immutable server/public projections.
**Responsibilities.** Own typed config structure, integration projections, safe defaults, and explicit browser-public subset.
**Non-responsibilities.** No secret storage, domain policy, authorization, database/provider effects, or scattered environment parsing.
**Inputs.** Validated environment values plus canonical static configuration constants.
**Outputs.** Typed immutable server config and deliberately exposed public config.
**Dependencies.** Environment Validation, pure constants, framework config interfaces where needed.
**Callers.** Integration clients, DB/bootstrap, framework config, approved server modules; browser only receives public subset.
**Callees.** Pure projection helpers only; no runtime network/DB.
**Invariants.** One canonical source per setting; required values fail early; server secrets never enter public projection.
**Failure behavior.** Missing/invalid required config stops startup/build or optional-module initialization with safe actionable error.
**Security.** Secrets are server-only and not logged; public values are allowlisted; credentials consumed only by approved integrations.
**Tenant isolation.** Deployment config is not tenant product state; per-tenant settings use authorized persistence boundaries.
**Transaction behavior.** None.
**Caching behavior.** Process-lifetime immutable module state is allowed; dynamic product state is not config.
**Validation.** Environment/config schemas, TypeScript interfaces, startup/build checks, rule against scattered raw env access where feasible.
**Testing.** Environment matrix, optional modules, public/server separation, missing/invalid values, integration projection correctness.
**Naming.** Capability/domain settings such as `stripeConfig`; avoid anonymous config bags.
**Placement.** `lib/config` and approved root framework config files; server-only when secrets are referenced.
**Lifecycle.** Build/process startup and deployment initialization before request/integration lifecycles.
**Anti-patterns.** `process.env!` across code, secrets in client bundle, business policy in environment, unsafe silent defaults.
**Adjacent relationships.** Environment Validation parses raw strings; Configuration exposes typed settings; Integration/DB consumes them; Deployment supplies values.

## SP11 - Environment validation

**Purpose / context.** Fail fast when build/runtime environment values are missing, malformed, unsafe, or inconsistent.
**Responsibilities.** Separate server/public variables, parse URLs/enums/numbers/booleans, enforce cross-field/optional-module requirements, document names in `.env.example`.
**Non-responsibilities.** No provider availability check, authorization, tenant state, secret retrieval, migration, or product behavior.
**Inputs.** Raw environment strings/absence.
**Outputs.** Typed validated server/public env objects or immediate bounded configuration error.
**Dependencies.** Zod/runtime schema and pure refinements.
**Callers.** Configuration/bootstrap, framework build/runtime initialization, test/repository tooling.
**Callees.** Pure schema parsing only.
**Invariants.** Secret values never enter public output; required variables explicit by enabled module/environment; `.env.example` contains no credentials.
**Failure behavior.** Invalid required values stop startup/build before requests; errors identify variable class without echoing secret values.
**Security.** Raw env values are sensitive until classified; prevent server credential exposure to browser/logs.
**Tenant isolation.** Environment is deployment-scoped, not tenant-scoped, unless architecture explicitly dedicates an environment per tenant.
**Transaction behavior.** None.
**Caching behavior.** Validated environment may be process/module-cached because it is immutable for the process.
**Validation.** Executable env schema runs in required build/runtime contexts; repository checks can reconcile `.env.example` names safely.
**Testing.** Missing/invalid URLs, ranges, public/server split, optional integration combinations, production/test rules, redacted failures.
**Naming.** Canonical provider/infrastructure nouns and explicit public prefixes.
**Placement.** Central env module under `lib/config` or approved equivalent plus root `.env.example`.
**Lifecycle.** Build/process/deployment lifecycle before Configuration consumers initialize.
**Anti-patterns.** Non-null env assertions, per-file parsing, public secret prefix, committed credentials, optional module failing late.
**Adjacent relationships.** Schema supplies parser; Configuration owns typed settings; Deployment injects values; Validation/CI proves required environment classes.

## SP12 - Cache and revalidation

**Purpose / context.** Cache only when an explicit performance need can coexist with authorization scope, freshness, stale behavior, and invalidation ownership.
**Responsibilities.** Own cache key composition, tenant/auth scope, TTL/freshness, tags/paths, invalidation application boundary, and stale/failure semantics.
**Non-responsibilities.** Does not turn cached state into authorization/payment/readiness authority, hide synchronization writes, or move framework cache APIs into Workflows.
**Inputs.** Approved scoped read key/DTO-producing read or server-created invalidation plan after mutation.
**Outputs.** Same DTO contract as uncached read, cache hit/miss behavior, or applied invalidation effect.
**Dependencies.** Secure Fetcher/read owner, stable DTO, framework cache adapter, explicitly approved cache provider if any.
**Callers.** Fetchers/read infrastructure for caching; Server Actions/framework adapters for invalidation.
**Callees.** Secure read on miss/revalidation; framework invalidation adapter after successful mutation.
**Invariants.** No cross-tenant/auth key collision; failed mutation never triggers success invalidation; cached state cannot bypass fresh consequential checks.
**Failure behavior.** Cache failure follows declared criticality; committed mutation plus invalidation failure remains a cache/recovery problem, not fake DB rollback.
**Security.** Sensitive DTO storage/retention explicit; no secrets in keys/logs; user/tenant scope included when output differs by authority.
**Tenant isolation.** Tenant and owner/user scope affecting legal data are part of key/query boundaries; cross-tenant hit is critical.
**Transaction behavior.** Cache outside DB transaction; Workflow returns logical invalidation plan, framework applies after commit.
**Caching behavior.** Declare uncached/request-local/persistent strategy, TTL/freshness, tags, stale semantics, read-your-writes explicitly.
**Validation.** Cache-key/invalidation rules where deterministic; import rule forbids framework cache effects in Workflows.
**Testing.** Tenant/user isolation, hit/miss equivalence, stale/fresh behavior, success-only invalidation, read-after-write, invalidation failure.
**Naming.** Tags/keys encode tenant/resource/collection intent; avoid generic wildcard keys/invalidation.
**Placement.** `lib/cache` or approved read infrastructure; framework effect at Action/route boundary.
**Lifecycle.** RL-10 plus read stages of RL-01/RL-03 and post-commit stages of RL-04/RL-05.
**Anti-patterns.** Cached auth as authority, missing tenant key, invalidate everything, write inside Fetcher, `revalidatePath` in Workflow.
**Adjacent relationships.** Fetcher owns secure read; DTO owns value; Workflow emits plan; Server Action applies framework invalidation.

## SP13 - Integration adapter

**Purpose / context.** Isolate one external provider's SDK/API syntax, credentials, account scope, idempotency mechanics, and response/error normalization.
**Responsibilities.** Initialize provider client, translate trusted provider-neutral commands, preserve account scope, apply idempotency, retrieve truth, normalize results/errors.
**Non-responsibilities.** No product authorization, Membership, lifecycle legality, UI, Prisma persistence, or redirect-derived entitlement.
**Inputs.** Trusted validated provider-neutral command with server-derived provider IDs/account scope/money/URLs/idempotency identity.
**Outputs.** Bounded normalized provider result/error needed by Workflow/reconciliation.
**Dependencies.** Provider SDK/client, typed Configuration, provider-derived runtime schemas, redacted Observability.
**Callers.** Application Workflows, webhook/reconciliation processors, explicit server jobs.
**Callees.** Provider SDK/API and pure provider mapping helpers only.
**Invariants.** Provider mechanics stay here; account scope preserved; money/currency explicit; raw provider object never becomes domain state.
**Failure behavior.** Provider errors normalized with internal cause; ambiguous writes surface for Workflow recovery/retrieval rather than guessed.
**Security.** Server-only, least credential scope, allowlisted/server-derived return URL/customer/price/account IDs, signed webhook helpers where applicable.
**Tenant isolation.** Provider IDs arrive only after server tenant authorization/derivation and never prove tenant ownership themselves.
**Transaction behavior.** Network outside DB transaction; cross-system consistency uses Workflow operation/recovery/reconciliation.
**Caching behavior.** Consequential provider reads uncached by default; any cache states scope/freshness and never replaces reconciliation.
**Validation.** Input schemas/types, SDK/version/config checks, rule forbidding raw SDK imports elsewhere, normalization checks.
**Testing.** Request/response mapping, sandbox tests, connected-account scope, idempotent retry/ambiguous failure, malformed provider-derived values.
**Naming.** Application-oriented verbs such as `createInvoiceCheckout`; avoid SDK-overload names leaking through app.
**Placement.** `lib/integrations/<provider>`, server-only.
**Lifecycle.** Provider stage of RL-04/RL-06 and retrieval/verification stage of RL-08/RL-09.
**Anti-patterns.** Provider SDK in Route/Component/Action/Workflow, authz inside adapter, provider payload as domain model, network in DB tx.
**Adjacent relationships.** Workflow owns sequence; Adapter owns mechanics; Provider Mirror/DTO normalizes; Webhook reconciles; Configuration supplies credentials.

## SP14 - Logging and observability

**Purpose / context.** Produce safe correlated operational evidence for requests, transitions, retries, failures, providers, and releases without becoming product truth.
**Responsibilities.** Own structured event/log/metric/trace vocabulary, correlation, safe identifiers, duration/outcome/attempt fields, sampling/retention/redaction.
**Non-responsibilities.** No product audit invariant, authz, business transition, recovery decision, or raw payload archive.
**Inputs.** Typed operational event/error context already classified for safe logging.
**Outputs.** Structured logs, metrics, traces, alerts, or provider-neutral telemetry events.
**Dependencies.** Observability/log provider adapter, Configuration, correlation/redaction helpers.
**Callers.** Routes, Fetchers, Actions, Workflows, transaction runners, webhooks, background/release tooling via bounded event contracts.
**Callees.** Logging/metrics/tracing provider only.
**Invariants.** Stable operation correlation; bounded/redacted sensitive data; telemetry failure does not change product truth; durable audit is separate.
**Failure behavior.** Telemetry failure degrades independently/retries if configured and never exposes secrets or changes primary result.
**Security.** No secrets, tokens, cookies, raw webhook/provider/card/bank/KYC payloads or unrestricted user content.
**Tenant isolation.** Tenant IDs may correlate operations but logging access cannot become cross-tenant product read surface.
**Transaction behavior.** Ordinary telemetry outside DB tx; required Audit/Outbox commits through transaction owner.
**Caching behavior.** No application cache authority; telemetry provider buffering/sampling follows retention policy.
**Validation.** Event/redaction schema, forbidden-field checks where feasible, adapter import/config validation.
**Testing.** Correlation, redaction, errors/retries, telemetry-provider failure, sampling/retention config.
**Naming.** Stable event names/operation fields; avoid free-form prose as only machine signal.
**Placement.** `lib/observability` and owner-local event definitions; Audit remains in persistence layer.
**Lifecycle.** Cross-cuts runtime/release lifecycles at observability stages, especially recovery and post-deploy health.
**Anti-patterns.** Raw object dumps, secrets in metadata, logs as source of truth, swallowed telemetry hiding primary failure, unbounded payload retention.
**Adjacent relationships.** Error contract supplies failure class; Audit owns durable consequential evidence; Workflow/Webhook supplies operation context; Deployment consumes health telemetry.
