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

Create the minimal reusable presentation foundation required by the approved mockups using locally owned BoldKit source and the Hipster Stack/Digital Herencia brand family.

## Required inputs

Read this spec, Issue #137, `context/docs/web.md`, all four mockups for cross-page consistency, current `apps/web` package/CSS/header/footer, Vouch `components.json` only for the existing `@boldkit` registry precedent, and only BoldKit source needed for the approved primitives/blocks.

## Design lock

- near-black canvas, white text, primary cyan approximately `#48c8c8`;
- Big Shoulders Display heavy/condensed wordmark/display treatment or closest build-safe equivalent; clean sans body/UI;
- thin hard-edged dark panels and restrained glow;
- Digital Herencia Desert BG used as a controlled lower-page horizon with fade/crop;
- mockups remain visual authority.

## BoldKit

Add shadcn-compatible web registry configuration. Import the approved React UI primitives as locally owned `apps/web/components/ui` source. Adapt only blocks actually used by the mockups into `components/blocks`. Add exact required dependencies only. No runtime dependency on the GitHub repository and no stock BoldKit redesign.

## Architecture

Primitives and blocks are pure presentation. They do not own configuration resolution, protected I/O, or generator semantics.

## Non-goals

No Product/Docs/Builder full-page implementation, generator changes, animation framework, or new validation system.

## Verification

Web typecheck/build plus desktop and narrow focused inspection of the new foundation.
