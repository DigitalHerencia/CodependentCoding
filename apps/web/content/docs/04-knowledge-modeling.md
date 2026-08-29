# Knowledge Modeling and Formal Ontology

## Purpose and authority

This document owns the explanatory conceptual model for the Codependent Coding™ Knowledge System and Loaded Vibes™ WebApp Architecture. It defines what exists, what consequential concepts mean, how they relate, which states and combinations are legal, and where their rules are enforced.

`.agents/contracts/ontology.yaml` is the deterministic subset for machine comparison. It does not replace this document and it is not a persistence schema.

A folder tree, Prisma schema, TypeScript type, provider object, or generated model may encode part of the ontology, but none of them defines the ontology by itself.

## Knowledge-model stack

| Concept | Question | Role |
|---|---|---|
| Epistemology | How do we know? | authority, evidence, reconciliation |
| Ontology | What exists and relates? | conceptual model below |
| Terminology | What do we call it? | controlled vocabulary |
| Taxonomy | How is it classified? | bounded categories |
| Typology | What recurring types exist? | recurring implementation shapes |
| Mereology | What is part of what? | part-whole relations |
| Topology | How are parts connected? | runtime/repository connections |
| Nomenclature | How are artifacts named? | files, symbols, capabilities, events |
| Semantics | What meaning does structure encode? | states, errors, HTML, contracts |
| Schema | What shape is valid? | runtime, transport, persistence, machine files |
| Metadata | How is an instance described? | status, owner, authority, lifecycle, source |
| Folksonomy | What labels may users invent? | discovery tags only |
| Faceted classification | Which independent axes apply? | layer + domain + surface + scope + lifecycle |
| Information architecture | How is knowledge found? | reading order, indexes, manifests |
| Domain model | How is business meaning represented in software? | product-specific entities, states, invariants |
| Knowledge graph | How may instances be connected? | source → claim → decision → artifact → validator |

```text
Epistemology → Ontology → Terminology → Taxonomy/facets
→ Architecture/topology → Schemas/domain implementation → Evidence
```

## Formal entity catalog

### System-level

| Entities | Canonical meaning |
|---|---|
| Knowledge System, WebApp Architecture, TechStack | governance/model → reusable structure → concrete implementation substrate |
| Application, Product, Repository | deployed implementation, user/business specialization, versioned artifact container |
| Module, Domain, Feature, Route, Component | implementation unit, problem space, product orchestration, framework adapter, presentation/system part |
| Operation, Workflow, Integration, Provider | discrete behavior, named use case, controlled external connection, bounded external authority |
| Contract, Specification, Pattern, Constraint | boundary obligation, scoped intent, reusable solution, limiting rule |
| Validation, Evidence | executed rule check and durable record supporting a result/claim |

### Identity and tenancy

| Entity | Canonical meaning |
|---|---|
| Identity | representation distinguishing a user/system principal |
| Actor | trusted server-side representation of the caller |
| User | local application identity linked to external authentication identity |
| Tenant | architectural ownership/isolation abstraction |
| Organization | reference implementation noun for Tenant |
| Membership | scoped relation joining exactly one User and one Organization |
| Role | bundle of stable Capabilities in membership scope |
| Capability | stable business-operation vocabulary |
| Permission | granted capability in a particular authorization model; Capability is preferred code vocabulary |
| Resource | concrete application object evaluated by policy |
| Policy | decision logic over actor, capability, resource, scope, operation, and state |
| Scope | maximum legal tenant/resource/data boundary for an operation |
| Ownership | user, tenant, or system responsibility relationship over a resource/artifact |

### Application-layer

| Entity | Canonical meaning |
|---|---|
| Route Adapter | validates/adapts framework or HTTP context and delegates |
| Feature Orchestrator | assembles page/use-case presentation from safe boundaries |
| Presentation Component | renders supplied safe state without protected data/provider authority |
| Fetcher | self-securing server-only protected read returning bounded DTOs |
| Server Action | thin mutation transport adapter invoking one primary workflow |
| Application Workflow | authoritative named mutation/reconciliation use case |
| Transaction Helper | atomic DB mechanic accepting transaction client + trusted input |
| Authorization Policy | resource/workflow legality decision over actual facts |
| Runtime Schema | runtime validation at a trust boundary |
| Database Select | exact persistence projection required by an operation |
| DTO / DTO Mapper | approved serializable boundary representation / pure translation into it |
| Integration Adapter | provider mechanics boundary with normalized input/output |
| Webhook Route | raw request/signature/acknowledgement boundary |
| Event Ledger | durable unique provider-event receipt and processing state |
| Webhook Processor | lease-aware idempotent provider reconciliation use case |
| Outbox Record | durable eventual secondary-effect work |
| Audit Record | durable consequential actor/operation/outcome evidence |
| Recovery Record | durable partial cross-system state enabling retry/reconciliation |

### Commercial and provider

