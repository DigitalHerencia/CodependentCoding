---
title: Loaded Vibes Website and Configurator
artifact: web
status: active
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Website and Configurator

## Product role

The web app presents Loaded Vibes as a coherent developer product and gives users a stateless visual configuration surface over the same configuration contract used by the CLI.

It has four jobs:

1. explain the product concisely;
2. expose the Loaded Vibes system as browsable libraries/building blocks;
3. let users compose a supported configuration visually;
4. render the canonical end-user documentation from `docs/`.

It is not a hosted project-control product, generic stack marketplace, or marketing site that invents choices the generator cannot honor.

## Routes and navigation

```text
/                    Product / landing page
/libraries           library/building-block catalog
/libraries/[slug]    individual library/building-block detail
/docs/*              end-user Loaded Vibes documentation
/configure            Builder visual configuration workbench
```

Primary navigation:

```text
Product | Libraries | Docs | Builder
```

`Builder` links to `/configure`; do not rename a working route merely to make the URL literal.

No Loaded Vibes account system, hosted project database, Loaded Vibes billing system, or remote build backend is required.

## Visual acceptance contract

The current web replacement is mockup-driven. The implementation working tree contains a local `context/mockups/` directory with four visual subjects:

- Product/landing page;
- Libraries catalog;
- individual library/configuration detail page;
- Builder.

Codex must inspect that directory and map the actual files by their visual content before editing. Do not assume filenames and do not continue if the required mockup subject is missing.

The mockups are the design standard. Faithfully reproduce their:

- page structure and section order;
- visual hierarchy and information density;
- spacing and proportions;
- dark surfaces and border treatment;
- typography scale and emphasis;
- navigation placement;
- card composition;
- restrained teal/cyan glow;
- Loaded Vibes and Digital Herencia brand placement;
- desert/circuit footer treatment;
- interaction model implied by controls and links.

Do not reinterpret them into another aesthetic, generic SaaS template, or personal redesign.

The mockups are **presentation authority, not semantic authority**. Apply product judgment when literal text or controls would contradict the real product. Button/control labels, JSON examples, category wording, and link targets may be adjusted to describe actual Loaded Vibes behavior. Preserve the depicted design and interaction purpose while replacing illustrative nonsense with the correct repository-supported action.

Never implement a fake toggle, fake provider choice, fake recipe field, or fake output merely because it appears illustratively in a mockup. Shared schema/core and current repository behavior remain authoritative for functionality.

## Brand and visual direction

Loaded Vibes is dark-only.

Use the established brand family:

- near-black canvas;
- white primary type;
- muted teal/cyan centered on `#2f7a8d` and closely related accessible tones;
- restrained glow rather than neon saturation;
- thin bordered dark panels;
- Big Shoulders-style condensed display treatment for major Loaded Vibes headings where available;
- clean sans-serif UI/body typography;
- Loaded Vibes crown/circuit motif as a controlled brand device;
- Digital Herencia desert/circuit landscape as a lower-page/footer device;
- Digital Herencia parent-brand lockup kept secondary to Loaded Vibes.

Avoid violet/magenta-heavy styling, beige editorial styling, startup-confetti aesthetics, excessive gradients, partner grids, decorative dashboard density, and marketing sections that do not improve product comprehension.

Preserve the repository-root `public/` brand assets and their source images. The website may consume them through the smallest build-compatible approach, but must not delete that directory merely because the Next.js app lives under `apps/web`.

## Architecture and implementation method

The UI replacement must remain recognizably built according to the Codependent Coding knowledge system, Hipster Stack, and Loaded Vibes WebApp Architecture. The canonical architectural grammar is:

```text
Routes adapt.
Features orchestrate.
Components render.
Fetchers read.
Actions write.
Schemas validate.
Authorization decides.
Transactions preserve invariants.
Webhooks reconcile external truth.
```

For these mostly static/product-presentation surfaces, use the applicable subset rather than ceremonial layers:

```text
route/page -> feature/presentation orchestration -> shared/domain presentation
```

