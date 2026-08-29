---
title: Codependent Coding Canonical Pattern Catalog
type: map
scope: domain
project: CodependentCoding
domain: patterns
artifact: catalog
kind: map
namespace: codependentcoding.patterns.catalog.map
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.layer-contracts.contract]]"
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - codependentcoding/catalog
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/README.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 2d75e1d1d0ac4d8777e35d9d75f8c7f4fa4b05e5
source_format: markdown
---
# Canonical Pattern Catalog

## Canonical pattern contract

Every canonical pattern, architecture-defining or supporting, is normative and must make the same contract dimensions explicit. A pattern is incomplete when one of these dimensions is absent merely because the author assumed it was obvious from another row, layer, or example.

1. **Purpose / context** — the recurring problem and circumstances in which the pattern applies.
2. **Responsibilities** — decisions, transformations, or effects the pattern owns.
3. **Non-responsibilities** — decisions/effects deliberately owned elsewhere.
4. **Inputs** — accepted values, trust level, cardinality, and preconditions.
5. **Outputs** — returned/produced values, serialization/cardinality, and guarantees.
6. **Dependencies** — modules, contracts, providers, or infrastructure the implementation may require.
7. **Callers** — architectural layers/modules permitted to invoke or compose the pattern.
8. **Callees** — architectural layers/modules the pattern may invoke.
9. **Invariants** — properties that must remain true for every valid implementation.
10. **Failure behavior** — expected/unknown failures, exposure rules, and recovery handoff.
11. **Security** — trust-boundary, secret, sensitive-data, provider, or authority implications.
12. **Tenant isolation** — tenant key/scope/RLS obligations or an explicit statement that the pattern is tenant-neutral.
13. **Transaction behavior** — whether database transactions are forbidden, optional, or owned, and their exact boundary.
14. **Caching behavior** — cache/memoization/freshness/invalidation obligations or explicit prohibition.
15. **Validation** — mechanically checkable structural/semantic conformance and stated proof limits.
16. **Testing** — focused unit/integration/browser/security/concurrency evidence appropriate to risk.
17. **Naming** — naming grammar that reveals responsibility and avoids overloaded terms.
18. **Placement** — canonical repository location and server/client boundary.
19. **Lifecycle** — how the pattern participates in request/entity/operation/delivery/release lifecycles.
20. **Anti-patterns** — concrete invalid implementations or shortcuts.
21. **Adjacent relationships** — neighboring patterns and the exact ownership handoff between them.

The contract is not permission to duplicate generic boilerplate twenty times. Each field must describe the **pattern-specific** consequence. For example, `Transaction behavior` for a Select definition means “no runtime transaction behavior; used by queries/transactions as a projection,” while the same field for an Integration Adapter means “network occurs outside database transactions and cross-system recovery belongs to the Workflow.” A validator may prove field presence and selected deterministic rules; semantic adequacy still requires source-backed review.

## Shared cross-pattern rules

- Inputs declare trust. TypeScript types never replace runtime validation at untrusted boundaries.
- Outputs declare cardinality and serialization. Unrestricted Prisma/provider objects do not escape their approved boundaries.
- Callers/callees obey [[codependentcoding.docs.layer-contracts.contract]] and [[codependentcoding.agents.contracts.architecture.contract]].
- Expected failures use stable semantics; unknown failures preserve internal cause and expose safe messages.
- Client-supplied actor, tenant, membership, role/capability, provider IDs, price/customer/account IDs, and return URLs never establish authority.
- Transactions are explicit and contain no provider/network work. Transaction Helpers accept a transaction client only.
- Cache behavior is always declared. Authorization/payment/readiness truth is never made authoritative by cached/browser state.
- Security and tenant evidence scales with risk; RLS is containment, not product authorization.
- Naming and placement communicate ownership. A convenient filename never authorizes a boundary violation.
- Pattern lifecycle participation must agree with [[codependentcoding.docs.system-lifecycles.contract]] and Pattern 009.
- Anti-pattern checks are automated where deterministic and reviewed where semantic.

## Pattern inventory

