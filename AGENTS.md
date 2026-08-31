# Codependent Coding Agent Directory

This repository is **The Codependent Coding™ WebApp Architecture**. Use this file as the directory, not as a second copy of the architecture.

## Authority order

1. Current explicit owner instruction.
2. `content/TypeScripture_The-Book-of-Knowledge/` for canonical meaning, authority, definitions, relationships, invariants, decision rules, and evidence semantics.
3. `content/TypeScripture_The-Book-of-Implementation/` for canonical realization: placement, interfaces, schemas, workflows, configuration, and executable validation.
4. `context/docs/` and `context/specs/` for Codependent Coding product-specific requirements, domain/generation definitions, design, security, catalogs, and reference implementations.
5. Current repository implementation as compatibility evidence.
6. Historical/superseded material as provenance only.

When equal-level sources conflict, prefer the newer explicit authority. Preserve real compatibility constraints as evidence; do not invent a parallel concept just because a stale name survived in a file.

## Machine contracts

Read these before substantial changes:

| Contract | Owns |
|---|---|
| `.agents/contracts/application.yaml` | Product identity, authority graph, architecture, repository topology, product family, security, generation, Simples/Ontologies, Maximal Template boundaries. |
| `.agents/contracts/validation.yaml` | Evidence semantics, structural rules, import/layer rules, security/generation checks, validation profiles, safe fixer policy. |
| `.agents/contracts/design.yaml` | Visual language, tokens, page compositions, responsive behavior, accessibility, interaction states, mockup mapping. |

The `.yaml` files intentionally use the **YAML 1.2 JSON-compatible subset**. They are valid YAML and can be parsed by repository Node scripts without adding another parser dependency.

## Execution state

`.agents/execution/` is temporary operational evidence, never durable architecture.

| File | Purpose |
|---|---|
| `decisions.json` | Active reconciliations/decisions plus superseded execution history. |
| `progress.json` | What is actually complete, observed, verified, remaining, or blocked. |
| `handoff.json` | Minimum state the next agent needs to resume safely. |

## Product documentation

| Document | Read when |
|---|---|
| `context/docs/PRD.md` | Product scope, users, surfaces, functional requirements. |
| `context/docs/Architecture.md` | Codependent Coding system/product architecture and current repository mapping. |
| `context/docs/tech-requirements.md` | Framework, routes, repository shape, performance, accessibility, validation. |
| `context/docs/AUTH.md` | Public/authenticated boundary, authorization, secrets, trust boundaries. |
| `context/docs/Design.md` | Visual and interaction specification. |

## Canonical product-family specs

### Anthimeria

- `context/specs/anthimeria/Anthimeria.Authoritative-Source-Spec.md`
- `context/specs/anthimeria/Anthimeria.Canonical-Catalog.md`
- `context/specs/anthimeria/Anthimeria.Generic-Reference-Implementation.md`
- `context/specs/anthimeria/README.md`

### Generation

- `context/specs/generation/GenerationPipeline/Generation-Pipeline.Authoritative-Integration-Spec.md`
- `context/specs/generation/GenerationPipeline/Generation-Pipeline.State-and-Authority-Matrix.md`
- `context/specs/generation/GenerationPipeline/Generation-Pipeline.Codex-Reference-Implementation.md`
- `context/specs/generation/GenerationPipeline/README.md`
- `context/specs/generation/HipsterStack/Hipster-Stack.Authoritative-Source-Spec.md`
- `context/specs/generation/HipsterStack/Hipster-Stack.Virgule-Application-Definition.md`
- `context/specs/generation/HipsterStack/Hipster-Stack.CLI-Generator-Contract.md`
- `context/specs/generation/HipsterStack/README.md`
- `context/specs/generation/MaximalTemplateArrangement/Maximal-Template.Authoritative-Domain-Library-Spec.md`
- `context/specs/generation/MaximalTemplateArrangement/Maximal-Template-Arrangement.Materialization-and-Ownership.md`
- `context/specs/generation/MaximalTemplateArrangement/Arrangement.Generated-Artifact-Contract.md`
- `context/specs/generation/MaximalTemplateArrangement/README.md`
- `context/specs/generation/README.md`

### Ontologies

