# Segmented Build Specification

**Execution model:** complete one segment at a time. Each segment ends with focused validation and a checkpoint record before the next begins. Naming-only fixes that are mechanically implied by current authority are part of the segment, not new design decisions.

## Global acceptance invariants

Every segment must preserve these invariants:

- latest canonical names win;
- working behavior is migrated rather than discarded;
- one shared Application Definition/Virgule semantic engine;
- nine Ontology normalized defaults are the canonical behavioral starting points;
- Anthimeria is stateless and presentation/configuration-oriented;
- Simples = PureUI Blocks + BusinessLogic Workflows only;
- one Maximal Template superset source;
- Loaded Vibes remains post-generation Codex support;
- mockups control visual hierarchy, not unsupported semantics;
- no remote creation or deployment;
- verification remains proportional and truthful.

---

# Segment 0 — Authority overlay and migration map

## Outcome

Make the workspace safe to modify under the new authority before structural code changes begin.

## Required work

- read this governance package and the root workspace governance;
- inventory active build/package entrypoints and actual imported source projects;
- produce a concrete migration map from stale names/paths to current owners;
- identify which current files implement the shared resolver, web app, Maximal Template, code explorer, and Loaded Vibes;
- mark stale local governance statements for replacement;
- establish the segment checkpoint mechanism;
- do not rewrite functioning implementation yet beyond small governance/identity changes required to prevent later ambiguity.

## Acceptance

- no unresolved naming-only conflict remains;
- each major source family has exactly one intended destination/owner;
- old terminology is mapped, not treated as a reason to restart;
- no deployment/remote action occurs.

---

# Segment 1 — Product identity, shell, and Visual Vibes foundation

## Outcome

Make the active public application unambiguously **The Codependent Coding™ Web App Architecture** and establish the shared Visual Vibes shell/tokens used by all later surfaces.

## Required work

- migrate the current `CodependentCoding-site` implementation into its canonical active location;
- remove public Hipster Stack-as-product identity while preserving Hipster Stack as technology/generator identity;
- replace `The Constituter™` labels/routes with `The Anthimeria™ Workbench`;
- replace generic Libraries-era UX with the new top-level information architecture;
- primary navigation from the mockups: **Ontologies | Simples | Anthimeria | Maximal**, with the Codependent Coding wordmark/home entry;
- preserve TypeScripture docs as a supporting/deep-link surface rather than forcing a top-nav item that the mockups do not show;
- centralize Visual Vibes semantic tokens, type stacks, borders, glow, spacing, focus, code surfaces, and Digital Herencia footer treatment;
- reuse supplied brand assets and mockups rather than redrawing them from scratch.

## Acceptance

- landing/shell matches the mockup's hierarchy and aesthetic while using truthful current terminology;
- all global nav actions resolve to real routes or intentionally staged placeholders owned by later segments;
- no old Constituter/Libraries primary product terminology remains in active public copy unless clearly historical;
- responsive shell and keyboard focus remain functional.

---

# Segment 2 — TypeScripture replacement and documentation authority

## Outcome

Replace the old “Codependent Coding Knowledge System” documentation identity with **TypeScripture™ Canonical Doctrine** without losing the underlying technical corpus.

## Required work

- integrate the paired Book of Knowledge / Book of Implementation corpus from `10-authority/typescripture/`;
- preserve the paired 24-chapter map and reification organization;
- update website docs metadata/titles/ownership to TypeScripture;
- repair stale identity text inside active website content where the newer handoff identity map clearly supersedes it;
- keep historical wording only when it is intentionally quoted/provenance-labeled;
- make documentation accessible to detail-page “Docs” tabs and deep links;
- do not create a separate competing documentation rules engine or duplicate hand-written copy where canonical source can be rendered/derived.

## Acceptance

- the web product no longer presents “Codependent Coding Knowledge System” as current documentation authority;
- TypeScripture is discoverable and rendered from authoritative source;
- both books and their chapter pairing remain traceable;
- stale internal names are reconciled without deleting useful content.

---

# Segment 3 — Ontology™ Normalized Defaults

## Outcome

Implement the nine canonical Ontology starter Application Definitions as the behavioral starting point used by the resolver and exposed by the `/ontologies` surface.

## Canonical nine

1. CRM / Pipeline Tracker
2. Project Management / Task Tracker
3. Customer Support / Ticketing System
4. Marketing Automation & Analytics
5. Invoicing & Expense Tracker
6. Social Media Scheduler
7. AI-Powered Wrapper / Micro-SaaS
8. B2B Client Portal
9. Internal Tools / Admin Portal