| ID   | Pattern                     | Purpose                                                 | Canonical owner                         |
| ---- | --------------------------- | ------------------------------------------------------- | --------------------------------------- |
| P01  | Fetcher                     | self-securing protected read                            | `lib/fetchers`                          |
| P02  | Server Action               | mutation transport adapter                              | `lib/actions`                           |
| P03  | Application workflow        | named use-case sequence                                 | `lib/<domain>/workflows`                |
| P04  | Transaction helper          | atomic DB invariant                                     | `lib/db/transactions`                   |
| P05  | Auth/Authz boundary         | identity, membership, capability, policy boundary       | `lib/auth`, `lib/authz`                 |
| P06  | Webhook processor           | durable provider reconciliation                         | `lib/webhooks`                          |
| P07  | Route/Feature orchestration | framework adaptation and product-experience composition | `app`, `features`                       |
| P08  | Layer contract              | enforceable responsibility/dependency boundary          | architecture/contracts                  |
| P09  | System lifecycle            | state/process transition, recovery, evidence grammar    | lifecycle contract + domain owners      |
| P10  | Governance system           | durable truth/contracts/execution/proof separation      | root/context/.agents                    |
| SP01 | Select definition           | exact persistence projection                            | `lib/db/selects`                        |
| SP02 | DTO mapper                  | pure persistence-to-transport translation               | `lib/db/dto`                            |
| SP03 | Schema                      | runtime trust-boundary parser                           | `schemas`                               |
| SP04 | Type                        | stable compile-time/transport contract                  | `types` or owner-local types            |
| SP05 | Client-feature boundary     | browser-only interactive island                         | `features/**/*.client.tsx`              |
| SP06 | UI primitive                | accessible domain-free element                          | `components/ui`                         |
| SP07 | UI block                    | reusable pure presentation composition                  | shared/domain presentation              |
| SP08 | Page                        | route-rendered user surface                             | route + Feature                         |
| SP09 | Error boundary              | expected/unexpected failure adaptation                  | route/action/error owners               |
| SP10 | Configuration               | typed server/public settings                            | `lib/config`                            |
| SP11 | Environment validation      | fail-fast environment parsing                           | centralized env module                  |
| SP12 | Cache and revalidation      | declared freshness/invalidation                         | cache adapters + framework boundary     |
| SP13 | Integration adapter         | provider mechanics and normalized results               | `lib/integrations`                      |
| SP14 | Logging and observability   | safe correlated operational evidence                    | observability adapter                   |
| SP15 | Test fixture                | deterministic bounded scenario data                     | test support only                       |
| SP16 | Validation script           | machine conformance check                               | `scripts`                               |
| SP17 | Deployment workflow         | repeatable gated delivery                               | package scripts + GitHub Actions/Vercel |
| SP18 | Authentication boundary     | external identity to local Actor                        | `lib/auth`                              |
| SP19 | Authorization boundary      | membership/capability/scope decision                    | `lib/authz`                             |
| SP20 | Policy                      | resource/workflow decision over plain facts             | `lib/authz` or domain policy            |

The ten architecture-defining patterns have individual specifications. The twenty supporting patterns are individually specified in [[codependentcoding.patterns.supporting-patterns.reference|Supporting Patterns]] using `SP01`–`SP20` and all twenty-one mandatory fields.
---
title: Codependent Coding Supporting Pattern Specifications
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: supporting-patterns
kind: reference
namespace: codependentcoding.patterns.supporting-patterns.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.patterns.catalog.map]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - codependentcoding/supporting-patterns
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/11-supporting-patterns.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 7ad94b7c5b60fad57e61b2ad81cee3e241037f70
source_format: markdown
---
# Supporting Pattern Specifications

The twenty supporting patterns use the complete twenty-one-field pattern contract defined in [[codependentcoding.patterns.catalog.map|Canonical Pattern Catalog]].

They are split into bounded notes so each contract remains reviewable without collapsing back into single-row summaries:

| IDs | Group | Canonical note |
|---|---|---|
| SP01-SP04 | Data and contract patterns | [[codependentcoding.patterns.data-contract-patterns.reference]] |
| SP05-SP09 | Presentation patterns | [[codependentcoding.patterns.presentation-patterns.reference]] |
| SP10-SP14 | Infrastructure and integration patterns | [[codependentcoding.patterns.infrastructure-integration-patterns.reference]] |
| SP15-SP20 | Quality, delivery, and policy patterns | [[codependentcoding.patterns.quality-policy-patterns.reference]] |

