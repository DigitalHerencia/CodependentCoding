---
id: HS-304
title: Rebuild Product shell and landing from approved mockup
status: active
type: implementation-spec
order: 304
depends_on: [HS-302, HS-303]
issue: 138
---

# HS-304 — Product shell and landing

## Outcome

Faithfully implement `context/mockups/landing.png` under Hipster Stack branding using the HS-303 design foundation.

## Required inputs

Read this spec, Issue #138, `context/docs/web.md`, `landing.png`, and only current shell/Product files plus direct presentation dependencies.

## Architecture guardrail

`app/page.tsx` remains thin and server-first. The Product feature composes pure blocks/components. Do not introduce protected I/O or generator semantics into presentation.

## Required composition

Preserve the mockup's brand moment, two-column introduction/Builder preview, compact entry cards, workflow strip, foundation summary, spacing/proportions, and cyan/black treatment. Navigation is `Product | Docs | Builder`. Use truthful generator copy and CTA labels. Use the Hipster Stack wordmark. Integrate the Digital Herencia Desert BG as the lower horizon/footer transition.

Use BoldKit blocks only where they reduce code without changing the mockup's composition.

## Cleanup

Delete replaced old branding markup/styles/components after their last caller is gone.

## Non-goals

No backend state, new configuration choices, generator/schema/template change, or unrelated marketing content.

## Verification

`pnpm --dir apps/web typecheck`, `pnpm --dir apps/web build`, desktop mockup comparison, one narrow-width inspection, and direct CTA/navigation smoke.
