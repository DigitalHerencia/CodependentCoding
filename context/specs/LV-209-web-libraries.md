---
id: LV-209
title: Add mockup-driven Libraries catalog and detail pages
status: active
type: implementation-spec
order: 9
depends_on: [LV-208]
issue_title: 'LV-209: Add the Libraries catalog and linked detail pages from mockups'
---

# LV-209 — Add the Libraries catalog and linked detail pages

## Outcome

Add `/libraries` and `/libraries/[slug]` using the local Libraries and individual-library mockups as the visual contract, while making every card/detail page describe the real Loaded Vibes / Hipster Stack system rather than inventing a generic component or provider marketplace.

## Required inputs

Read only:

- this spec;
- `context/docs/web.md`;
- `context/docs/configuration.md`;
- `.agents/contracts/product.yaml`;
- local `context/mockups/` and identify the Libraries catalog and individual-library/configuration mockups by visual content;
- `packages/core/src/capabilities.ts`;
- `packages/core/src/presets.ts` only if needed for Builder handoff/preset wording;
- `packages/schema/src/recipe.ts`;
- the directly affected `apps/web` files.

If either required mockup subject is absent, stop rather than approximating its design.

## Architecture guardrail

Follow the applicable Loaded Vibes presentation grammar:

```text
route/page -> feature/presentation orchestration -> shared/domain presentation
```

Pages stay thin and server-first. Library metadata may be a small pure web presentation model. It must not become a second configuration engine.

## Starting state

There is currently no `/libraries` route or library detail route. Core already owns capability IDs, labels, dependencies, and fixed/configurable status; schema already owns valid recipe fields.

## Primary files

Expected additions/edits are narrow:

- `apps/web/app/libraries/page.tsx`
- `apps/web/app/libraries/[slug]/page.tsx`
- one small presentation catalog, e.g. `apps/web/lib/libraries.ts`
- one focused Libraries feature/presentation component only if useful to keep route files thin
- shared card/icon presentation only when actually reused
- `apps/web/app/globals.css`
- shared header/footer only for active navigation/layout reuse

Do not modify `packages/core`, `packages/schema`, CLI, generator, or template merely to make the mockups literal.

## Catalog model

Preserve the mockup's five-column conceptual organization and low density:

- **Foundation** — Core, Generator
- **Identity** — Auth, Organizations
- **Data** — Database, RBAC
- **Revenue** — Billing, Subscriptions
- **Interface** — Blocks, Docs

Interpret those cards through the actual Codependent Coding / Loaded Vibes architecture:

- **Core** — the fixed Loaded Vibes application grammar/foundation, not a package toggle;
- **Generator** — deterministic one-template generation and CLI handoff;
- **Auth** — Clerk authentication/session boundary plus application-owned identity adaptation; fixed, not provider-selectable;
- **Organizations** — application-owned tenant/organization/membership model; currently fixed via core capability semantics;
- **Database** — Neon/Postgres + Prisma + tenant containment/RLS boundary; fixed, not database-selectable;
- **RBAC** — local membership/role/capability authorization; currently fixed via core capability semantics;
- **Billing** — the real optional `billing` capability;
- **Subscriptions** — the subscription lifecycle supplied by Billing; do not create a second recipe field;
- **Blocks** — the presentation composition/building-block model; fixed architectural/presentation concept, not a fake module;
- **Docs** — Loaded Vibes end-user docs/product surface, linking to `/docs` where appropriate.

Presentation metadata may own only slug, category, concise copy, icon/presentation key, related links, and a mapping to an existing capability/product surface.

## Detail-page behavior

Faithfully reproduce the individual-library mockup's structure, spacing, page hierarchy, configuration-first panel, small supporting cards, related-library links, and footer treatment.

Apply intelligent semantics instead of literal mockup mistakes:

- configurable capability pages show the smallest valid `loadedvibes.json` fragment needed to express the choice;
- fixed foundation pages show **Included / Fixed foundation** status and useful configuration/setup context, not a toggle;
- Billing uses the real capability identifier and dependency behavior from core;
- Subscriptions explains that it is delivered through Billing and links/configures Billing rather than inventing `subscriptions: true`;
- Auth must not implement illustrative keys such as `provider`, `sessions`, or `protectedRoutes` because they are not current recipe fields;
- Database must not expose Prisma/Neon/provider choice controls;
- Organizations/RBAC status is derived from `capabilityRegistry`, not duplicated constants;
- Generator uses an actual CLI/config handoff;
- Docs routes to the canonical docs surface;
- Builder actions route to `/configure` and may pre-seed only configuration that the existing serialization path can truthfully represent with a small change.

Button labels/copy may differ from the mockup when needed to make the real action obvious; preserve the button's location, hierarchy, and interaction purpose.

## Scope

- implement all catalog cards and detail routes;
- keep content concise and product-oriented rather than turning each page into documentation;
- wire all related-library links;
- wire honest Builder/Docs/CLI handoffs;
- preserve LV-208 shared shell/brand treatment;
- use existing core/schema semantics instead of replicating them;
- remove temporary/duplicate metadata or styling before completion.

## Non-goals

- no package registry;
- no provider marketplace;
- no arbitrary technology selector;
- no new schema fields merely to satisfy mockup placeholder text;
- no docs-content rewrite;
- no search/index backend;
- no new testing or screenshot infrastructure.

## Acceptance

- `/libraries` faithfully reproduces the identified catalog mockup's layout, density, hierarchy, card treatment, branding, and responsive intent;
- all ten cards lead to useful routes or the canonical destination without dead links;
- individual detail pages faithfully reproduce the identified detail mockup's composition while using truthful Loaded Vibes semantics;
- fixed architecture is visibly fixed/read-only, not selectable;
- configurable examples use only actual schema/core identifiers;
- Billing/Subscriptions do not become duplicate configuration concepts;
- no second capability dependency/fixed-status rules engine exists in `apps/web`;
- route files remain thin and presentation remains free of provider/DB authority;
- no unrelated repository surfaces change.

## Verification

Run only:

1. `pnpm --dir apps/web typecheck`
2. `pnpm --dir apps/web build`

Then inspect `/libraries`, one fixed detail page (`Auth`), and the real configurable detail (`Billing`) at desktop width against the mockups. Check one narrow responsive width for overflow/navigation only. Do not run repository-wide `pnpm validate`.
