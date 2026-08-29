# Repository Reconciliation Contract

## Objective

Treat `TheCodependentCodingWebAppArchitecture.zip` as a **consolidation workspace containing valuable implementation source**, not as a repository identity that must be preserved. The final local result should be a coherent Codependent Coding source tree ready to become a new repository later.

**Do not create a new remote or deploy during this handoff.** Remote/repository/deployment setup is explicitly deferred until the build is accepted.

## Observed source families in the workspace

The supplied workspace currently contains:

- a root Hipster Stack package and generator scripts;
- `packages/TheHipsterStackTechnologyStack/{schema,core,cli}` with the working Application Definition/resolver/generator implementation;
- `src/CodependentCoding-site` with the current public web application;
- `src/TheMaximalTemplate-main` and `src/TheMaximalTemplate-demo` as overlapping Maximal Template source/evidence;
- `src/CodebaseContextUtility-main` with file-tree/code-preview/context-explorer functionality;
- root shared `components/` and presentation assets;
- the ten current mockups under `context/mockups/`;
- Codependent Coding / Digital Herencia / Ontology / Simples / Anthimeria / Maximal / Virgule / Arrangement / Loaded Vibes / Visual Vibes logo assets under `public/`;
- an embedded operational Loaded Vibes v0.1.0 payload under `.agents/Loaded-Vibes-Codex-Plugin-v0.1.0/loaded-vibes`.

These are implementation inputs. They are not permission to preserve duplicated subproducts forever.

## Required reconciliation rules

1. **Do not throw away working code because its name is stale.** Move/rename/adapt it.
2. **Eliminate duplicate active ownership.** One website, one resolver/generation semantics engine, one Maximal Template source, one canonical Loaded Vibes plugin source.
3. **Remove imported-repository wrappers after migration.** The final active implementation MUST NOT depend on `src/<old-repository>-main` as a permanent architecture pattern.
4. **Preserve the shared resolver.** Anthimeria, CLI, config import/export, preview, and materialization MUST call one semantic engine.
5. **Preserve generated-app architecture boundaries.** Do not flatten workflows, server operations, provider adapters, or presentation into one convenience layer.
6. **Do not preserve old governance merely because it exists.** Replace stale HS/LV naming/product assertions when this package supersedes them; preserve useful technical constraints that remain compatible.
7. **Do not create a second rules engine in the website.** UI models should expose schema/resolver state rather than reimplementing dependency logic.
8. **Do not create a second Maximal Template demo implementation.** Demo/explorer routes should render or inspect the authoritative Maximal Template source.
9. **Treat Codebase Context Utility as reusable implementation evidence.** Reuse its file-tree/code-preview mechanics where they improve Ontology/Simples/Maximal exploration; upgrade/adapt to the current stack rather than embedding a second Next 14 application.
10. **No deployment/remote work.** Build, validate, and leave a clean local handoff.

## Naming migration mechanics

When renaming a public/domain concept, update all relevant layers in the same segment:

```text
schema/type
→ resolver/registry
→ route/navigation
→ feature/component labels
→ tests/fixtures
→ docs/contracts
→ serialized examples/provenance
```

Temporary compatibility aliases/adapters are allowed when they reduce risk, but they MUST have an explicit removal point in a later segment.

## Repository shape invariant

This package intentionally does not prescribe a cosmetic tree for its own sake. Codex should keep the current package boundaries that have real runtime/build meaning and migrate imported project wrappers into canonical ownership locations. The final tree must make the following owners obvious:

- Codependent Coding web product;
- Hipster Stack schema/core/CLI;
- Maximal Template authoritative source;
- Loaded Vibes plugin source;
- shared governance/TypeScripture references;
- tests and build tooling.

Do not invent extra services, apps, packages, or governance layers without an actual ownership need.
