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

The canonical field set is defined in `patterns/README.md` and instantiated by every SP01-SP20 contract. The field set includes purpose/context, responsibilities, non-responsibilities, inputs, outputs, dependencies, callers, callees, invariants, failure behavior, security, tenant isolation, transaction behavior, caching behavior, validation, testing, naming, placement, lifecycle, anti-patterns, and adjacent relationships.

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

These checks prove structural completeness and selected anti-boilerplate conditions. They do not prove semantic adequacy. Semantic review remains required against `docs/12-layer-contracts.md`, `docs/13-system-lifecycles.md`, `docs/14-security-model.md`, the architecture/ontology contracts, and the source matrix above.
