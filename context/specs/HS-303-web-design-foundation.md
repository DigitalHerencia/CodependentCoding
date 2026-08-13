---
id: HS-303
title: Establish BoldKit-backed Hipster Stack web design foundation
status: active
type: implementation-spec
order: 303
depends_on: [HS-301, HS-302]
issue: 137
---

# HS-303 — Web design foundation

## Outcome

Finish the minimal reusable presentation foundation required by the approved mockups using locally owned BoldKit source without undoing the owner-approved brand/tokens already landed before Codex execution.

## Required inputs

Read this spec, Issue #137, `context/docs/web.md`, all four mockups for cross-page consistency, current `apps/web` package/CSS/header/footer, Vouch `components.json` only for the existing `@boldkit` registry precedent, and only BoldKit source needed for the approved primitives/blocks.

## Locked baseline

Treat the current pre-Codex implementation as approved unless a concrete accessibility/build problem requires a focused correction:

- canvases `#000000` and `#05030b`;
- primary text white; signal/underline/glow `#2f7a8d`;
- Tailwind CSS v4 CSS-first semantic tokens and mobile-first breakpoints in `apps/web/app/globals.css`;
- Copperplate Gothic Bold stack for headings/titles and Hipster Stack wordmark, with bundled build-safe fallback;
- JetBrains Mono body/UI; Fira Code code; Big Shoulders Display for Digital Herencia;
- Hipster Stack™ / `Constituted not Composable` wordmark treatment;
- Digital Herencia / `A Data Cartel` wordmark treatment;
- `Digital Herencia Banner.png` on Product and `Digital Herencia Desert BG.png` on Simples/Constituter;
- `Loaded Vibes Crown.png` retained as the approved landing crown motif;
- mockups remain visual authority.

Do not reintroduce the retired cyan/violet/magenta system or replace these brand decisions with stock BoldKit defaults.

## BoldKit

Add shadcn-compatible web registry configuration. Import the approved React UI primitives as locally owned `apps/web/components/ui` source. Adapt only blocks actually used by the mockups into `components/blocks`. Add exact required dependencies only. No runtime dependency on the GitHub repository and no stock BoldKit redesign.

## Architecture

Primitives and blocks are pure presentation. They do not own configuration resolution, protected I/O, or generator semantics.

## Non-goals

No Product/Simples/Docs/Constituter full-page rewrite, generator changes, animation framework, or new validation system.

## Verification

Web typecheck/build plus desktop and narrow focused inspection of the new foundation.
