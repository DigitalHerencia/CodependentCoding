---
title: Codependent Coding Conflict Resolution Register
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: conflict-resolution
kind: reference
namespace: codependentcoding.provenance.conflict-resolution.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.docs.epistemology.reference]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/conflicts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/conflict-resolution.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 3a6044ee2f82a564b371dd78bf188da3c90f9299
source_format: markdown
---
# Conflict Resolution Register

| ID | Competing claims | Resolution | Basis | Consequence |
|---|---|---|---|---|
| CON-001 | Codependent Coding is an agent implementation system vs the Bible itself | Knowledge System identity controls; agent execution is one contained subsystem | explicit current instruction outranks older project definition | agent docs no longer define whole identity |
| CON-002 | Loaded Vibes is only a generator vs Loaded Vibes is WebApp Architecture | Architecture is canonical identity; generator is a delivery mechanism that instantiates it | current hierarchy and scope | project docs reclassified as generator implementation evidence |
| CON-003 | Hipster Stack is an engineering system/doctrine vs a TechStack | It is concrete substrate; reusable patterns are governed by Codependent Coding™ and organize use of the stack | controlling hierarchy | prevents stack/doctrine collapse |
| CON-004 | Feature may perform page reads vs components may call fetchers directly | Server feature/loaders may call secure fetchers; pure UI components may not | route-feature and layer contracts | preserves RSC orchestration without UI data leakage |
| CON-005 | Actions perform authorization vs workflows authorize resources | Actions establish Actor; workflows authorize actual resource/current state; fetchers authorize their reads | action/workflow/auth sources | avoids duplicated incomplete checks |
| CON-006 | Application authz vs RLS as authority | Application authz decides; RLS contains | auth and security invariants | both are mandatory but non-duplicative |
| CON-007 | Existing webhook row means duplicate complete vs status/lease controls completion | Existing row proves receipt only; terminal status proves completion; lease controls ownership | webhook source | duplicates/failed/stale events remain safe and recoverable |
| CON-008 | Stripe redirect vs webhook/local entitlement authority | Redirect is presentation only; verified normalized local state controls product access | system and Stripe contracts | success page cannot grant access |
| CON-009 | Provider status may be domain lifecycle status vs separate models | Provider mirror, operation, and domain lifecycles remain distinct and explicitly mapped | lifecycle/webhook sources | avoids provider-domain state collapse |
| CON-010 | Next.js Server Component can query DB vs architecture requires fetcher | Capability does not establish ownership; protected application reads use fetchers | fetcher doctrine and layer contract | no direct Prisma in routes/features/components |
| CON-011 | Client action visibility is authz vs presentation only | UI may hide/disable, but action/workflow reauthorizes | auth and route-feature sources | no client-trusted authority |
| CON-012 | Pre-commit hooks vs PR validation | Hooks optional; repository scripts and PR/CI are authoritative | engineering-system source | low-friction local workflow without weakened gate |
| CON-013 | `Project` as common sample vs tenant/business kernel | Project is removable sample only | controlling tenant contract | generated product cannot hide tenancy/billing in sample domain |
| CON-014 | Vouch implementation constraints as generic doctrine | Promote only reusable compatible boundaries; keep routes/lifecycle/copy/product rules project-specific | source authority model | reference implementation cannot silently redefine architecture |

Every identified material conflict has one selected outcome. No alternative in this register remains simultaneously canonical.
---
title: Codependent Coding Knowledge-System Definition
type: source-document
scope: domain
project: CodependentCoding
domain: knowledge-system
artifact: definition
kind: source-document
namespace: codependentcoding.docs.knowledge-system-definition.source-document
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.system-map.map]]"
supersedes: []
tags:
  - codependentcoding/knowledge-system
  - codependentcoding/definition
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/01-knowledge-system-definition.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 9e5ab9df945b7363a94029425b5987e2d6b5d313
source_format: markdown
---
# Knowledge-System Definition

## Identity