## Completeness rule

A supporting pattern is complete only when every mandatory field is present **and pattern-specific**:

`Purpose / context`, `Responsibilities`, `Non-responsibilities`, `Inputs`, `Outputs`, `Dependencies`, `Callers`, `Callees`, `Invariants`, `Failure behavior`, `Security`, `Tenant isolation`, `Transaction behavior`, `Caching behavior`, `Validation`, `Testing`, `Naming`, `Placement`, `Lifecycle`, `Anti-patterns`, and `Adjacent relationships`.

Mechanical validation proves stable pattern IDs, inventory correspondence, field presence, absence of the old table-row representation, and a negative missing-field fixture. It does not treat duplicated boilerplate as substantive evidence; semantic adequacy is established by source traceability and skeptical review against layer, security, lifecycle, provider, and governance owners.

See [[codependentcoding.provenance.pattern-traceability.reference]] for source/owner/evidence mapping and `scripts/validate-patterns.mjs` for bounded completeness validation.
---
title: Codependent Coding Supporting Pattern Source Traceability
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: pattern-traceability
kind: reference
namespace: codependentcoding.provenance.pattern-traceability.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.patterns.catalog.map]]"
  - "[[codependentcoding.patterns.supporting-patterns.reference]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/patterns
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/pattern-traceability.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 8e12d592a39c03a1920f2d3e6c5f9c0e0ebeba0a
source_format: markdown
---
# Supporting Pattern Source Traceability

This matrix supports `DEF-HIGH-007`. It identifies the source families and canonical owners used to complete SP01-SP20. Exact source fingerprints are recorded in `provenance/source-provenance-ledger.md`. Repository-wide atomic claim provenance remains the separate `DEF-HIGH-009` concern.

