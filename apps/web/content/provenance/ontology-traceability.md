# Ontology Source Traceability

This evidence matrix supports `DEF-HIGH-008` by mapping the controlling ontology requirements to the canonical explanatory owner and deterministic ontology contract. It is intentionally scoped to ontology completeness. Atomic provenance for the entire repository remains a separate remediation concern under `DEF-HIGH-009`.

## Controlling specification mapping

| Source requirement | Required subject | Canonical destination | Deterministic destination | Relationship / enforcement coverage | Disposition |
|---|---|---|---|---|---|
| `Codependent-Coding-Knowledge-System.txt` §1.1 | System-level entities | `docs/04-knowledge-modeling.md` → Formal entity catalog → System-level | `.agents/contracts/ontology.yaml` → `entities.system` | `ONT-R01`–`ONT-R04` establish Knowledge System/Architecture/TechStack/Application/Repository relationships | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.2 | Identity and tenancy entities | `docs/04-knowledge-modeling.md` → Identity and tenancy | `.agents/contracts/ontology.yaml` → `entities.identity-tenancy` | `ONT-R05`–`ONT-R08`; tenant/auth invariants; membership and actor state models | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.3 | Application-layer entities | `docs/04-knowledge-modeling.md` → Application-layer | `.agents/contracts/ontology.yaml` → `entities.application-layer` | `ONT-R09`–`ONT-R18`; layer and transaction invalid combinations; provider boundary invariants | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.4 | Commercial/provider entities | `docs/04-knowledge-modeling.md` → Commercial and provider | `.agents/contracts/ontology.yaml` → `entities.commercial-provider` | `ONT-R19`–`ONT-R20`; provider/domain separation; redirect-authority prohibition | Adopted with optional-module scope |
| `Codependent-Coding-Knowledge-System.txt` §1.5 | Governance entities | `docs/04-knowledge-modeling.md` → Governance | `.agents/contracts/ontology.yaml` → `entities.governance` plus system `specification` | `ONT-R21`–`ONT-R23`; execution/canon and evidence-truth invariants | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.6 | Relationships | `docs/04-knowledge-modeling.md` → Formal relationships and cardinality | `.agents/contracts/ontology.yaml` → `relationships` | Stable relationship IDs identify subject, predicate, object/context, cardinality, and owner | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.7 | Formal constraints | `docs/04-knowledge-modeling.md` → State families; Invariants and invalid combinations | `.agents/contracts/ontology.yaml` → `state_models`, `invariants`, `invalid_combinations` | Reusable states, ownership/tenant constraints, prohibited combinations, lifecycle boundary | Adopted |
| `Codependent-Coding-Knowledge-System.txt` §1.8 | Machine-enforcement mapping | `docs/04-knowledge-modeling.md` → Enforcement mapping | `.agents/contracts/ontology.yaml` → `enforcement_classes` and invariant `enforcement` arrays | TypeScript, Zod, Prisma, PostgreSQL constraints, RLS, architecture rules, authorization/transaction/webhook tests, CI with proof limits | Adopted |

## Corroborating source mapping

| Source | Evidence location | Ontology contribution | Destination / decision |
|---|---|---|---|
| `web-development.knowledge-modeling.ontology-taxonomy.reference(1).md` | Core distinction; Ontology; Ontology vs database schema/type system; Domain modeling; Authorization; Practical classification stack | Distinguishes ontology from taxonomy, persistence schema, type system, domain model, terminology, topology, and knowledge graph | `docs/04-knowledge-modeling.md` knowledge-model stack and adjacent-model section; `.agents/contracts/ontology.yaml` `model_relationships` |
| `software-development.system-architecture.terminology.reference(1).md` | Core software/system; Domain/data; Behavior/lifecycle; Security/authority; Governance/quality terms | Canonical meanings for roles, boundaries, contracts, entities, DTOs, workflows, actors, capabilities, policies, tenants, evidence, validation | Entity definitions in `docs/04-knowledge-modeling.md` and `.agents/contracts/ontology.yaml`; vocabulary remains owned by `docs/05-terminology-nomenclature.md` |
| `How-I-Build-Opinionated-SaaS-Applications.txt` | Architecture Overview; Authentication; Authorization/RBAC; Fetchers; Actions/Workflows; Transactions; Integrations; Webhooks; Governance/Security | Applied evidence for ownership, tenant membership, provider/domain separation, read/write/reconciliation relationships | Adopted where consistent; later Golden patterns/current contracts control narrower framework-effect and RLS wording per `SYN-013` |
| `vouch.complete-system-documentation.md` | §§0.1–0.12 | Reference-implementation evidence for truth ownership, read/write/webhook topology, provider separation, state/lifecycle discipline, DTO/security/validation boundaries | Treated as implementation evidence; Vouch-specific participant roles, routes, confirmation protocol, lifecycle values, and settlement rules are not generalized per `SYN-014` |

## Entity-family completeness

| Required family | Required entities from controlling source | Deterministic coverage |
|---|---|---|
| System | Knowledge System, WebApp Architecture, TechStack, Application, Product, Repository, Module, Domain, Feature, Route, Component, Operation, Workflow, Integration, Provider, Contract, Specification, Pattern, Constraint, Validation, Evidence | `entities.system` |
| Identity / tenancy | Identity, Actor, User, Tenant, Organization, Membership, Role, Capability, Permission, Resource, Policy, Scope, Ownership | `entities.identity-tenancy` |
| Application layer | Route Adapter, Feature Orchestrator, Presentation Component, Fetcher, Server Action, Application Workflow, Transaction Helper, Authorization Policy, Runtime Schema, Database Select, DTO, DTO Mapper, Integration Adapter, Webhook Route, Event Ledger, Webhook Processor, Outbox Record, Audit Record, Recovery Record | `entities.application-layer` |
| Commercial / provider | Customer, Subscription, Plan, Price, Entitlement, Checkout Session, Billing Portal Session, Connected Account, Payment, Provider Event, Provider Mirror, Reconciliation | `entities.commercial-provider` |
| Governance | PRD, Technical Requirement, Architecture Contract, Design Contract, Validation Contract, Specification, Decision, Issue, Pull Request, Acceptance Criterion, Progress Record, Handoff Record, ADR, Canonical Pattern | `entities.governance` plus `entities.system.specification` |

## Acceptance-evidence closure

| Acceptance property | Evidence |
|---|---|
| Required entities explicitly defined | `docs/04-knowledge-modeling.md` formal entity catalog; `.agents/contracts/ontology.yaml` entity records; entity-family completeness table above |
| Relationships and ownership explicit | `docs/04-knowledge-modeling.md` `ONT-R01`–`ONT-R23`; machine `relationships[*].owner` |
| Cardinalities explicit where meaningful | Human relationship table and machine `cardinality` fields |
| Valid states and constraints explicit | Human state-family table; machine `state_models` |
| Invariants / invalid combinations explicit | Human invariant sections; machine `invariants` and `invalid_combinations` |
| Enforcement locations mapped | Human enforcement table; machine enforcement arrays and `enforcement_classes` |
| Taxonomy/schema/domain model/architecture relationships explicit | Human adjacent-model section; machine `model_relationships` |
| Deterministic representation | `.agents/contracts/ontology.yaml` |

## Scope boundary

This matrix proves source-to-ontology coverage for the #12 acceptance contract. It does not claim:

- that the current repository validator fully parses or schema-validates YAML;
- that every repository claim has atomic provenance;
- that lifecycle, supporting-pattern, product/architecture/validation contract, or release defects are closed;
- that the historical 323-requirement independent verification suite has passed.

Those properties remain governed by their own open remediation Issues.