## Required work

- replace the four generic preset choices as canonical defaults with the nine Ontology defaults;
- preserve a compatibility adapter only as long as existing tests/CLI inputs require it;
- encode the normalized route → feature → template → PureUI Block → BusinessLogic Workflow relationships from the canonical catalog;
- expose resolved constituent/dependency summaries without making those constituents arbitrary user toggles;
- build `/ontologies` and appropriate detail/explorer routes;
- adapt the Ontology mockup: tabs represent the nine Ontologies, source explorer shows real mapped source, code preview uses real files, description reflects canonical domain behavior;
- `Copy Page` / `Download` actions must perform real, useful actions (e.g. copy canonical definition/source view or download the corresponding normalized definition), not decorative buttons.

## Acceptance

- all nine Ontologies resolve deterministically;
- each has a canonical identifier and exported/inspectable definition;
- catalog relationships are source-backed;
- the website can render all nine without a hard-coded second interpretation of resolver semantics.

---

# Segment 4 — Simples™ catalog: BusinessLogic + PureUI

## Outcome

Make the two canonical Simple families first-class, browsable, inspectable, and usable as inputs to the workbench where semantics permit.

## Required work

### BusinessLogic Blocks™

- ingest/reconcile the canonical Workflow catalog (74 total in the supplied catalog);
- treat each Workflow as a named behavioral constitution of existing server operations/helpers;
- rename existing semantically matching workflow files instead of declaring them absent solely because older filenames omit the `Workflow` suffix;
- create missing workflow implementations only after searching all imported source trees for equivalent behavior;
- keep workflow constituents in their canonical owners.

### PureUI Blocks™

- reconcile shared/root/demo/main block implementations into one Maximal Template inventory;
- implement canonical `[STUB — BUILD]` blocks only when no equivalent implementation exists anywhere in the workspace;
- keep UI primitives/variants/tokens as constituents, not top-level Simples;
- reuse existing error/onboarding/marketing/application block implementations shown in the mockups.

### Web surfaces

- `/simples` presents the two families;
- family catalogs and detail routes expose implementation, docs, compatible use, and source/code preview;
- adapt the BusinessLogic detail mockup's **Blocks | Docs | Builder Preset** tabs and `Start Config` action to real semantics;
- for a BusinessLogic Workflow, `Start Config` selects or suggests an Ontology that already contains the workflow; it MUST NOT let the user toggle server-operation constituents arbitrarily;
- for a PureUI Block, `Start Config` may seed a compatible presentation selection/feature slot where supported.

## Acceptance

- top-level Simples contain only the two canonical families;
- existing implementations are migrated/renamed before new ones are authored;
- no Workflow imports presentation; no PureUI Block owns business logic/protected data access;
- all visible example/detail controls perform real actions.

---

# Segment 5 — One Maximal Template™ Domain Library

## Outcome

Consolidate the current `TheMaximalTemplate-main`, `TheMaximalTemplate-demo`, root shared presentation source, and needed imported implementations into one authoritative runnable superset.

## Required work

- create one canonical Maximal Template source owner;
- migrate useful implementations from both old source trees before deleting duplication;
- include every supported Ontology implementation, canonical Simples, and required architecture-owned constituents;
- preserve architecture layer contracts and runnable behavior;
- resolve the canonical `[STUB — BUILD]` inventory using search-first migration: equivalent implementation → move/adapt → only then build missing source;
- preserve presentation content/data separation;
- integrate a `/maximal` explorer/demo over the authoritative source instead of maintaining a second demo application;
- reuse Codebase Context Utility file-tree/code-preview mechanics for source exploration where useful, upgraded to the active stack and Visual Vibes.

## Acceptance

- exactly one active Maximal Template source remains;
- it is runnable/testable independently enough for the generator to use real source;
- the `/maximal` surface inspects/previews that source rather than a fork;
- no imported old-app wrapper remains required for runtime/build.

---

# Segment 6 — Hipster Stack™ generation semantics: Ontology → Virgule → Arrangement

## Outcome

Reconcile the working shared resolver/generator with the current product model without replacing it with a new engine.

## Required work