The Codependent Coding™ Knowledge System is the authoritative model of the Loaded Vibes™ WebApp Architecture using the Hipster Stack™ TechStack. It is a connected system of concepts, definitions, decisions, patterns, constraints, procedures, and evidence—not a handbook-shaped rule list.

It defines:

- what entities and artifacts exist;
- what each term means and what it excludes;
- how parts relate, depend, compose, and own state;
- how truth and source authority are established;
- how applications are decomposed, built, tested, deployed, operated, and changed;
- how humans and agents may act;
- how violations, exceptions, decisions, and evidence are recorded;
- how conformance is demonstrated.

## Intended users

Product owners use it to express intent without reopening platform decisions. Engineers use it to locate responsibilities and implement safely. Reviewers use it to evaluate architecture and evidence. Operators use it to understand truth, recovery, and observability. Agents use it as bounded authority for planning and execution. Generator maintainers use it to derive Loaded Vibes™ output.

## Scope

Included: opinionated server-first TypeScript SaaS architecture; product and engineering doctrine; knowledge modeling; multi-tenancy; identity; authorization; RLS; data, integration, presentation, lifecycle, testing, delivery, governance, and agent execution.

Excluded: generic tutorials; universal framework advice; product-specific business doctrine; secret values; production credentials; a promise that every supported technology is mandatory in every product; and implementation details without architectural consequence.

## Canonical states

Artifacts are either `canonical`, `supporting`, `implementation-evidence`, `project-specific`, `legacy`, `superseded`, or `operational`. Only canonical artifacts and accepted decisions create doctrine. Supporting references explain it. Evidence tests it. Legacy and superseded material remain traceable but non-authoritative.

## Change rule

A canonical change MUST identify the owner artifact, reason, affected terms/contracts/lifecycles/tests, migration impact, and evidence. It MUST update one canonical definition rather than creating a competing definition. Exceptions MUST be narrow, time-bounded when possible, owned, and detectable.

## Sufficiency standard

The system is sufficient when a technically capable reader or constrained agent can predict and reproduce the architecture's decisions, implement a product-specific change without inventing a competing structure, and prove the result. Surface similarity without boundary, authority, lifecycle, or validation fidelity is non-conforming.
---
title: Codependent Coding Source-to-Repository Coverage Matrix
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: coverage-matrix
kind: reference
namespace: codependentcoding.provenance.coverage-matrix.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.manifest.map]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/coverage
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/coverage-matrix.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 9462573a590fafde6f909869f325d19b6df9271b
source_format: markdown
---
# Source-to-Repository Coverage Matrix

This matrix answers the useful question: **does the repository actually describe the complete build system?** It is a human coverage map, not a test report.

## Required domain coverage