- keep App Router pages/layouts thin;
- default to Server Components;
- create a client boundary only where browser interaction/local state requires one, chiefly Builder;
- keep pure presentation free of protected I/O, provider SDKs, Prisma, or product authority;
- reuse the existing browser-safe `@loaded-vibes/core` contract for Builder semantics;
- do not add fetchers/actions/workflows when the page has no protected read or mutation just to satisfy a diagram;
- do not turn a focused website refactor into a repository-wide architecture migration.

Relevant doctrine sources are the Codependent Coding knowledge system (`docs/10-loaded-vibes-architecture.md`, `docs/11-hipster-stack-tech-map.md`, `docs/12-layer-contracts.md`, `docs/18-agent-execution.md`) and the mirrored canonical Loaded Vibes architecture source in DevNotes. Local repository governance controls when it is more specific.

## Product landing page

The landing mockup should communicate with minimal copy:

- Loaded Vibes generates a serious production-minded SaaS starting point;
- the user chooses bounded product/configuration differences rather than architecture;
- Builder is the primary interactive CTA;
- Libraries exposes the product building blocks;
- Docs is the canonical end-user reference;
- the output is a real generated repository owned by the user.

The hero/product preview may summarize Builder state, but must not expose fake provider choices or unsupported configuration.

## Libraries

`/libraries` is a browsable product-building-block catalog, not a package registry and not a generic technology catalog.

The visual mockup groups concepts under a small number of categories such as Foundation, Identity, Data, Revenue, and Interface. The actual concepts and descriptions must represent the way Loaded Vibes applications are built under the Loaded Vibes architecture and Hipster Stack.

Presentation metadata may be web-owned, but configuration truth comes from existing repository sources where available:

- `packages/core/src/capabilities.ts` for capability labels, dependencies, and fixed/configurable status;
- `packages/core/src/presets.ts` for real product presets;
- `packages/schema/src/recipe.ts` for valid recipe fields;
- Loaded Vibes fixed-foundation governance for non-configurable architectural elements.

Do not duplicate dependency/fixed semantics in a second web-only rules engine.

Individual library pages make configuration/status the primary useful content. A configurable capability may show the smallest valid `loadedvibes.json` example needed to enable it. A fixed-foundation library must be identified as fixed/included rather than exposing a decorative toggle or fake provider selector. Related-library links are presentation/navigation metadata only.

## Builder

`/configure` is the Builder.

The Builder follows the Builder mockup: a compact configuration surface paired with a readable recipe/result preview. It should feel like composing a supported Loaded Vibes starting point, not completing a long wizard and not shopping for architecture.

Preserve existing stateless product-valid behavior:

- shared schema/core resolution;
- real product presets;
- real configurable modules/capabilities;
- product identity fields;
- bounded design fields;
- copy/download of `loadedvibes.json`;
- copyable CLI handoff;
- shareable serialized configuration if it remains cheap and working.

Fixed architecture and fixed capabilities may be shown as read-only selected/included items for comprehension, but never as user-switchable choices.

The result panel must show actual normalized configuration and resolved inclusions. A representative generated-app preview may be removed when it duplicates the mockup-driven recipe/result experience and no longer adds product value.

## Docs

`/docs/*` remains a conventional end-user documentation experience backed by canonical content in `docs/`.

The docs renderer does not need a bespoke mockup-driven content redesign. It should share the global brand/navigation shell where practical without making documentation harder to read or introducing decorative product-page density.

## Output and statelessness

The Builder may provide:

- `loadedvibes.json` copy/download;
- a copyable CLI command;
- a shareable local/URL representation when already supported;
- a readable summary of resolved output.

It does not perform local generation on the hosted website.

## Implementation economy

For the mockup replacement:

- inspect first, then make the smallest complete refactor;
- prefer reusing current routes, config helpers, and browser-safe core;
- introduce only shared components that remove real duplication or enforce the established presentation hierarchy;
- delete obsolete CSS/components/helpers immediately after their final caller is replaced;
- do not add a UI framework, icon package, animation library, design-token subsystem, backend, or new validation harness merely to reproduce the mockups;
- run only the existing web checks that directly establish the changed behavior.