- retain the current schema/core/CLI implementation wherever compatible;
- evolve current `ApplicationDefinition` semantics so the normalized/dependency-closed resolved state is explicitly **Virgule™**;
- preserve `hipsterstack.json` as the portable config/provenance representation where the authority bundle specifies it; do not rename the filename merely for branding;
- make nine Ontologies seed behavior; presentation/user intent refines supported configuration; resolver validates/normalizes/closes dependencies;
- generation planner consumes dependency-closed Virgule;
- Maximal Template ownership plan performs retain/remove/transform;
- materializer stages output safely and produces a standalone Arrangement;
- CLI and Anthimeria remain adapters over the same engine;
- update generated provenance to identify Ontology, Virgule/config version, Maximal Template revision, generator revision, selected/resolved artifacts, transforms, and outstanding setup requirements.

## Acceptance

- identical supported input produces deterministic equivalent resolution/plan;
- invalid/non-closed Virgule cannot materialize;
- CLI/config/web preview agree on resolved semantics;
- a representative Arrangement can be generated from the actual Maximal Template;
- generated output has no runtime dependency on Anthimeria or generator internals.

---

# Segment 7 — Anthimeria™ Workbench

## Outcome

Turn the current Constituter implementation into the canonical stateless Anthimeria workbench.

## Required work

- use the shared schema/resolver from Segment 6; no parallel rules engine;
- allow selection of one of nine Ontologies;
- expose product identity and supported presentation configuration;
- expose page/template/feature-slot/PureUI compatibility only where source contracts support it;
- show normalized BusinessLogic/constituent consequences read-only as resolved facts;
- produce a live resolved Virgule preview and generation-plan consequences;
- preserve/import/export/copy/share/CLI-command behaviors where truthful;
- adapt the Anthimeria mockup's left categories and output/code area to actual configurable properties;
- remove old capability/auth/provider toggles when they conflict with the canonical presentation-first contract; if a provider/setup choice remains legitimately supported by the current Virgule contract, expose it only as the canonical contract allows.

## Acceptance

- refresh/reload does not require hosted persistent application state;
- exported config can be imported and resolve equivalently;
- share URL round-trips supported intent;
- workbench never mutates the Maximal Template or generates server-side project state as an implicit browser side effect;
- normalized behavior cannot be silently changed by presentation controls.

---

# Segment 8 — Loaded Vibes™ plugin final disposition

## Outcome

Preserve the already-built v0.1.0 plugin, place it under one clear source owner, and verify it without redesigning it.

## Observed prep evidence

The standalone package and embedded operational payload are identical for the 63 operational files. The standalone package only adds five documentation/build-verification files. Package validation and fixture tests were executed successfully during this handoff preparation.

## Required work

- choose one canonical plugin source location in the final repository (default recommendation: a first-class package/plugin source rather than a buried duplicate installed copy);
- move the existing payload intact where practical;
- include its canonical spec, package manifest, README, source notes, and build verification with the source package;
- preserve six skills: inspect, classify, implement, review, verify, deliver;
- preserve three project-agent assets: engineer, reviewer, verifier;
- preserve validators/installers/smoke tests;
- do not reinterpret the Codependent Coding source workspace itself as an Arrangement merely because the plugin source lives there;
- retain the plugin's post-generation boundary.

## Acceptance

Run at minimum from the plugin source:

```text
node validators/validate-package.mjs .
node tests/validator-fixture-test.mjs
node --check <all .mjs files>
```

Also run an Arrangement smoke against a real representative generated Arrangement once Segment 6 can produce one.

---

# Segment 9 — Consolidation cleanup and final validation

## Outcome

Remove obsolete duplicates/adapters only after their replacements are proven, then leave a clean local repository ready for a later new remote/deployment.

## Required work

- delete old imported-app wrappers and dead duplicated code after final callers are migrated;
- delete stale product branding/governance that would mislead a future agent;
- retain historical provenance only when clearly labeled and useful;
- verify all public navigation/actions, representative Ontology, both Simples families, Anthimeria round-trip, Maximal explorer, docs deep-link, generator flow, representative Arrangement, and Loaded Vibes package;
- run the complete repository validation gate actually defined by the reconciled final package scripts;
- produce final handoff with executed/skipped/blocked/inferred evidence;
- do not create a remote or deploy.

## Final acceptance

The local repository is acceptable when a technically capable agent can answer, from code and governance, all of the following without guessing:

- what TypeScripture governs;
- what Codependent Coding is;
- what Hipster Stack owns;
- what the nine Ontologies are;
- what qualifies as a Simple;
- what Anthimeria may configure;
- what Virgule represents;
- what Maximal Template contains;
- how Arrangement is produced;
- what Loaded Vibes does after generation;
- where Visual Vibes is implemented;
- which source location owns each of those things.