| ID | Pattern | Primary source evidence | Canonical owner / reconciliation |
|---|---|---|---|
| SP01 | Select definition | `hipsterstack.patterns.fetcher.reference.md` sections The select / DTO boundary; `hipsterstack.engineering-system.definition.source-document(1).md` Schemas, Selects, DTOs, and Types; `How-I-Build-Opinionated-SaaS-Applications.txt` Selects | `lib/db/selects`; least-data projection, no auth/query behavior |
| SP02 | DTO mapper | Golden Fetcher sections DTO / DTO mapper; engineering-system Schemas, Selects, DTOs, and Types; How-I-Build DTO Mappers | `lib/db/dto`; persistence-to-transport anti-corruption boundary |
| SP03 | Schema | Golden Fetcher/Server Action trust-boundary examples; Golden Layer Contract trust progression; engineering-system Zod/runtime validation; How-I-Build schema/validation sections | `schemas`; runtime shape validation never becomes authorization |
| SP04 | Type | Golden Layer Contract serialization/type contracts; engineering-system Types; How-I-Build Types | `types` or owner-local; generated Prisma/provider types remain bounded |
| SP05 | Client-feature boundary | Golden Route/Feature Orchestrator client boundaries/Suspense; engineering-system Server Ownership/Presentation; How-I-Build Feature components and React Hook Form | focused `features/**/*.client.tsx`; server-first default |
| SP06 | UI primitive | engineering-system Presentation System; How-I-Build Components -> Primitive components | `components/ui`; accessible, domain-free, provider/data-free |
| SP07 | UI block | engineering-system Presentation System; How-I-Build shared/domain components; controlling Presentation Contract | `components/shared` or `components/<domain>`; pure reusable presentation |
| SP08 | Page | Golden Route/Feature Orchestrator route/page-resolution contract; How-I-Build Routes and Feature orchestration | `app` + Feature; framework adaptation separated from product orchestration |
| SP09 | Error boundary | Golden Server Action ApplicationError/ActionResult; Golden Layer Contract Error contract; Route/Feature error ownership; How-I-Build typed failures/observability | route/action/error adapters; expected vs unexpected failure separation |
| SP10 | Configuration | engineering-system Configuration and Environment; How-I-Build Configuration | `lib/config` + root framework config; centralized typed server/public settings |
| SP11 | Environment validation | engineering-system Configuration and Environment; How-I-Build Environment configuration | centralized Zod-backed env module; fail-fast and secret/public split |
| SP12 | Cache and revalidation | Golden Server Action Cache invalidation result; Golden Application Workflow framework-neutral invalidation; engineering-system caching guidance; lifecycle RL-10 | cache adapter + framework boundary; tenant/freshness/invalidation explicit |
| SP13 | Integration adapter | Golden Application Workflow Provider adapter; Golden Layer Contract Integration adapter; engineering-system Provider Integrations; How-I-Build integrations | `lib/integrations/<provider>`; provider mechanics without product authorization |
| SP14 | Logging and observability | Golden Layer Contract unexpected-error/correlation guidance; Golden Lifecycle observability requirements; engineering-practice operational feedback; How-I-Build observability/audit/recovery | observability adapter; safe correlated evidence distinct from product audit truth |
| SP15 | Test fixture | Golden Transaction Helper real-DB test requirements; engineering-system Validation and Enforcement; engineering-practice evidence discipline | test support only; deterministic tenant/actor/state isolation |
| SP16 | Validation script | Golden Governance System mechanical validation; engineering-system Validation and Enforcement; Codependent knowledge-system validation requirements | `scripts`; check only what is implemented and produce negative evidence |
| SP17 | Deployment workflow | engineering-system Delivery and Review; How-I-Build CI/CD/deployment; lifecycle RL-13/RL-14/RL-15 | GitHub Actions/package/Vercel delivery with exact revision and post-deploy verification |
| SP18 | Authentication boundary | Golden Auth/Authz Boundary Actor/requireActor/system actors; How-I-Build Clerk owns identity / Prisma owns application identity | `lib/auth`; identity and account status only |
| SP19 | Authorization boundary | Golden Auth/Authz Boundary Membership/Capabilities/Read Scope; Golden Fetcher authorized scopes; How-I-Build custom RBAC | `lib/authz`; Membership/capability/legal scope, RLS remains containment |
| SP20 | Policy | Golden Auth/Authz Boundary Resource policy / workflow invariant distinction; Golden Layer Contract Domain policy; Golden Application Workflow resource authorization | pure `lib/authz` or domain policy; no I/O and one explicit decision |

## Contract-field provenance

The twenty-one required fields come from the controlling #11 acceptance contract and are consistent with the Golden Layer Contract's requirement that every boundary define input, output, knowledge/dependency, side-effect/error/serialization obligations; the Golden Governance System's deterministic contract/enforcement model; and the Golden System Lifecycle's requirement to expose actors, transitions, failure/recovery, concurrency, observability, and tests.

The canonical field set is defined in [[codependentcoding.patterns.catalog.map]] and instantiated by every SP01-SP20 contract. The field set includes purpose/context, responsibilities, non-responsibilities, inputs, outputs, dependencies, callers, callees, invariants, failure behavior, security, tenant isolation, transaction behavior, caching behavior, validation, testing, naming, placement, lifecycle, anti-patterns, and adjacent relationships.

## Mechanical evidence

`scripts/validate-patterns.mjs` verifies:

- all 20 stable pattern IDs and names are present in the canonical inventory;
- every pattern appears in its expected group file;
- every pattern contains all 21 mandatory fields;
- sentinel placeholder values and same-as-above shortcuts cannot satisfy the contract;
- two patterns cannot satisfy completeness by duplicating an entire contract body;
- the legacy single-table-row representation is absent;
- the supporting-pattern index links every canonical group file;
- negative self-tests remove one required field and inject a constructed placeholder sentinel, and both damaged fixtures must be rejected.

These checks prove structural completeness and selected anti-boilerplate conditions. They do not prove semantic adequacy. Semantic review remains required against [[codependentcoding.docs.layer-contracts.contract]], [[codependentcoding.docs.system-lifecycles.contract]], [[codependentcoding.docs.security-model.contract]], the architecture/ontology contracts, and the source matrix above.
