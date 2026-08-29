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

`patterns/09-system-lifecycle.md` is the canonical pattern owner for that complete runtime field set. `docs/13-system-lifecycles.md` instantiates it across the fifteen required runtime lifecycles.

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