| Required domain | Canonical owner | Coverage |
|---|---|---|
| System identity and scope | [[codependentcoding.readme.source-document]], [[codependentcoding.docs.knowledge-system-definition.source-document]] | Covered |
| Engineering philosophy/doctrine | [[codependentcoding.docs.engineering-doctrine.source-document]] | Covered |
| Epistemology and source authority | [[codependentcoding.docs.epistemology.reference]] | Covered |
| Knowledge modeling | [[codependentcoding.docs.knowledge-modeling.reference]], ontology contract | Covered |
| Terminology/nomenclature | [[codependentcoding.docs.terminology-nomenclature.reference]] | Covered |
| Loaded Vibes™ architecture | [[codependentcoding.docs.loaded-vibes-architecture.source-document]] | Covered |
| Hipster Stack™ technologies | [[codependentcoding.docs.hipster-stack-tech.map]] | Covered |
| Layer contracts/dependency direction | [[codependentcoding.docs.layer-contracts.contract]], architecture contract | Covered |
| Runtime/system lifecycles | [[codependentcoding.docs.system-lifecycles.contract]], Pattern 09 | Covered |
| Authentication/authorization/RLS/security | [[codependentcoding.docs.security-model.contract]], Pattern 05 | Covered |
| Protected reads | Pattern 01 plus supporting data patterns | Covered |
| Server Actions/mutations | Pattern 02 | Covered |
| Application workflows | Pattern 03 | Covered |
| Transactions/concurrency | Pattern 04 | Covered |
| Webhooks/reconciliation | Pattern 06 | Covered |
| Route/feature orchestration | Pattern 07 | Covered |
| Data contracts/selects/DTOs/schemas/types | supporting data patterns | Covered |
| Presentation/client islands/components/pages/errors | supporting presentation patterns | Covered |
| Configuration/environment/cache | supporting infrastructure patterns | Covered |
| Provider/integration adapters | supporting infrastructure patterns | Covered |
| Observability/logging | supporting infrastructure patterns | Covered |
| Testing/validation | [[codependentcoding.docs.validation-conformance.contract]], supporting quality patterns | Covered |
| Deployment/delivery | supporting quality patterns | Covered |
| Governance/specification | [[codependentcoding.docs.governance-model.contract]], [[codependentcoding.docs.specification-model.contract]], Pattern 10 | Covered |
| Agent execution | [[codependentcoding.docs.agent-execution.execution]] | Covered |
| Reference implementation relationship | [[codependentcoding.docs.reference-implementations.reference]] | Covered |
| Source provenance/conflict reconciliation | [[codependentcoding.provenance.readme.reference|provenance]] | Covered |

## Source coverage

The source ledger records the complete mandatory corpus used for synthesis, including the first-person build doctrine, Codependent Coding knowledge-system specification, Vouch implementation documentation, Hipster Stack pattern references, terminology/knowledge-modeling references, engineering-practice model, system definition, and tech-stack map.

Dense source relationships are further documented in the ontology, lifecycle, pattern, and contract traceability notes.

## Boundary

Coverage means the canonical topic has an owning document or pattern. It does not mean every possible product-specific implementation choice has been frozen into universal doctrine. Product-specific behavior belongs in the generated application's PRD, specifications, ADRs, and tests.
---
title: Codependent Coding Synthesis Decision Register
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: synthesis-decisions
kind: reference
namespace: codependentcoding.provenance.synthesis-decisions.reference
status: active
authority: reference
parent: "[[codependentcoding.provenance.readme.reference]]"
depends_on:
  - "[[codependentcoding.provenance.source-provenance-ledger.reference]]"
  - "[[codependentcoding.provenance.conflict-resolution.reference]]"
supersedes: []
tags:
  - codependentcoding/provenance
  - codependentcoding/decisions
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/synthesis-decisions.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 033b4fea26eadb69423cb475289b7ecaa90da88d
source_format: markdown
---
# Synthesis Decision Register

This register owns durable consequential decisions made while reconciling the source corpus. It records *why* the canonical system says what it says without requiring a second operational mirror or validator.