| Entity | Canonical meaning |
|---|---|
| Customer | product-domain party; not automatically a provider Customer object |
| Subscription | tenant-owned commercial relation when billing is enabled |
| Plan / Price / Entitlement | product offering, money/currency configuration, application-owned capability access |
| Checkout Session / Billing Portal Session | provider-hosted mechanisms, not product authority |
| Connected Account | optional provider account relation with explicit provider scope |
| Payment | normalized application representation of relevant provider payment truth |
| Provider Event | signed replayable notification that external state may have changed |
| Provider Mirror | bounded local external ID/state representation |
| Reconciliation | compare provider truth with local normalized state and converge legally/idempotently |

### Governance

| Entities | Canonical meaning |
|---|---|
| PRD, Technical Requirement | product intent and engineering obligation |
| Architecture Contract, Design Contract, Validation Contract | deterministic/normative subsets of architecture, design, and proof rules |
| Specification, Decision, ADR | scoped intent, selected consequential outcome, durable architecture decision |
| Issue, Pull Request, Acceptance Criterion | work contract, reviewable change, observable completion condition |
| Progress Record, Handoff Record | mutable operational execution/evidence state |
| Canonical Pattern | normative complete default grammar for a recurring concern |

## Formal relationships and cardinality

| ID | Relationship | Cardinality / ownership |
|---|---|---|
| ONT-R01 | Knowledge System defines/governs/validates WebApp Architecture | one canonical reference architecture for this system identity |
| ONT-R02 | WebApp Architecture organizes/constrains TechStack responsibilities | one → many technology responsibilities |
| ONT-R03 | Application implements the reference architecture | many applications → one baseline architecture |
| ONT-R04 | Repository contains governed artifacts | one → many; each canonical artifact has one manifest identity |
| ONT-R05 | User participates in Organization through Membership | User 0..* Membership; Organization 0..* Membership; Membership exactly 1 User + 1 Organization |
| ONT-R06 | Organization is reference realization of Tenant | one reference noun unless an ADR performs coherent reset |
| ONT-R07 | Membership receives Role; Role aggregates Capability | membership-scoped assignment; Role 0..* Capabilities |
| ONT-R08 | Policy evaluates Actor + Capability + Resource + Scope/context | one authorization decision per requested operation |
| ONT-R09 | Route Adapter delegates to a primary Feature Orchestrator | one primary feature entrypoint by default |
| ONT-R10 | Feature composes Presentation Components and invokes Fetchers | 0..* bounded reads + presentation parts as required |
| ONT-R11 | Fetcher uses Select → DTO Mapper and returns DTO | persistence record never escapes this boundary |
| ONT-R12 | Server Action delegates to Application Workflow | exactly one primary workflow per action |
| ONT-R13 | Workflow coordinates Policies, Transaction Helpers, and Integration Adapters | 0..* short atomic DB units/provider operations; network stays outside DB transaction |
| ONT-R14 | Integration Adapter isolates Provider semantics | one adapter family → one provider semantic family |
| ONT-R15 | Webhook Route verifies and delegates to Webhook Processor | one provider route → bounded processor entrypoint |
| ONT-R16 | Provider Event is recorded in Event Ledger | exactly one identity per `(provider, providerEventId)` |
| ONT-R17 | Webhook Processor performs Reconciliation | one logical reconciliation per claimed attempt; retries idempotent |
| ONT-R18 | Consequential operations may create Audit/Outbox/Recovery Records | 0..* according to consequence; atomic where required |
| ONT-R19 | Subscription belongs to Tenant; Plan includes Entitlement | tenant-owned; Plan 0..* Entitlements |
| ONT-R20 | Provider Mirror mirrors bounded Provider state | many mirrors → one provider; mirror is not domain authority |
| ONT-R21 | Issue defines Acceptance Criteria; PR implements/relates to Issue | Issue 1..* criteria; one primary issue per PR by default |
| ONT-R22 | Specification refines Technical Requirements | one spec → 1..* scoped requirements |
| ONT-R23 | Evidence records result of Validation/review | one evidence record → one executed check/review with revision and scope |

The deterministic relationship IDs and canonical owner paths are encoded in `.agents/contracts/ontology.yaml`.

## State families and constraints

Ontology owns reusable state identities only. Product-specific entity states remain in lifecycles/specifications.

| State family | Values | Constraints |
|---|---|---|
| Artifact canonicality | `canonical`, `supporting`, `implementation-evidence`, `project-specific`, `legacy`, `superseded`, `operational` | only canonical artifacts and accepted durable decisions create doctrine; operational state cannot override canon |
| Actor kind | `user`, `system` | user actors resolve from authenticated active local users; system actors identify a narrow system authority |
| Membership | `active`, `invited`, `suspended`, `revoked` | access requires a policy-allowed state; revoked membership cannot authorize tenant access |
| Webhook processing | `received`, `processing`, `processed`, `ignored`, `failed` | processed/ignored terminal; failed or expired processing may retry; row existence does not prove completion |
| Validation result | `passed`, `failed`, `skipped`, `blocked`, `inferred` | inferred/expected is not passed execution; required failure blocks completion |

Subscription, payment, provider-mirror, outbox, release, and product-domain lifecycles are owned by `docs/13-system-lifecycles.md`, patterns, and scoped specifications so provider states are not silently promoted into product states.

