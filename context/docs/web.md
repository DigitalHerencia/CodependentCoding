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
2. expose the Loaded Vibes system as browsable libraries/capabilities;
3. let users compose a supported configuration visually;
4. render the canonical end-user documentation from `docs/`.

It is not a hosted project-control product, generic stack marketplace, or marketing site that invents choices the generator cannot honor.

## Routes and navigation

```text
/                    Product / landing page
/libraries           library/capability catalog
/libraries/[slug]    individual library/capability detail
/docs/*              end-user Loaded Vibes documentation
/configure            Builder visual configuration workbench
```

The primary navigation labels are:

```text
Product | Libraries | Docs | Builder
```

`Builder` links to `/configure`; the route does not need to be renamed merely to match the navigation label.

No Loaded Vibes account system, hosted project database, Loaded Vibes billing system, or remote build backend is required.

## Current visual acceptance inputs

The current web replacement work is mockup-driven. When the following files are present in the implementation working tree, they are the visual acceptance artifacts for LV-208 through LV-210:

```text
context/mockups/landing.png
context/mockups/libraries.png
context/mockups/config.png
context/mockups/builder.png
```

Do not reinterpret these mockups into a different aesthetic or generic SaaS design. Match their hierarchy, density, spacing, dark surfaces, border treatment, typography scale, navigation, card composition, restrained glow, and Digital Herencia/Loaded Vibes brand placement as faithfully as practical across responsive layouts.

The mockups are presentation authority, not permission to invent unsupported product semantics. If placeholder text, toggles, providers, or JSON in a mockup conflict with the shared schema/core, keep the visual treatment and bind it to real repository-supported behavior instead.

If a required mockup is absent from the working tree, stop rather than guessing its visual content.

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

Preserve the repository-root `public/` brand assets. Website implementation may import or otherwise consume them through the smallest build-compatible approach, but must not delete that directory or its source images.

## Product landing page

The landing page follows `context/mockups/landing.png` and should communicate, with minimal copy:

- Loaded Vibes generates a serious production-minded SaaS starting point;
- the user chooses bounded product/configuration differences rather than architecture;
- Builder is the primary interactive CTA;
- Libraries exposes the product building blocks;
- Docs is the canonical end-user reference;
- the output is a real generated repository owned by the user.

The hero/product preview may summarize Builder state, but must not expose fake provider choices or unsupported configuration.

## Libraries

`/libraries` is a browsable product-building-block catalog, not a package registry.

The mockup groups concepts under a small number of categories such as Foundation, Identity, Data, Revenue, and Interface. Presentation metadata may be web-owned, but configuration truth must come from existing repository sources where available:

- `packages/core/src/capabilities.ts` for capability labels, dependencies, and fixed/configurable status;
- `packages/core/src/presets.ts` for real product presets;
- `packages/schema/src/recipe.ts` for valid recipe fields;
- the fixed-foundation governance for non-configurable architectural elements.

Do not duplicate dependency/fixed semantics in a second web-only rules engine.

Individual library pages should make configuration/status the primary useful content. A configurable capability may show the smallest valid `loadedvibes.json` example needed to enable it. A fixed-foundation library must be identified as fixed/included rather than exposing a decorative toggle or fake provider selector. Related-library links are presentation/navigation metadata only.

## Builder

`/configure` is the Builder.

The Builder follows `context/mockups/builder.png`: a compact configuration panel paired with a readable recipe/result preview. It should feel like composing a supported starting point, not completing a long wizard.

The Builder must preserve the existing stateless capabilities that are still product-valid:

- shared schema/core resolution;
- real product presets;
- real configurable modules/capabilities;
- product identity fields;
- bounded design fields;
- copy/download of `loadedvibes.json`;
- copyable CLI handoff;
- shareable serialized configuration if it remains cheap and working.

Fixed architecture and fixed capabilities may be shown as read-only selected/included items for comprehension, but never as user-switchable choices.

The configuration/result panel should show actual normalized configuration and resolved inclusions. A representative generated-app preview is optional and should be removed if it no longer serves the mockup-driven Builder experience or duplicates the recipe/result preview.

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

- prefer refactoring/reusing the current app routes, shared config helpers, and browser-safe core;
- introduce only shared components that remove real duplication across the mocked pages;
- delete obsolete CSS/components/helpers after their final caller is removed;
- do not add a UI framework, icon package, animation library, design-token system, or new validation harness merely to reproduce the mockups;
- use the existing web typecheck/build and only narrowly relevant repository checks.