| ID | Subject | Final decision | Status |
|---|---|---|---|
| SYN-001 | System identity | Codependent Coding™ is the knowledge system, Loaded Vibes™ the architecture, Hipster Stack™ the implementation substrate. | Canonical |
| SYN-002 | Tenant naming | Tenant is the abstraction; Organization is the reference noun unless an ADR coherently renames the boundary. | Canonical |
| SYN-003 | Workflow placement | Domain workflows own application use cases; reference placement is `lib/<domain>/workflows`. | Canonical |
| SYN-004 | DTO naming | Canonical persistence-to-transport placement is `lib/db/dto`; mapper remains the function role. | Canonical |
| SYN-005 | Pattern catalog | Preserve ten major patterns and twenty supporting patterns under a common pattern contract. | Canonical |
| SYN-006 | RLS | Protected tenant tables use RLS with a restricted non-owning runtime role and transaction-local tenant context. | Canonical |
| SYN-007 | Webhook payloads | Persist bounded sanitized event evidence by default; unrestricted raw provider payloads require explicit policy. | Canonical |
| SYN-008 | Source conflicts | Resolve by authority/precedence and record consequential decisions; escalate only unresolved equal-authority/product questions. | Canonical |
| SYN-009 | Caching | Fresh security/payment/tenant state is the default; persistent caches require explicit scope, freshness, invalidation, failure, and proof rules. | Canonical |
| SYN-010 | Knowledge-repository validator | A repository self-validation harness was introduced during remediation, then deliberately retired because the repository's product is the knowledge itself. Generated applications own runtime validation. | Superseded |
| SYN-011 | Historical repository identity | Current knowledge-system identity controls; legacy CodependentCoding material is provenance/reference evidence rather than active doctrine. | Canonical |
| SYN-012 | Initially unavailable sources | Later recovered mandatory sources were read and reconciled; historical unavailability is no longer a content blocker. | Resolved |
| SYN-013 | Workflow framework effects | Workflows stay framework-neutral and return intent; Server Actions/routes own cache/navigation effects. | Canonical refinement |
| SYN-014 | Vouch specificity | Vouch is implementation evidence. Generic trust, reconciliation, lifecycle, DTO, and idempotency lessons may be adopted; Vouch-specific roles/routes/state machines do not become universal doctrine. | Canonical |
| SYN-015 | Formal completeness | Broad topic coverage is not enough for dense domains; ontology, lifecycle, pattern, and contract definitions must be explicit where the knowledge model requires them. | Canonical |
| SYN-016 | Machine repository manifest | The remediation-era checksum/dependency manifest was useful for defect verification but is not necessary to operate the knowledge system; `MANIFEST.md` is now a simple human repository map. | Superseded |
| SYN-017 | Release checksum system | Deterministic release/checksum machinery satisfied the historical artifact defect, but it is not retained as permanent knowledge-repository infrastructure. | Superseded |
| SYN-018 | Repository simplicity | Preserve doctrine, architecture, patterns, contracts, decisions, and source provenance. Do not maintain CI/checksum/validator machinery whose primary purpose is proving that the documentation repository exists. | Canonical |
---
title: Codependent Coding Repository Agent Guide
type: execution
scope: domain
project: CodependentCoding
domain: agent-execution
artifact: repository-guide
kind: execution
namespace: codependentcoding.agents.execution
status: active
authority: derived
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.engineering-doctrine.source-document]]"
  - "[[codependentcoding.docs.loaded-vibes-architecture.source-document]]"
  - "[[codependentcoding.docs.layer-contracts.contract]]"
  - "[[codependentcoding.docs.system-lifecycles.contract]]"
  - "[[codependentcoding.docs.security-model.contract]]"
supersedes: []
tags:
  - codependentcoding/agents
  - codependentcoding/execution
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: AGENTS.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 99a746997265d7fa099929c873823988502cd3f6
source_format: markdown
---
# Repository Agent Guide

## Purpose

This repository is the canonical Codependent Coding™ Knowledge System. Its job is to explain how the Loaded Vibes™ WebApp Architecture is built using the Hipster Stack™ TechStack. Treat the written doctrine, architecture, patterns, contracts, decisions, and source provenance as the product.

## Read first

1. [[codependentcoding.readme.source-document]]
2. [[codependentcoding.docs.engineering-doctrine.source-document]]
3. [[codependentcoding.docs.loaded-vibes-architecture.source-document]]
4. [[codependentcoding.docs.layer-contracts.contract]]
5. [[codependentcoding.docs.system-lifecycles.contract]]
6. [[codependentcoding.docs.security-model.contract]]
7. [[codependentcoding.patterns.catalog.map]]
8. The affected pattern or supporting-pattern note
9. [[codependentcoding.agents.contracts.architecture.contract]], [[codependentcoding.agents.contracts.product.contract]], and [[codependentcoding.agents.contracts.ontology.contract]] when machine-readable constraints matter
10. [[codependentcoding.provenance.synthesis-decisions.reference]] and [[codependentcoding.provenance.conflict-resolution.reference]] when sources disagree

## Architectural source of truth

Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

## Operating rules

