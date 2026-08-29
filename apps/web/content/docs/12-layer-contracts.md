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
