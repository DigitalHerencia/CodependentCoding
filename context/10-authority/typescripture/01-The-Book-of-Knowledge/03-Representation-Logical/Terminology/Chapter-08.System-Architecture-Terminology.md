---
title: Codependent Coding Terminology and Nomenclature
type: reference
scope: domain
project: CodependentCoding
domain: terminology
artifact: terminology-nomenclature
kind: reference
namespace: codependentcoding.docs.terminology-nomenclature.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.knowledge-modeling.reference]]"
supersedes: []
tags:
  - codependentcoding/terminology
  - codependentcoding/nomenclature
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/05-terminology-nomenclature.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: c9885496ee6786a76160bbacda151a736b2dd9dc
source_format: markdown
---
# Terminology and Nomenclature

## Core vocabulary

| Term | Canonical definition | Excludes or replaces |
|---|---|---|
| System | Interacting elements, state, rules, and boundaries producing behavior | a single module |
| Application | One deployed product implementation | architecture or stack |
| Architecture | Significant elements, responsibilities, relationships, boundaries, and decisions | dependency list |
| TechStack | Concrete technologies and tooling used to implement architecture | doctrine |
| Repository | Versioned container of artifacts | runtime system |
| Role | Named bundle of stable capabilities in a scope | identity or resource policy |
| Responsibility | Work and decisions owned by one role/module/layer | incidental behavior |
| Boundary | Separation controlling knowledge, authority, data, or dependency crossing | folder name alone |
| Constraint | Rule limiting permitted structure or behavior | preference without enforcement |
| Invariant | Condition that MUST remain true across legal operations | one-time precondition |
| Contract | Inputs, outputs, guarantees, errors, dependencies, and obligations at a boundary | prose aspiration |
| Interface | Exposed surface through which a module is used | implementation internals |
| Module | Cohesive implementation unit with controlled exports | arbitrary file collection |
| Component | Composable presentation or system part with a defined responsibility | feature orchestration |
| Layer | Responsibility group with controlled dependency direction | directory without contract |
| Abstraction | Stable simplified model hiding irrelevant detail | speculative generalization |
| Tenant | Architectural ownership and isolation boundary | mandatory product noun |
| Organization | Canonical reference tenant entity | Clerk Organization as automatic product truth |
| Account | Context-specific identity or commercial record; MUST be qualified | tenant synonym |
| Team/Workspace/Business | Allowed tenant nouns only after coherent schema/code/docs/test reset | casual aliases |
| User | Local application identity | Clerk object or membership |
| Principal | Identity evaluated by a security system; use only in security context | default synonym for User |
| Membership | Scoped relation between User and Organization | role or user profile |
| Authentication | Establishing who/what calls | authorization |
| Authorization | Deciding permitted action in context | UI visibility |
| Capability | Stable business-operation vocabulary | route/component name |
| Permission | A granted capability in a particular model; prefer `Capability` for code vocabulary | raw role comparison |
| Policy | Pure or bounded decision logic over facts | provider readiness or transition guard |
| Readiness | Operational/provider prerequisite | authorization |
| RLS | PostgreSQL containment enforcing row access | complete product authz |
| Fetcher | Self-securing, server-only protected read use case returning DTOs | generic fetch/API wrapper |
| Server Action | Thin Next.js mutation adapter | workflow, transaction, or service layer |
| Workflow | Named application use-case coordinator | generic utility/service bag |
| Transaction Helper | Function accepting a transaction client and preserving atomic DB invariants | any write with `Tx` suffix |
| Query | Authorized-scope persistence read mechanic | exported protected read boundary |
| Command | Trusted persistence write mechanic outside a larger atomic unit | user intent or workflow |
| Select | Explicit Prisma projection | UI view model |
| DTO | Stable constrained transport representation | Prisma model |
| Mapper | Pure representation translation | data access |
| Schema | Runtime or storage shape constraint, qualified by kind | domain ontology |
| Type | Compile-time contract | runtime validation |
| Model | MUST be qualified: domain, persistence, provider, or presentation | ambiguous catch-all |
| Entity | Identity-bearing domain concept | DTO or row by default |
| Route | URL/HTTP/framework adapter | page experience or business layer |
| Page | Route-rendered user surface | route file alone |
| Feature | Server-first product-experience orchestration | data layer |
| Block | Reusable pure presentation composition | feature/workflow |
| Primitive | Lowest domain-agnostic UI element | product component |
| Client feature | Deliberate browser-interactive island supplied safe state/actions | client-side application authority |
| Integration adapter | Provider-mechanics boundary with normalized results | product authorization |
| Webhook processor | Durable verified event reconciliation system | simple event callback |
| Validation | Determines whether input/artifact meets a rule | proof of all correctness |
| Verification | Confirms an expected property using evidence | synonym for runtime parsing |
| Test | Executable evidence for specified behavior | universal proof |
| Conformance | Degree an implementation satisfies canonical doctrine/contracts | test pass alone |
| Acceptance | Human/product determination that scoped requirements are met | architecture correctness alone |

## Nomenclature

- Files use kebab-case plus responsibility suffix: `get-project-detail.fetcher.ts`, `archive-project.action.ts`, `archive-project.workflow.ts`, `archive-project.tx.ts`, `project.selects.ts`, `project.dto.ts`, `project.policy.ts`.
- React exports use PascalCase; functions use verb-first camelCase; types use PascalCase; constants use `UPPER_SNAKE_CASE` only for true constants.
- Capabilities use `<resource>.<operation>[.<scope>]`, for example `project.read.own` or `billing.manage`.
- Domain events use past-tense `<aggregate>.<event>`, for example `invoice.issued`; commands/workflows use imperative verbs.
- Error codes use stable `UPPER_SNAKE_CASE`; safe messages are separate from internal causes.
- Environment variables use `UPPER_SNAKE_CASE`; browser-exposed variables require the framework's public prefix and explicit allowlisting.
- Provider-prefixed fields (`stripeCustomerId`) are allowed only for bounded mirrors/integration records. Domain vocabulary remains provider-neutral.
- `Project` is a removable sample domain and MUST NOT serve as a hidden tenant, membership, or billing boundary.

Deprecated broad terms—`service`, `manager`, `helper`, `utils`, `getData`, `saveThing`, `admin user`, and bare `account`—are forbidden for new canonical interfaces unless narrowed by a documented domain meaning.