- Preserve the documented layer boundaries, tenant model, security invariants, provider isolation, and server-first presentation model.
- Make the smallest change that keeps the knowledge system internally coherent.
- When a public architectural boundary changes, update the owning document, affected patterns, and machine-readable contract together.
- Use [[codependentcoding.provenance.source-provenance-ledger.reference]], [[codependentcoding.provenance.synthesis-decisions.reference]], and [[codependentcoding.provenance.conflict-resolution.reference]] to resolve source questions.
- Do not manufacture evidence, invent product requirements, or silently promote one reference implementation into universal doctrine.
- Do not expose secrets or raw production payloads.
- Generated SaaS applications own their own lint, typecheck, unit, integration, database/RLS, browser, accessibility, security, build, and deployment tests. This documentation repository does not maintain a parallel test harness for proving that its Markdown exists.

## Completion

For knowledge-system edits, review the changed files for coherence, broken references, placeholders, and contradictions. For implementation work in a generated or reference application, run that application's real engineering gates. Do not confuse documentation inspection with runtime proof.
---
title: Codependent Coding Provenance
type: reference
scope: domain
project: CodependentCoding
domain: provenance
artifact: readme
kind: reference
namespace: codependentcoding.provenance.readme.reference
status: active
authority: reference
parent: "[[codependentcoding.manifest.map]]"
depends_on: []
supersedes: []
tags:
  - codependentcoding/provenance
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: provenance/README.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: db8aef98b0fc9f855c10d51d096641cd09deb2df
source_format: markdown
---
# Provenance

This namespace records where the knowledge system came from and how conflicting source material was reconciled. It exists to make the doctrine understandable, not to turn source citations into a runtime subsystem.

## Artifact roles

- [[codependentcoding.provenance.source-provenance-ledger.reference]] inventories the source corpus, source roles, contributions, and broad dispositions.
- [[codependentcoding.provenance.synthesis-decisions.reference]] records durable reconciliation decisions.
- [[codependentcoding.provenance.conflict-resolution.reference]] records explicit source conflicts and their selected outcomes.
- [[codependentcoding.provenance.ontology-traceability.reference]], [[codependentcoding.provenance.lifecycle-traceability.reference]], [[codependentcoding.provenance.pattern-traceability.reference]], and [[codependentcoding.provenance.contract-traceability.reference]] show focused source-to-model relationships for dense domains.
- [[codependentcoding.provenance.coverage-matrix.reference]] provides a human-readable source/domain coverage summary.

## Dispositions

Source material may be adopted, refined, superseded, rejected, consolidated, or treated as implementation evidence. Higher-authority controlling doctrine wins over narrower reference-implementation behavior unless a later recorded decision deliberately changes the canon.

## Practical use

When a question arises about why a rule exists, start with the owning canonical document, then consult the synthesis decision and source ledger. Use the specialized traceability notes when the topic is ontology, lifecycles, pattern completeness, or machine contracts.
---
title: Codependent Coding Knowledge System
type: source-document
scope: domain
project: CodependentCoding
domain: knowledge-system
artifact: readme
kind: source-document
namespace: codependentcoding.readme.source-document
status: active
authority: source-of-truth
parent:
depends_on:
  - "[[codependentcoding.manifest.map]]"
supersedes: []
tags:
  - codependentcoding/knowledge-system
  - codependentcoding/source
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: README.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 68f08cbc8829be219266904b65c399ff87a2ec4f
source_format: markdown
---
# Codependent Coding™ Knowledge System

## The Authoritative Model of the Loaded Vibes™ WebApp Architecture Using the Hipster Stack™ TechStack

The **Codependent Coding™ Knowledge System** is the canonical body of knowledge for understanding, designing, implementing, governing, validating, operating, and evolving the opinionated multi-tenant B2B SaaS systems defined here.

> **Codependent Coding™ explains and governs how software is understood and built. Loaded Vibes™ defines the architectural form of the application. Hipster Stack™ supplies the technologies used to construct it.**

## Authority

