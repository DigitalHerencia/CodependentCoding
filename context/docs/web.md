---
title: Hipster Stack Website and Builder
artifact: web
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Website and Builder

## Product role

The web app is a developer tool with three coherent surfaces:

```text
/            Product
/docs/*      canonical + interactive Docs
/configure   Builder
```

Legacy `/libraries` URLs may redirect into Docs during HS-305. No account system, hosted project database, billing product, or remote generation backend is required.

## Visual acceptance

`context/mockups/landing.png`, `libraries.png`, `config.png`, and `builder.png` are presentation authority for the current overhaul. Reproduce their structure, hierarchy, density, spacing, dark panels, control geometry, typography emphasis, restrained cyan glow, and Digital Herencia desert/circuit composition faithfully.

Mockups are not semantic authority. Correct illustrative labels/options when they conflict with actual repository-supported behavior.

## Brand lock

- near-black canvas and white primary text;
- primary cyan around `#48c8c8`, with only minimal accessible supporting teal/cyan values;
- restrained glow, thin hard-edged borders, no violet/magenta competing system;
- Big Shoulders Display (heavy/condensed) or the closest build-safe equivalent for the Hipster Stack wordmark/display headings; clean sans-serif body/UI type;
- use `public/Digital Herencia Desert BG.png` as an intentional lower-page horizon/transition with controlled crop/fade;
- keep Digital Herencia secondary to the Hipster Stack product identity.

## BoldKit

Use actual React source from the `ANIBIT14/boldkit` GitHub/shadcn registry as locally owned presentation source. Import the approved primitive set to `apps/web/components/ui/` and only the blocks needed by the mockups to `components/blocks/`. Adapt tokens/composition to the Hipster Stack mockups. Do not depend on BoldKit at runtime and do not inherit its stock aesthetic.

## TanStack reference

TanStack is an interaction reference only: compact selections, clear button hierarchy, browsable categories, inspectable configuration/generated-plan consequences, and obvious Builder handoff. Do not copy TanStack styling or introduce unrelated TanStack libraries.

## Architecture

For these primarily public/static surfaces use the proportional application grammar:

```text
route/page → feature orchestration → pure blocks/components → UI primitives
```

Pages/layouts stay thin and Server Components by default. Builder owns a deliberate local client island. Pure presentation owns no shared configuration authority, protected I/O, Prisma, provider SDKs, or generator side effects.

## Product

The landing page follows `landing.png`; Builder is the primary CTA and Docs is the secondary exploration path. Use truthful generator copy and no unsupported options.

## Interactive Docs

HS-305 folds the old Libraries experience into Docs. `docs/` remains canonical end-user content. Web metadata may organize categories, relationships, configuration examples/status, and `Open in Builder` actions, but must not become another configuration rules engine.

## Builder

The Builder follows `builder.png`: dense two-panel workbench, schema-backed controls left, inspectable resolved configuration/output right. Preserve current working resolver/serialization/download/copy/share behavior through the HS-302 rename. Only actual supported properties are editable.

## Implementation economy

Reuse current routes/helpers/shared semantics. Introduce only components that remove real duplication or enforce presentation responsibilities. Delete obsolete CSS/components/helpers immediately after their final caller is replaced. Add no backend, CMS, analytics project, animation library, or new validation harness for this overhaul. Run only the focused checks named by the active spec.
