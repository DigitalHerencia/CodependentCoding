# Anthimeria independent architecture visualizer

Approved by the owner's 2026-11-20 implementation request. Delivery: Issue #385.
The owner's attached CodeViz image was directly inspected after it was supplied.
Its parent/child groups, restrained connectors and adjacent source panel guide the
layout; it does not supply repository-specific architecture semantics.

## Scope and objective acceptance

- Separate trusted source acquisition, AST analysis and graph presentation.
- SourceAdapter accepts workspace or immutable snapshots; switching the configured
  source requires no engine or visualization changes. Ship site and template examples.
- Containment is the initial ontology. Imports and JSX composition are separate
  selections. Execution requires observed trace data and is unavailable without it.
- Exactly one graph mounted. Switching cancels pending work, drops previous graph
  and source state. Fetch only selected graph pages and selected source files.
- At most 24 children plus their parent per graph, at most 60 edges; deterministic
  paging, explicit omitted counts. Source chunks at most 200 lines; server Shiki.
- Retain `/anthimeria`, existing site routes and visual identity. No Monaco runtime.
- Verify focused regression/behavior tests, changed-file lint/format, root typecheck,
  production build, browser interactions, responsive layout, source navigation and
  copy. Measure payload, transferred JavaScript, frame timing and heap under repeated
  ontology switches at iPad sizes. Chromium/WebKit emulation cannot certify a physical
  iPad; retain the real-device release gate explicitly if hardware is unavailable.

## Implementation boundaries

Source readers, preprocessing and pure analysis live in existing `lib/content/`;
portable data contracts in `types/`; browser orchestration in `features/anthimeria/`;
presentation in `components/blocks/`; build orchestration in `scripts/`.
No template business types, feature conventions or layer categories in the engine.
Only reviewed public source roots are configured. Build snapshots are server-only
artifacts, never public static assets. Errors are explicit; no fake source fallback.

## Verification and delivery

Use the requested production build for a temporary local production server, never a
development server. Stop owned processes. No deployment. Keep the PR unmerged while
the physical iPad gate is outstanding; do not describe emulation as device evidence.

## Reusing the engine

`types/architectureTypes.ts` defines the adapter and normalized graph contract.
`lib/content/architecture-analysis.ts` accepts any SourceAdapter; it never imports
code from the analyzed repository. `workspaceAdapter` reads a caller-approved file
list within a real filesystem root; `snapshotAdapter` accepts a source map supplied
by an archive, repository provider or snapshot. The analyzer uses the TypeScript
parser/binder for JS/TS, local static import/re-export resolution, configured path
aliases and JSX import bindings. Other source languages remain navigable source;
the engine does not invent dependencies for unsupported languages or unresolved
packages. Dynamic import, call and execution relationships are deliberately absent.

`projectGraph(snapshot, ontology, scope, page)` is pure and independent of Next.js,
React and the examples. Containment uses source directories, never template layers.
The host's `scripts/build-architecture.ts` configures the two example source roots,
preprocesses facts and stores source outside public/. Add another trusted source in
that host registry or feed an adapter directly; no engine/view changes are needed.
Build with `pnpm build` (includes snapshot preprocessing), or run
`pnpm architecture:snapshot` before the owner's normal development workflow.
Snapshots are immutable per build and both data routes trace those artifacts into
the production server bundle. Highlighting uses server-only Shiki with eight
explicit grammar loaders; unknown extensions use escaped plain text. At most one
200-line source chunk is mounted. Copy fetches the complete selected file only on
the user gesture, capped at 256 KB by the source adapter.

## Visual reference mapping

The supplied CodeViz image has a parent above grouped child boundaries, restrained
connectors, readable labels and source adjacent to the map. Anthimeria uses those
structures with its existing cyan/dark palette. Directory boundaries are verified
from the repository; it does not invent the reference's business groupings. The
reference's query prompt, runtime graph and Python model are outside this scope.
