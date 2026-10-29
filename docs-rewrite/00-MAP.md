# 00 · Map

Phase 0 orientation for the rewrite of The TypeScripture™ Canonical Doctrine at `/doctrine`.

## 1. How the site stores content today

- Route files: `app/(public)/doctrine/page.tsx` and `app/(public)/doctrine/[...slug]/page.tsx`. Every page is static (`dynamicParams = false`).
- Loader: `lib/fetchers/doctrineFetchers.ts` builds one ordered list of pages at build time from four sources:
  1. `context/doctrine/README.md` becomes `/doctrine` ("Start here").
  2. `context/docs/Architecture.md` is split on every `## ` heading into ten "Architecture" pages.
  3. `.claude/contracts/validation.yaml` is rendered as a table on `/doctrine/rules`.
  4. `context/doctrine/TypeScripture_The-Book-of-Knowledge/*.md` and `TypeScripture_The-Book-of-Implementation/*.md` become 24 paired chapters each.
- Rendering: `marked` turns Markdown into HTML; headings at depth 3 or less feed the on-page table of contents. No frontmatter is read. GitHub callout syntax (`> [!NOTE]`) is not rendered as callouts yet.
- Presentation: `features/doctrine/doctrineDocsFeature.tsx`, `features/doctrine/doctrineSidebar.client.tsx`, `components/blocks/doctrine-article.tsx`, prose styles in `app/globals.css` (`.doctrine-prose`).

## 2. Native format for the rewrite

