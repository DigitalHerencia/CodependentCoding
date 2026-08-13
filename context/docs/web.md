---
title: Hipster Stack Website, Simples, and Constituter
artifact: web
status: active
product: Hipster Stack
authority: source-of-truth
---

# Hipster Stack Website, Simples, and Constituter

## Product role

The web app is a stateless developer tool with four coherent surfaces:

```text
/              Product
/libraries/*   Simples™
/docs/*        canonical Docs
/configure     Constituter™
```

`Simples™` and `Constituter™` are branded presentation names over existing routes. Do not infer a second domain model or change route paths merely for vocabulary. No account system, hosted project database, billing product, or remote generation backend is required.

## Visual acceptance

`context/mockups/landing.png`, `libraries.png`, `config.png`, and `builder.png` remain presentation authority for the overhaul. Reproduce their structure, hierarchy, density, spacing, dark panels, control geometry, restrained glow, and Digital Herencia desert/circuit composition faithfully.

Mockups are not semantic authority. Correct illustrative labels/options when they conflict with actual repository-supported behavior.

## Brand lock

- canvases are black or `#05030b`;
- primary text is white;
- signal/underline/glow color is `#2f7a8d`;
- headings/titles use Copperplate Gothic Bold when available, with a build-safe bundled fallback, white uppercase text, transparent backgrounds, and restrained `#2f7a8d` glow;
- body/UI copy uses JetBrains Mono;
- code uses Fira Code;
- Hipster Stack™ wordmark uses Copperplate Gothic Bold, white uppercase text, restrained `#2f7a8d` glow, and a small scale-up hover;
- Hipster Stack tagline is `Constituted not Composable` in JetBrains Mono;
- Digital Herencia wordmark uses Big Shoulders Display Bold or the closest build-safe equivalent; its `A Data Cartel` tagline uses the Copperplate heading stack;
- header/footer are black; navigation uses the Copperplate stack, white text, a small scale-up hover, and `#2f7a8d` active underline/glow;
- the landing page uses `public/Loaded Vibes Crown.png` for the crown motif and `public/Digital Herencia Banner.png` as the full-width bottom background treatment;
- Simples, Simples details, and Constituter use `public/Digital Herencia Desert BG.png` as the full-width bottom background treatment;
- background art stays anchored to the bottom of the page while the black footer sits above it cleanly;
- design tokens belong in the Tailwind CSS v4 CSS-first theme layer and responsive overrides are mobile-first.

## Required public copy

### Product hero

```text
When epistemologies fail, The Stack still governs.
The Hipster Stack™
Constituted not Composable
```

### Simples

```text
An ontological survey of idiolectal semantics.
Esoteric by design.
No Ordinary Objects™
```

### Constituter

```text
No, Simples™ cannot be composed "Hipster-Wise".
They are simply a dynamic system arranged in a configuration that is Hipster-ing™.
```

The site may include the approved irreverent notes and mereological-nihilism jokes supplied by the owner. Keep them presentation-only and do not let joke vocabulary leak into technical contracts, identifiers, or configuration semantics.

## BoldKit

Use actual React source from the `ANIBIT14/boldkit` GitHub/shadcn registry as locally owned presentation source when HS-303 reaches implementation. Import only the primitives/blocks the mockups need. Adapt composition to the Hipster Stack visual contract rather than inheriting stock BoldKit styling.

## TanStack reference

TanStack is an interaction reference only: compact selections, clear button hierarchy, browsable categories, inspectable configuration/generated-plan consequences, and obvious Constituter handoff. Do not copy TanStack styling or introduce unrelated TanStack libraries.

## Architecture

For these primarily public/static surfaces use the proportional application grammar:

```text
route/page → feature orchestration → pure blocks/components → UI primitives
```

Pages/layouts stay thin and Server Components by default. Constituter owns the deliberate local client island. Pure presentation owns no shared configuration authority, protected I/O, Prisma, provider SDKs, or generator side effects.

## Product

The landing page follows `landing.png`, using the supplied Crown and Digital Herencia Banner assets. Constituter is the primary action, Simples is the exploratory building-block surface, and Docs remains canonical end-user guidance. Use truthful generator copy and no unsupported options.

## Simples

Simples preserves the existing `/libraries/*` catalog/detail route family. It explains supported building blocks, relationships, fixed/configurable status, and truthful examples without implying that those things are independently composable packages or creating another configuration rules engine.

## Docs

Root `docs/` remains canonical end-user documentation rendered under `/docs/*`. Do not duplicate canonical technical content into Simples metadata.

## Constituter

Constituter follows `builder.png`: dense two-panel workbench, schema-backed controls left, inspectable resolved configuration/output right. Preserve current working resolver/serialization/download/copy/share behavior through the HS-302 identifier rename. Only actual supported properties are editable.

## Implementation economy

Reuse current routes/helpers/shared semantics. Introduce only components that remove real duplication or enforce presentation responsibilities. Delete obsolete CSS/components/helpers after their final caller is replaced. Add no backend, CMS, analytics project, animation library, or new validation harness for this overhaul. Run only the focused checks named by the active spec.
