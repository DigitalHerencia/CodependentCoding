---
id: LV-210
title: Refactor the Builder to match the mockup and real configuration model
status: active
type: implementation-spec
order: 10
depends_on: [LV-208, LV-209]
issue_title: 'LV-210: Refactor Builder UI/UX to match the mockup and real config semantics'
---

# LV-210 — Refactor Builder UI/UX to match the mockup and real config semantics

## Outcome

Replace the current multi-section configurator UI with the compact Builder composition shown in the local Builder mockup, while preserving the real stateless Loaded Vibes configuration contract, CLI/JSON handoff, and Codependent Coding / Hipster Stack boundaries.

## Required inputs

Read only:

- this spec;
- `context/docs/web.md`;
- `context/docs/configuration.md`;
- `.agents/contracts/product.yaml`;
- local `context/mockups/` and identify the Builder mockup by visual content;
- `apps/web/components/configurator.tsx`;
- `apps/web/lib/configurator.ts`;
- `packages/core/src/capabilities.ts`;
- `packages/core/src/presets.ts`;
- `packages/schema/src/recipe.ts`;
- directly imported preview/style files only when deciding whether they remain necessary.

Do not crawl `template/`, DevNotes, CodependentCoding, or unrelated generator code unless a concrete semantic contradiction appears.

## Architecture guardrail

Keep the current Builder as a deliberate client island over browser-safe core semantics:

```text
/configure route -> Builder client feature -> pure controls/result presentation
                                  |
                                  -> @loaded-vibes/core/browser
```

Do not move product authority into UI components. Do not introduce server state, protected I/O, provider SDK calls, Prisma, or unnecessary Server Actions.

## Starting state

The current `Configurator` already supports:

- stateless draft state;
- URL recipe deserialization/share link;
- real optional capabilities;
- product identity fields;
- bounded design choices;
- normalized recipe resolution;
- JSON download;
- CLI command copy;
- representative generated-app preview.

Its information architecture and styling no longer match the Builder mockup. The existing `LivePreview`/preview metadata may be redundant once the mockup's normalized recipe/result panel becomes the primary preview.

## Primary files

Expected edits are intentionally concentrated:

- `apps/web/components/configurator.tsx`
- `apps/web/lib/configurator.ts` only where small helpers/default handling improve the new composition
- `apps/web/app/globals.css`
- `apps/web/app/configure/page.tsx` only if route-level presentation needs a small adjustment
- `apps/web/components/live-preview.tsx` and `apps/web/lib/preview.ts` only to remove them if no longer used
- LV-208 shared shell/header/footer only for active navigation consistency

Do not rename files/components merely for cosmetic vocabulary if keeping them saves edits and causes no ambiguity.

## Builder composition

Faithfully reproduce the mockup's overall structure:

- concise `Builder` heading and one-line explanation;
- compact top actions;
- left configuration card organized into a small number of horizontal groups;
- right `Recipe Preview` / selected-stack area;
- readable normalized `loadedvibes.json` panel with copy action;
- compact output/handoff summary beneath;
- shared Digital Herencia landscape/footer treatment.

The exact labels/options must reflect real Loaded Vibes semantics rather than the illustrative mockup.

### Recommended real control mapping

Use the smallest layout that preserves all current useful configuration:

1. **Starting point / preset** — map to actual `productPresets`: Bare golden app, B2B SaaS, Client portal, Platform/marketplace.
2. **Product identity** — compact package name, display name, and description controls.
3. **Optional product surfaces** — real configurable capabilities such as Invitations, Onboarding, Admin, Marketing, Sample Domain.
4. **Revenue** — real Billing and Stripe Connect controls with existing dependency resolution.
5. **Design** — compact controls for the existing theme/mode/radius/density/navigation fields.

Do not copy fake mockup choices such as `SaaS | Dashboard | Internal Tool` if they do not map cleanly to current presets. Preserve the visual selector treatment while using the real presets.

Fixed foundation concepts such as Auth/Clerk, Organizations, RBAC, Neon/Postgres, Prisma, RLS, and core governance may appear in the mockup-style **Selected Stack** summary as read-only included items. They must not become toggles or provider selectors.

## Actions and output

Preserve real existing behavior using labels appropriate to the mockup hierarchy:

- copy/download normalized `loadedvibes.json`;
- copy CLI command;
- share recipe URL if it remains working and cheap;
- reflect dependency auto-inclusion truthfully;
- show actual included/excluded optional capabilities in a compact way.

Do not label a hosted website action `Generate Stack` if it does not actually generate locally/hosted. Use a truthful action such as `Download Recipe`, `Copy CLI Command`, or equivalent while preserving the primary-action placement shown in the mockup.

## Refactor and cleanup

- reuse `resolveConfiguratorRecipe`, serialization, dependency resolution, and shared core rather than rewriting them;
- simplify state/rendering around the new groups rather than maintaining old and new layouts simultaneously;
- if `LivePreview` and `lib/preview.ts` have no remaining product value/callers after the result-panel redesign, delete them in this issue;
- remove obsolete old workbench CSS/classes after their final use;
- dedupe shared card/button/layout styles created by LV-208/LV-209 when a small consolidation is obvious;
- do not perform a broad CSS architecture rewrite just because the stylesheet is large;
- do not add dependencies unless the mockup is impossible to reproduce with existing React/CSS/assets, and assume it is not impossible until proven otherwise.

## Docs integration

No docs-page mockup is required. Confirm only that `/docs/*` remains readable and uses the shared global shell/navigation. Do not redesign documentation content or build a new documentation framework.

## Non-goals

- no hosted generation;
- no account/backend state;
- no arbitrary provider/stack choices;
- no new recipe schema unless a genuine pre-existing product requirement is discovered and separately escalated;
- no template/generator refactor;
- no new tests, Playwright suite, visual-regression system, analytics, observability, or design-system project.

## Acceptance

- `/configure` faithfully reproduces the identified Builder mockup's composition, spacing, visual hierarchy, panel geometry, dark/teal treatment, and responsive intent;
- every interactive control maps to an actual current preset, recipe field, or configurable capability;
- fixed foundation items are read-only summaries, never decorative toggles;
- the displayed JSON is the actual normalized configuration consumed by the CLI/core;
- copy/download/CLI/share behavior that remains visible works;
- dependency resolution remains delegated to shared core;
- old workbench UI and dead preview code/styles are removed after replacement;
- `/`, `/libraries`, representative library detail, `/configure`, and `/docs` share one coherent shell/brand family;
- implementation remains a stateless client feature over browser-safe core, consistent with Loaded Vibes architecture;
- no unrelated template/core/CLI behavior changes.

## Verification

Use only the checks required to establish the changed web surface:

1. `pnpm --dir apps/web typecheck`
2. `pnpm --dir apps/web build`

Then manually exercise at least:

- switch between two real presets;
- toggle Billing and Stripe Connect and confirm resolved dependencies/output change correctly;
- change product identity and one design field;
- copy/download recipe and copy CLI command;
- load one share URL if share remains exposed;
- inspect Builder at desktop width against the mockup and one narrow width for overflow/usability;
- smoke `/`, `/libraries`, one library detail, and `/docs` for shell/navigation regressions.

Do not run repository-wide `pnpm validate` unless one of these focused checks exposes a cross-package regression that requires it.