- `context/specs/ontologies/Ontologies.Authoritative-Source-Spec.md`
- `context/specs/ontologies/Ontologies.Canonical-Catalog.md`
- `context/specs/ontologies/Ontologies.Generic-Reference-Implementation.md`
- `context/specs/ontologies/README.md`

### Simples

- `context/specs/simples/Simples.Authoritative-Source-Spec.md`
- `context/specs/simples/Simples.Canonical-Catalog.md`
- `context/specs/simples/Simples.Generic-Reference-Implementation.md`
- `context/specs/simples/README.md`

### Loaded Vibes

- Product specification: `context/specs/loaded-vibes/Loaded-Vibes.Authoritative-Plugin-Spec.md`
- Package manifest notes: `context/specs/loaded-vibes/Loaded-Vibes.Package-Manifest.md`
- Package metadata: `context/specs/loaded-vibes/plugin.json`
- Source notes: `context/specs/loaded-vibes/SOURCE-NOTES.md`
- Context index: `context/specs/loaded-vibes/README.md`
- Canonical executable/package source: `packages/loaded-vibes/`
- Agent-local mirror: `.agents/LoadedVibesCodexPlugin/loaded-vibes/`
- The mirror is **not** a second authority. Governance validation requires it to match the package source when both exist.

## TypeScripture chapter directory

`content/README.md` defines the two-book ownership split. Each chapter below exists in both books with the same filename:

| Chapter | Knowledge | Implementation |
|---|---|---|
| 01 — Engineering Practice Descriptive Model | `content/TypeScripture_The-Book-of-Knowledge/Chapter-01.Engineering-Practice-Descriptive-Model.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-01.Engineering-Practice-Descriptive-Model.md` |
| 02 — Engineering Practice The Stupid Lesson | `content/TypeScripture_The-Book-of-Knowledge/Chapter-02.Engineering-Practice-The-Stupid-Lesson.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-02.Engineering-Practice-The-Stupid-Lesson.md` |
| 03 — Architecture Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-03.Architecture-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-03.Architecture-Contract.md` |
| 04 — Engineering System Definition | `content/TypeScripture_The-Book-of-Knowledge/Chapter-04.Engineering-System-Definition.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-04.Engineering-System-Definition.md` |
| 05 — Ontology Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-05.Ontology-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-05.Ontology-Contract.md` |
| 06 — Knowledge Modeling Ontology and Taxonomy | `content/TypeScripture_The-Book-of-Knowledge/Chapter-06.Knowledge-Modeling-Ontology-and-Taxonomy.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-06.Knowledge-Modeling-Ontology-and-Taxonomy.md` |
| 07 — Knowledge System Definition | `content/TypeScripture_The-Book-of-Knowledge/Chapter-07.Knowledge-System-Definition.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-07.Knowledge-System-Definition.md` |
| 08 — System Architecture Terminology | `content/TypeScripture_The-Book-of-Knowledge/Chapter-08.System-Architecture-Terminology.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-08.System-Architecture-Terminology.md` |
| 09 — Pattern Catalog | `content/TypeScripture_The-Book-of-Knowledge/Chapter-09.Pattern-Catalog.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-09.Pattern-Catalog.md` |
| 10 — Product Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-10.Product-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-10.Product-Contract.md` |
| 11 — Layer Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-11.Layer-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-11.Layer-Contract.md` |
| 12 — Execution Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-12.Execution-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-12.Execution-Contract.md` |
| 13 — Validation Contract | `content/TypeScripture_The-Book-of-Knowledge/Chapter-13.Validation-Contract.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-13.Validation-Contract.md` |
| 14 — Application Workflow | `content/TypeScripture_The-Book-of-Knowledge/Chapter-14.Application-Workflow.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-14.Application-Workflow.md` |
| 15 — Authentication Authorization and Policy | `content/TypeScripture_The-Book-of-Knowledge/Chapter-15.Authentication-Authorization-and-Policy.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-15.Authentication-Authorization-and-Policy.md` |
| 16 — Fetcher | `content/TypeScripture_The-Book-of-Knowledge/Chapter-16.Fetcher.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-16.Fetcher.md` |
| 17 — Governance System | `content/TypeScripture_The-Book-of-Knowledge/Chapter-17.Governance-System.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-17.Governance-System.md` |
| 18 — Server Action | `content/TypeScripture_The-Book-of-Knowledge/Chapter-18.Server-Action.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-18.Server-Action.md` |
| 19 — System Lifecycle | `content/TypeScripture_The-Book-of-Knowledge/Chapter-19.System-Lifecycle.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-19.System-Lifecycle.md` |
| 20 — Transaction Helper | `content/TypeScripture_The-Book-of-Knowledge/Chapter-20.Transaction-Helper.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-20.Transaction-Helper.md` |
| 21 — Webhook Processor | `content/TypeScripture_The-Book-of-Knowledge/Chapter-21.Webhook-Processor.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-21.Webhook-Processor.md` |
| 22 — Knowledge System Map | `content/TypeScripture_The-Book-of-Knowledge/Chapter-22.Knowledge-System-Map.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-22.Knowledge-System-Map.md` |
| 23 — Tech Stack Map | `content/TypeScripture_The-Book-of-Knowledge/Chapter-23.Tech-Stack-Map.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-23.Tech-Stack-Map.md` |
| 24 — Route and Feature Orchestration | `content/TypeScripture_The-Book-of-Knowledge/Chapter-24.Route-and-Feature-Orchestration.md` | `content/TypeScripture_The-Book-of-Implementation/Chapter-24.Route-and-Feature-Orchestration.md` |

## Visual references

`context/mockups/` contains the ten supplied design plates:

- `Landing Mockup.jpg`
- `Ontology Mockup.jpg`
- `Simples 1 Mockup.jpg`
- `Simples 2 Mockup.jpg`
- `Anthimeria Mockup.jpg`
- `Business Blocks Mockup.jpg`
- `Docs Mockup.jpg`
- `UI Blocks 1 Mockup.jpg`
- `UI Blocks 2 Mockup.jpg`
- `Template Mockup.jpg`

Mockups govern visual hierarchy and interaction evidence. They do not prove unsupported behavior exists.

## Repository surfaces

```text
root web app          public architecture/docs/catalog/configuration product
packages/schema       Virgule/runtime schema authority
packages/core         normalization, dependency closure, generation planning/materialization semantics
packages/cli          CLI adapter
packages/loaded-vibes canonical Loaded Vibes package source
template/              Maximal Template runnable superset source
context/               product specifications and visual references
content/               TypeScripture doctrine
.agents/               machine contracts + temporary execution state + agent-local mirror
```

Do not demand template-only SaaS infrastructure from the public root web app. Do not treat the public root site as the generated Arrangement.

## Engineering grammar

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

Important reconciliations:

- **Codependent Coding** is the architecture. **Loaded Vibes** operates post-generation on Arrangements.
- Simples has exactly two top-level families: **PureUI Blocks** and **BusinessLogic Blocks / Workflows**.
- Anthimeria configures presentation. Ontologies normalize behavior.
- Features may compose compatible UI Primitives as well as Blocks; an older block-only validator rule is superseded.
- New workflow placement follows `lib/<domain>/workflows/`; existing `template/lib/workflows/<domain>/` is transitional and requires a scoped migration rather than blind file moves.

## Governance commands

```text
pnpm governance:check      parse contracts + validate structure + validate mechanical architecture
pnpm governance:report     print repository/contract status as JSON
pnpm governance:fix        dry-run safe structural corrections
pnpm governance:fix:write  apply only the safe corrections described by validation.yaml
```

Safe fixers may create required governance directories and synchronize the non-authoritative Loaded Vibes mirror. They must not relocate semantic application code, weaken security, alter data, or manufacture evidence.

## Change procedure

1. Read the smallest relevant authority set.
2. Inspect current implementation and direct dependencies before mutation.
3. Classify the owning responsibility.
4. Implement the smallest complete contract-compliant change.
5. Run proportional evidence close to the failure mode.
6. Record `executed`, `skipped`, `blocked`, and `inferred` honestly.
7. Update explanatory authority first when meaning changes; then synchronize machine contracts.
8. Escalate changes involving new privileged roles/routes, provider money movement, weakened tenant/auth/RLS/idempotency, destructive production actions, secrets, legal/compliance choices, or irreversible migrations.

A green static validator is evidence about static rules. It is not divine revelation about business correctness, which humans have somehow not yet managed to serialize.