- Each page becomes one Markdown file with YAML frontmatter under `context/doctrine/<NN-section>/<NN-page>.md`.
- Frontmatter carries the page header: `title`, `class` (content class), `knowledge` (knowledge-stack label), `authority` (authority-registry value), `summary`, `sources`.
- `doctrineFetchers.ts` reads the section folders in order instead of the old four sources. The machine-contract table stays generated from `validation.yaml` so the lint rules and the docs never drift.
- Callouts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`) render as styled callout blocks.
- Every old route gets a permanent redirect in `next.config.ts` to its new home, so no inbound link dies.
- `context/docs/Architecture.md` and the contracts stay where they are as repo working documents for the lint rules. The site stops rendering them directly; their content is absorbed into the pages below.
- The old book folders are deleted once their chapters are fully absorbed (Section 04 ships last of the two).

## 3. Target tree, routes, classes, and labels

`/doctrine` is the cover: wordmark, the TypeScripture™ NOTE callout, and the tree below as the table of contents.

| # | Page | New route | Class | Knowledge label | Authority |
| --- | --- | --- | --- | --- | --- |
| 01 | **ONTOLOGY** | | | | |
| 01.1 | System Overview | `/doctrine/ontology/system-overview` | Concept | Ontology | Source of Truth |
| 01.2 | Architecture at a Glance | `/doctrine/ontology/architecture-at-a-glance` | Architecture | Topology | Source of Truth |
| 01.3 | Product Topology | `/doctrine/ontology/product-topology` | Architecture | Mereology | Source of Truth |
| 01.4 | How to Read the Docs | `/doctrine/ontology/how-to-read-the-docs` | Reference | Information Architecture | Reference |
| 02 | **EPISTEMOLOGY** | | | | |
| 02.1 | Knowledge-System Definition | `/doctrine/epistemology/knowledge-system-definition` | Concept | Epistemology | Source of Truth |
| 02.2 | Knowledge Modeling | `/doctrine/epistemology/knowledge-modeling` | Concept | Knowledge Graph | Source of Truth |
| 02.3 | Taxonomy | `/doctrine/epistemology/taxonomy` | Concept | Taxonomy | Source of Truth |
| 02.4 | Terminology | `/doctrine/epistemology/terminology` | Reference | Terminology | Source of Truth |
| 02.5 | Nomenclature | `/doctrine/epistemology/nomenclature` | Contract | Nomenclature | Source of Truth |
| 03 | **THE BOOK OF KNOWLEDGE** | | | | |
| 03.1 | Architecture Overview | `/doctrine/knowledge/architecture-overview` | Architecture | Ontology | Source of Truth |
| 03.2 | Route / Feature Orchestration | `/doctrine/knowledge/route-feature-orchestration` | Architecture | Topology | Source of Truth |
| 03.3 | Layer Contracts | `/doctrine/knowledge/layer-contracts` | Contract | Mereology | Source of Truth |
| 03.4 | Data Boundaries | `/doctrine/knowledge/data-boundaries` | Architecture | Schema | Source of Truth |
| 03.5 | Auth / Authz | `/doctrine/knowledge/auth-authz` | Architecture | Domain Model | Source of Truth |
| 03.6 | Integrations | `/doctrine/knowledge/integrations` | Architecture | Topology | Source of Truth |
| 03.7 | Security | `/doctrine/knowledge/security` | Architecture | Semantics | Source of Truth |
| 03.8 | System Lifecycles | `/doctrine/knowledge/system-lifecycles` | Lifecycle | Typology | Source of Truth |
| 04 | **THE BOOK OF IMPLEMENTATION** | | | | |
| 04.1 | Fetcher | `/doctrine/implementation/fetcher` | Pattern | Schema | Source of Truth |
| 04.2 | Server Action | `/doctrine/implementation/server-action` | Pattern | Schema | Source of Truth |
| 04.3 | BusinessLogic™ Workflow | `/doctrine/implementation/businesslogic-workflow` | Pattern | Domain Model | Source of Truth |
| 04.4 | Transaction Helper | `/doctrine/implementation/transaction-helper` | Pattern | Semantics | Source of Truth |
| 04.5 | Auth/Authz | `/doctrine/implementation/auth-authz` | Pattern | Domain Model | Source of Truth |
| 04.6 | Webhook Processor | `/doctrine/implementation/webhook-processor` | Pattern | Topology | Source of Truth |
| 04.7 | Route/Feature | `/doctrine/implementation/route-feature` | Pattern | Topology | Source of Truth |
| 04.8 | Layer Contract | `/doctrine/implementation/layer-contract` | Pattern | Mereology | Source of Truth |
| 04.9 | Lifecycle | `/doctrine/implementation/lifecycle` | Pattern | Typology | Source of Truth |
| 04.10 | Governance | `/doctrine/implementation/governance` | Pattern | Metadata | Source of Truth |
| 04.11 | Supporting Patterns | `/doctrine/implementation/supporting-patterns` | Pattern | Typology | Source of Truth |
| 05 | **THE CODEPENDENT CODING™ WEBAPP ARCHITECTURE** | | | | |
| 05.1 | Hipster Stack™ | `/doctrine/webapp-architecture/hipster-stack` | Architecture | Topology | Source of Truth |
| 05.2 | Maximal Template™ | `/doctrine/webapp-architecture/maximal-template` | Architecture | Mereology | Source of Truth |
| 05.3 | Simples™ | `/doctrine/webapp-architecture/simples` | Concept | Typology | Source of Truth |
| 05.4 | Ontologies™ | `/doctrine/webapp-architecture/ontologies` | Concept | Domain Model | Source of Truth |
| 05.5 | Anthimeria™ | `/doctrine/webapp-architecture/anthimeria` | Concept | Faceted Classification | Source of Truth |
| 05.6 | Virgule™ | `/doctrine/webapp-architecture/virgule` | Specification | Schema | Source of Truth |
| 05.7 | Arrangement™ | `/doctrine/webapp-architecture/arrangement` | Specification | Metadata | Source of Truth |
| 05.8 | Loaded Vibes™ | `/doctrine/webapp-architecture/loaded-vibes` | Architecture | Topology | Source of Truth |
| 06 | **GOVERNANCE** | | | | |
| 06.1 | Governance Model | `/doctrine/governance/governance-model` | Governance | Epistemology | Source of Truth |
| 06.2 | Specifications | `/doctrine/governance/specifications` | Specification | Schema | Source of Truth |
| 06.3 | Validation & Conformance | `/doctrine/governance/validation-conformance` | Governance | Epistemology | Source of Truth |
| 06.4 | Agent Execution | `/doctrine/governance/agent-execution` | Specification | Semantics | Source of Truth |
| 06.5 | Machine Contracts | `/doctrine/governance/machine-contracts` | Contract | Schema | Source of Truth |
| 07 | **PROVENANCE & REFERENCE** | | | | |
| 07.1 | Source Provenance | `/doctrine/provenance/source-provenance` | Provenance | Knowledge Graph | Reference |
| 07.2 | Synthesis Decisions | `/doctrine/provenance/synthesis-decisions` | Provenance | Knowledge Graph | Reference |
| 07.3 | Conflict Resolution | `/doctrine/provenance/conflict-resolution` | Provenance | Epistemology | Reference |
| 07.4 | Traceability | `/doctrine/provenance/traceability` | Provenance | Knowledge Graph | Reference |
| 07.5 | Coverage | `/doctrine/provenance/coverage` | Provenance | Faceted Classification | Reference |
| 07.6 | Reference Implementations | `/doctrine/provenance/reference-implementations` | Reference | Folksonomy | Reference |

## 4. Every live route and where it goes

Live routes: 60 (1 start page, 10 Architecture pages, 1 rules page, 24 Knowledge chapters, 24 Implementation chapters). K = Book of Knowledge chapter, I = Book of Implementation chapter.

| Old route | Old title | New home |
| --- | --- | --- |
| `/doctrine` | TypeScripture™ (README) | Cover page; book split text moves to 01.4 |
| `/doctrine/architecture/system-map` | System map | 01.2 |
| `/doctrine/architecture/governing-sentence-unchanged-doctrine` | Governing sentence | 01.1 (the governing sentence opens the doctrine) |
| `/doctrine/architecture/template-layer-model` | Template layer model | 03.3 (meaning), 04.8 (shapes), 02.5 (naming) |
| `/doctrine/architecture/doctrine-enforcement` | Doctrine enforcement | 06.3 |
| `/doctrine/architecture/module-system` | Module system | 05.2 |
| `/doctrine/architecture/hipster-stack-cli` | Hipster Stack CLI | 05.1 |
| `/doctrine/architecture/loaded-vibes-plugin` | Loaded Vibes plugin | 05.8 |
| `/doctrine/architecture/governance-layers` | Governance layers | 06.1 |
| `/doctrine/architecture/source-of-truth-allocation` | Source-of-truth allocation | 06.1 |
| `/doctrine/architecture/appendix-a-golden-slice-projects` | Golden slice: projects | 07.6 |
| `/doctrine/rules` | The CC-* rules | 06.5 (table still generated from `validation.yaml`) |
| `/doctrine/knowledge/chapter-01-engineering-practice-descriptive-model` | K01 Descriptive Model | 01.1 |
| `/doctrine/knowledge/chapter-02-engineering-practice-the-stupid-lesson` | K02 The Stupid Lesson | 06.3 |
| `/doctrine/knowledge/chapter-03-architecture-contract` | K03 Architecture Contract | 03.1 |
| `/doctrine/knowledge/chapter-04-engineering-system-definition` | K04 Engineering System Definition | 01.1 |
| `/doctrine/knowledge/chapter-05-ontology-contract` | K05 Ontology Contract | 01.3, 06.5 |
| `/doctrine/knowledge/chapter-06-knowledge-modeling-ontology-and-taxonomy` | K06 Knowledge Modeling | 02.2, 02.3 |
| `/doctrine/knowledge/chapter-07-knowledge-system-definition` | K07 Knowledge System Definition | 02.1 |
| `/doctrine/knowledge/chapter-08-system-architecture-terminology` | K08 Terminology | 02.4 |
| `/doctrine/knowledge/chapter-09-pattern-catalog` | K09 Pattern Catalog | 02.3, 04.11 |
| `/doctrine/knowledge/chapter-10-product-contract` | K10 Product Contract | 01.3 |
| `/doctrine/knowledge/chapter-11-layer-contract` | K11 Layer Contract | 03.3 |
| `/doctrine/knowledge/chapter-12-execution-contract` | K12 Execution Contract | 06.4 |
| `/doctrine/knowledge/chapter-13-validation-contract` | K13 Validation Contract | 06.3 |
| `/doctrine/knowledge/chapter-14-application-workflow` | K14 Application Workflow | 03.4, 04.3 |
| `/doctrine/knowledge/chapter-15-authentication-authorization-and-policy` | K15 Auth and Policy | 03.5 |
| `/doctrine/knowledge/chapter-16-fetcher` | K16 Fetcher | 03.4, 04.1 |
| `/doctrine/knowledge/chapter-17-governance-system` | K17 Governance System | 06.1 |
| `/doctrine/knowledge/chapter-18-server-action` | K18 Server Action | 03.4, 04.2 |
| `/doctrine/knowledge/chapter-19-system-lifecycle` | K19 System Lifecycle | 03.8 |
| `/doctrine/knowledge/chapter-20-transaction-helper` | K20 Transaction Helper | 03.4, 04.4 |
| `/doctrine/knowledge/chapter-21-webhook-processor` | K21 Webhook Processor | 03.6 |
| `/doctrine/knowledge/chapter-22-knowledge-system-map` | K22 Knowledge System Map | 01.3, 02.1 |
| `/doctrine/knowledge/chapter-23-tech-stack-map` | K23 Tech Stack Map | 05.1 |
| `/doctrine/knowledge/chapter-24-route-and-feature-orchestration` | K24 Route and Feature Orchestration | 03.2 |
| `/doctrine/implementation/chapter-01-engineering-practice-descriptive-model` | I01 Descriptive Model | 01.1 |
| `/doctrine/implementation/chapter-02-engineering-practice-the-stupid-lesson` | I02 The Stupid Lesson | 06.3 |
| `/doctrine/implementation/chapter-03-architecture-contract` | I03 Architecture Contract | 04.8, 06.5 |
| `/doctrine/implementation/chapter-04-engineering-system-definition` | I04 Engineering System Definition | 01.1 |
| `/doctrine/implementation/chapter-05-ontology-contract` | I05 Ontology Contract | 06.5 |
| `/doctrine/implementation/chapter-06-knowledge-modeling-ontology-and-taxonomy` | I06 Knowledge Modeling | 02.2, 02.3 |
| `/doctrine/implementation/chapter-07-knowledge-system-definition` | I07 Knowledge System Definition | 02.1 |
| `/doctrine/implementation/chapter-08-system-architecture-terminology` | I08 Terminology | 02.4, 02.5 |
| `/doctrine/implementation/chapter-09-pattern-catalog` | I09 Pattern Catalog | 04.11 |
| `/doctrine/implementation/chapter-10-product-contract` | I10 Product Contract | 01.3 |
| `/doctrine/implementation/chapter-11-layer-contract` | I11 Layer Contract | 04.8 |
| `/doctrine/implementation/chapter-12-execution-contract` | I12 Execution Contract | 06.4 |
| `/doctrine/implementation/chapter-13-validation-contract` | I13 Validation Contract | 06.3 |
| `/doctrine/implementation/chapter-14-application-workflow` | I14 Application Workflow | 04.3 |
| `/doctrine/implementation/chapter-15-authentication-authorization-and-policy` | I15 Auth and Policy | 04.5 |
| `/doctrine/implementation/chapter-16-fetcher` | I16 Fetcher | 04.1 |
| `/doctrine/implementation/chapter-17-governance-system` | I17 Governance System | 04.10 |
| `/doctrine/implementation/chapter-18-server-action` | I18 Server Action | 04.2 |
| `/doctrine/implementation/chapter-19-system-lifecycle` | I19 System Lifecycle | 04.9 |
| `/doctrine/implementation/chapter-20-transaction-helper` | I20 Transaction Helper | 04.4 |
| `/doctrine/implementation/chapter-21-webhook-processor` | I21 Webhook Processor | 04.6 |
| `/doctrine/implementation/chapter-22-knowledge-system-map` | I22 Knowledge System Map | 02.1 |
| `/doctrine/implementation/chapter-23-tech-stack-map` | I23 Tech Stack Map | 05.1 |
| `/doctrine/implementation/chapter-24-route-and-feature-orchestration` | I24 Route and Feature Orchestration | 04.7 |

Where an old route feeds two pages, the redirect points at the first one listed.

## 5. Source files per page

Path shorthands:

- `MSD` = `4.ARCHIVE/Old Vault/40.ARCHIVE.WEBAPP/…WebApp-Architecture.Master.Source-Document.md` (section numbers given)
- `WEBAPP/` = `4.ARCHIVE/Old Vault/40.ARCHIVE.WEBAPP/`
- `OLD/` = `4.ARCHIVE/OldependentCoding/` (52 files, each duplicated with a `60.CODEPENDENTCODING.` prefix; the copies are byte-identical, the unprefixed name is used)
- `TECH/` = `4.ARCHIVE/Old Vault/40.ARCHIVE.TECHSTACK/` (24 files, duplicated the same way; `Map.md` differs from its prefixed twin and both are read)
- `PAT/` = `2.AREAS/CODE/Patterns/` (24 pattern notes)
- `AUTH-PKG/` = `4.ARCHIVE/Old Vault/10.PROJECTS.CODEPENDENTCODING/10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture/`, followed by the package folder
- `REPO/` = the CodependentCoding repo
- `REG` = `Downloads/New folder/system/authority/authority-registry.json`
- `STR` = Systems-That-Remember.md (voice, callouts, commentary for every section; song parodies are never quoted)

| Page | Sources |
| --- | --- |
| Cover | `REPO/context/doctrine/README.md`, STR, Design-Content-Specification (wordmarks, hero copy) |
| 01.1 System Overview | MSD Exec Summary, §2, §40; K01, I01, K04, I04; Architecture.md §2; `OLD/Readme.Source-Document.md`, `OLD/Docs.Engineering-Doctrine.Source-Document.md` |
| 01.2 Architecture at a Glance | MSD §4, §38; Architecture.md §1; `OLD/Docs.System-Map.Map.md`; `REPO/context/doctrine/CANONICAL-RECONSTRUCTION.md` |
| 01.3 Product Topology | MSD §1.1, §2.1 to §2.4; K05, K10, I10, K22; `OLD/Agents.Contracts.Product.Contract.md`, `OLD/Manifest.Map.md`; Docs-Knowledge spec §17 |
| 01.4 How to Read the Docs | Docs-Knowledge spec §7, §8; Website-Information-Architecture §10 to §13; MSD §36; old README book split |
| 02.1 Knowledge-System Definition | K07, I07, K22, I22; `OLD/Docs.Knowledge-System-Definition.Source-Document.md`, `OLD/Docs.Epistemology.Reference.md`; Docs-Knowledge spec §1 to §5; REG |
| 02.2 Knowledge Modeling | K06, I06; `OLD/Docs.Knowledge-Modeling.Reference.md`; Docs-Knowledge spec §9; the brief's knowledge-modeling stack |
| 02.3 Taxonomy | K06, K09; Website-Information-Architecture §12; Docs-Knowledge spec §7; `TECH/Knowledge-Modeling.Ontology-Taxonomy.Reference.md` |
| 02.4 Terminology | K08, I08; MSD §37; `OLD/Docs.Terminology-Nomenclature.Reference.md`; `TECH/System-Architecture.Terminology.Reference.md`; Migration Guide §10 |
| 02.5 Nomenclature | I08; MSD §17.1; Architecture.md §3 (naming); `OLD/Docs.Terminology-Nomenclature.Reference.md`; `PAT/` frontmatter naming; `validation.yaml` naming rules |
| 03.1 Architecture Overview | K03; MSD §3, §14, §15, §16, §17; Architecture.md §3; `OLD/Agents.Contracts.Architecture.Contract.md` |
| 03.2 Route / Feature Orchestration | K24; MSD §5, §6; `OLD/Patterns.Route-Feature-Orchestration.Reference.md` |
| 03.3 Layer Contracts | K11; Architecture.md §3; MSD §4.2; `OLD/Docs.Layer-Contracts.Contract.md` |
| 03.4 Data Boundaries | K14, K16, K18, K20; MSD §7, §8, §9; `OLD/Patterns.Data-Contract-Patterns.Reference.md`; CANONICAL-RECONSTRUCTION read and mutation paths |
| 03.5 Auth / Authz | K15; MSD §10; `REPO/context/docs/AUTH.md` |
| 03.6 Integrations | K21; MSD §11, §12, §13; `OLD/Patterns.Infrastructure-Integration-Patterns.Reference.md` |
| 03.7 Security | `OLD/Docs.Security-Model.Contract.md`; Docs-Knowledge spec §13; MSD §30 (auth/security), §32.1 |
| 03.8 System Lifecycles | K19; `OLD/Docs.System-Lifecycles.Contract.md`; MSD §32.2 |
| 04.1 Fetcher | I16, K16; `PAT/fetcher.md`, `PAT/select.md`, `PAT/dto-mapper.md`; `OLD/Patterns.Fetcher.Reference.md`; `TECH/Patterns.Fetcher.Reference.md`; CANONICAL-RECONSTRUCTION Golden Fetcher |
| 04.2 Server Action | I18, K18; `PAT/action.md`; `OLD/Patterns.Server-Action.Reference.md`; `TECH/Patterns.Server-Action.Reference.md` |
| 04.3 BusinessLogic™ Workflow | I14, K14; `PAT/workflow.md`; `WEBAPP/…BusinessLogic-Blocks.md`; `OLD/Patterns.Application-Workflow.Reference.md` |
| 04.4 Transaction Helper | I20, K20; `PAT/transaction.md`, `PAT/database.md`, `PAT/prisma-lifecycle.md`; `OLD/Patterns.Transaction-Helper.Reference.md` |
| 04.5 Auth/Authz | I15; `PAT/auth.md`, `PAT/authz.md`; `OLD/Patterns.Auth-Authz-Policy.Reference.md`; `TECH/Patterns.Auth-Authz-Boundary.Reference.md` |
| 04.6 Webhook Processor | I21, K21; `PAT/webhook.md`, `PAT/integration.md`; `OLD/Patterns.Webhook-Processor.Reference.md` |
| 04.7 Route/Feature | I24; `PAT/route.md`, `PAT/feature.md`, `PAT/page-template.md`, `PAT/template.md`; `TECH/Patterns.Route-Feature-Orchestration.Reference.md` |
| 04.8 Layer Contract | I03, I11; `OLD/Patterns.Layer-Contract.Reference.md`; `PAT/block.md`, `PAT/primitive.md`; Architecture.md §3 |
| 04.9 Lifecycle | I19; `OLD/Patterns.System-Lifecycle.Reference.md`; `TECH/Patterns.System-Lifecycle.Reference.md` |
| 04.10 Governance | I17; `OLD/Patterns.Governance-System.Reference.md`; `TECH/Patterns.Governance-System.Reference.md` |
| 04.11 Supporting Patterns | I09, K09; `OLD/Patterns.Supporting-Patterns.Reference.md`, `OLD/Patterns.Presentation-Patterns.Reference.md`, `OLD/Patterns.Quality-Policy-Patterns.Reference.md`, `OLD/Patterns.Catalog.Map.md`; `PAT/cache.md`, `config.md`, `constant.md`, `schema.md`, `type.md`, `utility.md` |
| 05.1 Hipster Stack™ | Architecture.md §6; MSD §23; `AUTH-PKG/Generation-System bundle/01_hipster_stack_constitution_system/*`; Website-Design `Hipster-Stack.Technologies.md`; K23, I23; `OLD/Docs.Hipster-Stack-Tech.Map.md`; `TECH/Map.md` |
| 05.2 Maximal Template™ | MSD §18, §20, §28, §29; Architecture.md §5; `WEBAPP/…Maximal-Template.md`, `WEBAPP/…Template-Demo.md`; `AUTH-PKG/Generation-System bundle/02_maximal_template_arrangement/…Domain-Library-Spec.md`; Template-Demo-Website-Copy |
| 05.3 Simples™ | `AUTH-PKG/Simples-Authority-Package/*`; MSD §19; Design-Content-Specification Simples™ copy |
| 05.4 Ontologies™ | `AUTH-PKG/Ontologies-Authority-Package/*`; MSD §21; `WEBAPP/…Ontologies-Normalized-Defaults.md`; `REPO/context/doctrine/salvage/core/ontologies.ts.txt`, `presets.ts.txt`; `OLD/Agents.Contracts.Ontology.Contract.md` |
| 05.5 Anthimeria™ | `AUTH-PKG/Anthimeria-Authority-Package/*`; MSD §22; `WEBAPP/…The-Anthimeria-Workbench.md`; Design-Content-Specification Workbench copy |
| 05.6 Virgule™ | `AUTH-PKG/Generation-System bundle/01_…/…Virgule-Application-Definition.md`; MSD §1.1 |
| 05.7 Arrangement™ | `AUTH-PKG/Generation-System bundle/02_…/…Arrangement.Generated-Artifact-Contract.md`, `…Materialization-and-Ownership.md`; `03_generation_pipeline/*`; MSD §24 |
| 05.8 Loaded Vibes™ | Architecture.md §7; MSD §25; `AUTH-PKG/Loaded-Vibes-Plugin-Authority-Package/*`; `WEBAPP/…Loaded-Vibes-Plugin*Status.md`; `OLD/Docs.Loaded-Vibes-Architecture.Source-Document.md`; `REPO/plugin/loaded-vibes/`; `REPO/context/doctrine/salvage/loaded-vibes/*` |
| 06.1 Governance Model | Architecture.md §8, §9; MSD §33, §34; K17; `OLD/Docs.Governance-Model.Contract.md`; `WEBAPP/…Directive.md` |
| 06.2 Specifications | `OLD/Docs.Specification-Model.Contract.md`; `REPO/context/specs/README.md`; `OLD/Github.*` templates |
| 06.3 Validation & Conformance | K02, I02, K13, I13; Architecture.md §4; MSD §31; `OLD/Docs.Validation-Conformance.Contract.md`; Docs-Knowledge spec §14 |
| 06.4 Agent Execution | K12, I12; `OLD/Docs.Agent-Execution.Execution.md`, `OLD/Agents.Execution.md`, `OLD/Agents.Contracts.Execution.Contract.md`; `REPO/CLAUDE.md`, `REPO/AGENTS.md` |
| 06.5 Machine Contracts | `/doctrine/rules` generator; K05, I03, I05; `REPO/.claude/contracts/*.yaml`; `OLD/Agents.Contracts.*`; Docs-Knowledge spec §20 |
| 07.1 Source Provenance | `OLD/Provenance.Source-Provenance-Ledger.Reference.md`, `OLD/Provenance.Readme.Reference.md`; MSD Appendix A; REG |
| 07.2 Synthesis Decisions | MSD §39; `OLD/Provenance.Synthesis-Decisions.Reference.md`; `REPO/.claude/execution/decisions.json`; CANONICAL-RECONSTRUCTION |
| 07.3 Conflict Resolution | `OLD/Provenance.Conflict-Resolution.Reference.md`; MSD §1.2, §34.2; Reconciliation-and-Migration-Guide |
| 07.4 Traceability | `OLD/Provenance.Contract-Traceability.Reference.md`, `…Lifecycle-Traceability…`, `…Ontology-Traceability…`, `…Pattern-Traceability…` |
| 07.5 Coverage | `OLD/Provenance.Coverage-Matrix.Reference.md`; MSD Appendix B |
| 07.6 Reference Implementations | `OLD/Docs.Reference-Implementations.Reference.md`; MSD §28, §29; Architecture.md Appendix A; `REPO/template/` |
| Phase L | MSD §26, §27; Design-Content-Specification; the brief's tokens (which win); `REPO/context/docs/Design.md`, `.claude/contracts/design.yaml` |

Material read and set aside: MSD §35 (transitional implementation status), `WEBAPP/…Template-Backlog.md` (backlog), the four song parodies in STR, `OLD/Github.Issue-Template.Config.Reference.md` (tooling config).

## 6. Order of work

1. **Section 01 Ontology.** Ships with the plumbing: new folder layout, frontmatter header, callout rendering, cover page, sidebar from the new tree, redirects for all 60 old routes. Old pages not yet rewritten stay reachable under their redirect targets until their section lands.
2. **Section 02 Epistemology.**
3. **Section 03 The Book of Knowledge.**
4. **Section 04 The Book of Implementation.** Old book folders deleted after this one.
5. **Section 05 The Codependent Coding™ WebApp Architecture.**
6. **Section 06 Governance.** The rules table moves to Machine Contracts here.
7. **Section 07 Provenance & Reference.**
8. **Phase L.** Tokens as semantic CSS variables, page layout, design system record.
9. **Final.** `BATCH.md` changelog.

Each section: full proposal shown, approve or revise, then save to `docs-rewrite/NN-name.md`, apply to the site, apply glossary renames everywhere, update `PROGRESS.md`, commit with the section number.

## 7. Placement of the required callouts and easter eggs

| Callout | Page |
| --- | --- |
| NOTE: shipping salvation in TypeScripture™ | Cover |
| IMPORTANT: He transpiled for your sins | 01.1 System Overview |
| WARNING: valley of the shadow of deprecation | 03.8 System Lifecycles |
| TIP: Take this repo. Clone it. | 07.6 Reference Implementations |
| IMPORTANT: The Faker. The SaaS. And the Hole-y Specification. | 06.2 Specifications |
| "Fuck NeoVim, btw…" | 05.1 Hipster Stack™, inside the editor line of the procurement list |
| "Fuck Arch, btw…" | 05.1 Hipster Stack™, inside the operating system line of the procurement list |

Process philosophy and mereological nihilism jokes appear in every section, drawn from STR and the Design Authority.
