---
title: Codependent Coding Layer-Contract Specification
type: contract
scope: domain
project: CodependentCoding
domain: architecture
artifact: layer-contracts
kind: contract
namespace: codependentcoding.docs.layer-contracts.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.loaded-vibes-architecture.source-document]]"
  - "[[codependentcoding.agents.contracts.architecture.contract]]"
supersedes: []
tags:
  - codependentcoding/architecture
  - codependentcoding/layer-contracts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/12-layer-contracts.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: d9e64392b5c311e6165b1c0479eb8cb408fdf63c
source_format: markdown
---
# Layer-Contract Specification

## Contract fields

Every layer defines ownership, knowledge, callers/callees, input/output trust, validation, authorization, tenant, error, transaction, cache, forbidden dependencies, and conformance.

| Layer | Owns / may know | Allowed callers → callees | Boundary contract | Forbidden / conformance |
|---|---|---|---|---|
| `app/` page/layout | URL, params, search, metadata, framework outcomes | framework → features, fetchers/actions when trivial, presentation | validates route input; returns React/redirect/not-found | no Prisma/provider SDK/domain mutation; import and route-tree tests |
| Route Handler | raw HTTP, headers, signatures, status | HTTP/provider → auth/adapter/workflow/webhook | raw-body and HTTP adaptation | no inline business/data layer; route tests |
| Feature loader | page-state read orchestration | route/feature → fetchers | validated route context → resolution union | no Prisma/provider/Clerk backend; architecture test |
| Feature component | product composition and state branching | route → domain/shared/UI components, supplied actions | DTO/page state → React | no protected I/O; fixture/render tests |
| UI/shared/domain component | presentation, accessibility, local interaction | features/components → lower presentation | typed props/slots → React/events | no server/data/provider authority; lint/a11y tests |
| Fetcher | complete protected read use case | route/feature/server code → auth/authz, RLS DB helper, select, mapper | unknown input → DTO/null/bounded list | no writes, providers, navigation, hidden sync; unit + real DB/RLS tests |
| Server Action | mutation transport | form/client → schema, actor, one workflow, cache adapter | unknown/FormData → serializable `ActionResult` | no Prisma/provider SDK/multi-step logic; AST + adapter tests |
| Workflow | one named use-case sequence | action/handler/job → policy, DB queries/commands/tx, integrations | actor + validated command → DTO + invalidation intent | no JSX/FormData/next cache/navigation; workflow tests |
| Auth | Clerk session → trusted local Actor | server operations → Clerk adapter and local identity query | trusted server context → Actor | no product capability decision; auth tests |
| Authz/policy | membership, capability, resource/workflow decisions | fetcher/workflow → pure policies/bounded membership read | Actor + facts → scope/decision/error | no UI/provider readiness; policy matrix |
| Schema | runtime structural/semantic parsing | boundaries → pure schemas | unknown → validated value/error | no I/O/authz; schema tests |
| Query | trusted authorized read mechanics | fetcher/workflow → scoped DB client/select | authorized scope → selected record | no session/UI/DTO copy; data tests |
| Command | bounded trusted DB write | workflow/webhook → DB client | trusted input → selected record | no provider/UI; integration tests |
| Transaction helper | atomic database invariant | workflow/webhook → transaction client | `TransactionClient` first + trusted input → minimal record | no root client/network/framework; real concurrency/rollback tests |
| Select | exact persistence projection | query/fetcher/tx → Prisma type system | definition → inferred record type | no behavior/UI; typecheck |
| DTO mapper | pure persistence-to-transport translation | fetcher/workflow → types | selected record → serializable DTO | no I/O/spread leakage; exhaustive unit tests |
| Integration adapter | provider client/version/scope/mechanics | workflow/webhook → provider SDK | provider-neutral command → normalized result | no product authorization/UI; contract/sandbox tests |
| Webhook processor | durable inbox, lease, dispatch, reconciliation, finalization | verified route/job → tx/integration/outbox | verified event + system actor → processing result | no browser session assumptions; concurrency/recovery tests |
| Cache adapter | key/tag vocabulary and framework invalidation | action/server read → cache framework | explicit plan/scope → cached data/effect | no hidden authority; freshness/invalidation tests |
| Config | typed environment and static settings | server modules → environment | process env → validated server/public config | no raw env scattering/secrets in output; startup tests |
| `prisma/` | schema, migrations, grants, RLS | migration/runtime DB infrastructure | reviewed DB change | no presentation; migration/RLS attack tests |
| Governance | durable intent, deterministic rules, mutable execution evidence | humans/agents/CI → docs/contracts/validators | approved change → synchronized artifacts | no secrets/runtime behavior; repository validator |

