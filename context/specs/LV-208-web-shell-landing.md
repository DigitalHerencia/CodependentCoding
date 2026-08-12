---
id: LV-208
title: Replace the shared web shell and Product landing page
status: active
type: implementation-spec
order: 8
depends_on: []
issue_title: 'LV-208: Replace the web shell and Product landing page from mockups'
---

# LV-208 — Replace the shared web shell and Product landing page

## Outcome

Replace the current generic website chrome and `/` page with the Loaded Vibes / Digital Herencia Product/landing mockup in local `context/mockups/`, while establishing only the small shared shell needed by later Libraries and Builder work.

## Required inputs

- inspect local `context/mockups/` and identify the Product/landing mockup by visual content;
- `context/docs/web.md`;
- `context/docs/product.md`;
- `.agents/contracts/product.yaml`;
- current `apps/web` implementation.

If the required mockup subject is absent, stop instead of approximating it.

## Architecture guardrail

Implement the affected surface using the applicable Loaded Vibes / Codependent Coding presentation grammar:

```text
route/page -> feature/presentation orchestration -> shared presentation
```

Keep pages thin, prefer Server Components, and add no client boundary unless interaction requires one. Do not create ceremonial layers with no behavior.

## Starting state

The current site uses `SiteHeader` with `Overview`, `Docs`, and `Open configurator`; `/` renders three editorial sections; global styling is concentrated in `apps/web/app/globals.css`.

## Primary files

Expected edits are intentionally narrow:

- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/globals.css`
- `apps/web/components/site-header.tsx`

A focused `features/product` or equivalent presentation feature may replace page-level bulk when it keeps `app/page.tsx` thin. Add a shared footer/brand component only if it removes real duplication needed by LV-209/LV-210.

Reuse existing repository brand assets. Do not delete the repository-root `public/` directory or its images.

## Scope

- replace primary navigation with `Product | Libraries | Docs | Builder`;
- keep `/` as Product and `/configure` as the Builder route;
- faithfully reproduce the landing mockup's section structure, hierarchy, spacing, proportions, dark surfaces, Builder-preview treatment, product-entry cards, flow/category treatment, and Digital Herencia footer/landscape treatment;
- make CTA links functional: Builder -> `/configure`, Libraries -> `/libraries`, Docs -> `/docs`;
- adapt literal button labels/copy when necessary so they describe real Loaded Vibes behavior without changing the depicted interaction purpose;
- use concise product copy consistent with current product/governance rather than inventing providers or architecture choices;
- establish reusable shell/footer/brand styling only where LV-209/LV-210 need the same treatment;
- keep docs content/renderer intact.

## Non-goals

- do not implement Libraries pages in this issue;
- do not refactor Builder configuration behavior in this issue;
- do not add animation libraries, icon packages, UI frameworks, or a new design-system layer;
- do not redesign generator/core/schema/template code;
- do not add new tests or visual-test infrastructure.

## Acceptance

- `/` faithfully reproduces the identified Product/landing mockup rather than the previous page or a reinterpretation;
- shared header and footer match the mockup family and navigation routes correctly;
- branding uses the existing Loaded Vibes/Digital Herencia assets and black/white/teal direction;
- literal mockup copy is adjusted only when needed for truthful product behavior;
- no mockup placeholder is turned into unsupported configuration/product behavior;
- `/docs/*` still renders through the shared shell without a content redesign;
- obsolete landing-specific markup/styles replaced by this issue are removed rather than retained in parallel.

## Verification

Run only:

1. `pnpm --dir apps/web typecheck`
2. `pnpm --dir apps/web build`

Use direct visual inspection of `/` at desktop width and one narrow responsive width against the mockup. Do not run repository-wide `pnpm validate` for this presentation-only issue.