## Invariants and invalid combinations

### Identity and tenant

- Clerk proves identity; it is not canonical for Membership, Role, Capability, entitlement, or workflow state.
- Tenant access is established through local User + Membership.
- Business authorization evaluates capabilities/resource/workflow policy, not scattered raw role strings.
- `Tenant` is an abstraction, `Organization` the reference noun, and `Project` never a hidden tenant/billing boundary.

### Application boundaries

- Route, Feature, and presentation components do not own Prisma/provider SDK access.
- Fetchers read only and expose DTOs, never unrestricted persistence models.
- Server Actions adapt transport; Workflows own use-case sequence; Transaction Helpers own atomic DB facts; Integration Adapters own provider mechanics.
- Provider/network operations do not execute inside database transactions.

### Provider and lifecycle truth

- Provider objects/statuses are normalized rather than copied wholesale into product-domain truth.
- Checkout return/success does not grant entitlement or payment authority.
- Event Ledger existence proves receipt, not successful processing.
- Webhook processing assumes duplicate, concurrent, replayed, and out-of-order delivery.
- Provider/database partial states must be recoverable through durable intent, idempotency, mirrors, audit/recovery, and reconciliation.

### Governance and evidence

- Execution records never override canonical documents/contracts.
- Passed evidence names an executed command/review, environment, result, timestamp/revision, scope, and limitations.
- Expected, inferred, skipped, or blocked checks cannot be represented as executed PASS.

The machine contract lists these and other invalid combinations explicitly so future validators can reject them deterministically.

## Enforcement mapping

| Rule class | Primary enforcement | Proves | Does not prove |
|---|---|---|---|
| Runtime shape | Zod/runtime schemas | declared input shape/semantic rules | authorization or DB containment |
| Compile-time boundary | strict TypeScript/types | compile-time contracts/exhaustiveness | runtime trust |
| Persistence relation | Prisma schema/migrations | declared stored relationships/indexes | complete domain ontology |
| Persisted invariant | PostgreSQL constraints | DB-enforced uniqueness/referential conditions | product authorization |
| Tenant containment | RLS + restricted runtime role + transaction-local context | row containment under tested runtime credentials | business capability legality |
| Dependency boundary | import/AST rules + review | mechanically detectable forbidden dependencies | full semantic correctness |
| Authorization | policies + policy tests | tested actor/capability/resource decisions | RLS configuration |
| Atomic/concurrency behavior | transaction guards + real PostgreSQL tests | rollback/concurrency/version behavior | provider outcome |
| Webhook recovery | uniqueness + lease tx + reconciliation tests | tested replay/lease/idempotency behavior | exactly-once external delivery |
| Provider/domain separation | adapters + mirrors + DTO/schema tests/review | normalized boundary | provider availability |
| Repository conformance | validators + CI + review | checks actually implemented and executed for a revision | unmodeled properties |

## Relationship to adjacent models

- **Terminology** owns approved words for ontology concepts.
- **Taxonomy/facets** classify concept/artifact instances without redefining meaning.
- **Schema** encodes valid shapes for selected ontology concepts; it is not the ontology itself.
- **Domain model** implements product-specific entities, states, and invariants derived from the ontology.
- **Architecture** assigns responsibility/dependency direction among modules implementing the concepts.
- **Topology** explains how those modules/providers/deployments connect.
- **Knowledge graph** may represent ontology instances, especially `source → claim → decision → artifact → validator`.

## Source traceability

| Source | Location | Contribution | Disposition |
|---|---|---|---|
| `Codependent-Coding-Knowledge-System.txt` | §1 / §§1.1–1.8 | entity families, relationships, cardinalities, constraints, states, enforcement mapping | adopted |
| `web-development.knowledge-modeling.ontology-taxonomy.reference(1).md` | ontology, domain modeling, authorization, classification stack | ontology-vs-taxonomy/schema/type/domain-model distinctions | adopted/refined |
| `software-development.system-architecture.terminology.reference(1).md` | system/data/behavior/security/governance terms | canonical concept/boundary language | adopted |
| `How-I-Build-Opinionated-SaaS-Applications.txt` | architecture through security/governance | applied ownership/runtime relationship evidence | adopted; later canonical patterns control narrower boundary differences |
| `vouch.complete-system-documentation.md` | §§0.1–0.12 | reference evidence for truth ownership, runtime flows, lifecycle/provider boundaries, DTO/security/validation | implementation evidence; Vouch-specific product rules excluded |

Exact source fingerprints and corpus reconciliation live in `provenance/source-provenance-ledger.md` and `provenance/synthesis-decisions.md`.

## Completeness rule

A canonical ontology change must synchronize this explanatory owner, `.agents/contracts/ontology.yaml`, affected terminology/architecture/security/lifecycle owners, validation, and provenance. Topic presence alone is not completion: consequential relationships require ownership/cardinality, reusable states require constraints, invalid combinations must be explicit, and enforceable rules must name the mechanism capable of proving them.