## Dependency matrix

`✓` may import/call; `A` adapter-only; `—` forbidden.

| From \ To | Present. | Fetcher | Action | Workflow | Authz | DB | Integration | Framework |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Route | ✓ | A | A | — | — | — | — | ✓ |
| Feature | ✓ | ✓ | action reference | — | — | — | — | — |
| Component | ✓ | — | action reference | — | — | — | — | — |
| Fetcher | — | internal only | — | — | ✓ | ✓ | — | — |
| Action | — | — | — | ✓ | actor only | — | — | cache/navigation adapter |
| Workflow | — | internal reads only | — | internal use cases | ✓ | ✓ | ✓ | — |
| Authz/domain | — | — | — | — | pure/internal | bounded membership query | — | — |
| DB | — | — | — | — | — | internal | — | — |
| Integration | — | — | — | — | — | config only | internal | — |

## Data crossing

Untrusted values enter routes/actions/handlers and are parsed. Trusted actors originate server-side. Authorized scopes are unforgeable application values. Persistence records stay in the data layer. DTOs cross into features/components/clients. Provider objects remain inside adapters/webhooks. Dates become ISO strings; money uses integer minor units plus currency; decimals/bigints use explicit strings; sets become arrays across serialization.

## RLS transaction contract

The canonical helper begins a transaction, sets tenant and actor context with `set_config(..., true)`, and supplies only the transaction client to the operation. Context MUST NOT be session-global under pooling. Runtime role MUST NOT own protected tables or possess `BYPASSRLS`. Policies cover SELECT, INSERT, UPDATE, and DELETE using `USING` and `WITH CHECK` as applicable.

## Enforcement

ESLint/import graph rules enforce forbidden dependencies and directives. Contract validators compare route trees, layer paths, capabilities, package scripts, and Prisma structure. Type tests enforce boundary shapes. Real database and browser tests enforce runtime properties. Review evaluates semantic ownership that static tooling cannot prove.
---
title: Codependent Coding Pattern 008 Layer Contract
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: layer-contract
kind: reference
namespace: codependentcoding.patterns.layer-contract.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.docs.layer-contracts.contract]]"
  - "[[codependentcoding.agents.contracts.architecture.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/layer-contract
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/08-layer-contract.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 6bdc3f98c1ab37945343b2195c9153eedbafdf9c
source_format: markdown
---
# Pattern 008: Layer Contract

**Purpose/context.** Turn architectural folders into reliable boundaries by specifying input trust, output guarantee, side-effect budget, errors, dependencies, and prohibited leakage.

**Responsibilities.** Name owner, callers/callees, allowed knowledge/imports, data entering/leaving, validation/authz/tenant/transaction/cache rules, failure semantics, conformance, and additive/breaking evolution.

**Non-responsibilities.** A contract does not implement behavior, replace explanatory architecture, or enforce itself.

**Contract.** Object parameters are default for nontrivial boundaries. Outputs use deliberate null/list/error cardinality and serialization. Side-effect classes are `pure`, `read`, `database-write`, `provider-write`, `framework-effect`, or `secondary-effect`.

**Security/tenant.** Persistence/provider objects and secrets cannot cross upward. Authorized scopes cannot originate from clients. Every layer declares tenant requirements and forbidden authority.

**Transaction/cache.** Contract states whether a transaction client is required and whether network work is forbidden. Cache ownership/freshness/invalidation is explicit.

**Naming/placement.** Human owner is [[codependentcoding.docs.layer-contracts.contract]]; deterministic subset is [[codependentcoding.agents.contracts.architecture.contract]].

**Lifecycle/tests.** define → encode → implement → static/runtime/integration proof → version/migrate. Tests cover imports, directives, types, serialization, cross-tenant behavior, and public-contract evolution.

**Anti-patterns/adjacent.** YAML costume, folder-only architecture, ambiguous outputs, hidden effects. Adjacent: governance, validation, every implementation pattern.