This repository is normative unless an artifact explicitly says it is descriptive or implementation evidence. Authority descends from current human instruction and the knowledge-system doctrine into approved specifications and machine contracts, then architecture, patterns, lifecycles, and reference implementations. Implementation never silently overrules doctrine.

## Intended software class

The architecture targets production-oriented, server-first, multi-tenant B2B SaaS applications built with the Hipster Stack™. It favors explicit state ownership, tenant containment, typed boundaries, recoverable external operations, and narrow agent execution. It is not generic Next.js boilerplate, a component library, or a mandate to use every supported integration in every product.

## Canonical grammar

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

The expanded ownership model is defined in [[codependentcoding.docs.loaded-vibes-architecture.source-document|Loaded Vibes™ Architecture]], [[codependentcoding.docs.layer-contracts.contract|Layer Contracts]], and the [[codependentcoding.patterns.catalog.map|Pattern Catalog]].

## Reading order

1. [[codependentcoding.manifest.map|Repository Map]]
2. [[codependentcoding.docs.system-map.map|System Map]]
3. [[codependentcoding.docs.knowledge-system-definition.source-document|Knowledge-System Definition]]
4. [[codependentcoding.docs.engineering-doctrine.source-document|Engineering Doctrine]]
5. [[codependentcoding.docs.epistemology.reference|Epistemology]]
6. [[codependentcoding.docs.knowledge-modeling.reference|Knowledge Modeling]]
7. [[codependentcoding.docs.terminology-nomenclature.reference|Terminology and Nomenclature]]
8. [[codependentcoding.docs.loaded-vibes-architecture.source-document|Loaded Vibes™ Architecture]]
9. [[codependentcoding.docs.hipster-stack-tech.map|Hipster Stack™ Technology Map]]
10. [[codependentcoding.docs.layer-contracts.contract|Layer Contracts]]
11. [[codependentcoding.docs.system-lifecycles.contract|System Lifecycles]]
12. [[codependentcoding.docs.security-model.contract|Security Model]]
13. [[codependentcoding.patterns.catalog.map|Pattern Catalog]]
14. [[codependentcoding.docs.governance-model.contract|Governance]], [[codependentcoding.docs.specification-model.contract|Specifications]], [[codependentcoding.docs.validation-conformance.contract|Validation]], and [[codependentcoding.docs.agent-execution.execution|Agent Execution]]
15. [[codependentcoding.docs.reference-implementations.reference|Reference Implementations]] and [[codependentcoding.provenance.readme.reference|Provenance]]

## Non-negotiable invariants

- Every protected operation authenticates, authorizes, validates, and preserves tenant scope at its authoritative boundary.
- Browser-supplied actor, tenant, role, capability, provider identifier, price, customer, connected-account, or return URL data is never trusted as authority.
- Runtime database credentials are pooled, restricted, non-owning, and incapable of bypassing RLS.
- Protected reads enter through self-securing fetchers; UI mutations enter through thin Server Actions that delegate to workflows.
- Prisma and SQL remain inside approved data-layer modules. Provider SDKs remain inside integration adapters.
- Cross-system mutations use stable idempotency, durable operation state, reconciliation, and recovery; database transactions never remain open across network calls.
- Provider webhooks are signature-verified, durably recorded, atomically claimed, idempotently reconciled, and recoverable.
- Presentation receives stable DTO/display contracts; generated Prisma models, provider objects, secrets, and unrestricted payloads do not escape their owning boundaries.
- Completion claims distinguish implementation, inspection, and executed runtime validation.

## Repository use

Humans use the Markdown to understand intent and approve changes. Agents begin with [[codependentcoding.agents.execution|AGENTS]], load the affected canonical documents and contracts, implement the smallest correct change, and validate actual application behavior in the application being changed. Machines may consume the YAML contracts where useful, but the contracts support the doctrine rather than turning this repository into a software product of its own.

Source inventory, synthesis decisions, conflict resolutions, and coverage notes live in [[codependentcoding.provenance.readme.reference|Provenance]].
