---
title: Codependent Coding Site — Refurbishment Plan
status: decided — locked 2026-10-31 (DEC-082 … DEC-090); issues CC-046 … CC-078 queued in context/specs/issues
date: 2026-10-31
scope: every page, all content, design system, docs platform, legal, codebase architecture, quality gates
supersedes: PRD FR-SITE-1..3 (site section only), Design.md §2 (landing), DEC-071 (site surface list)
---

# Codependent Coding Site — Refurbishment Plan

## 0. The bar

"Impervious to criticism from other engineers" is not a feeling; it is a list of things a reviewer checks first. The site passes when every one of these is true and proven by CI, not by inspection:

| Gate                             | Target                                                              | Proof                                                  |
| -------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| Lighthouse (mobile, every route) | 100 / 100 / 100 / 100                                               | `lhci` in CI on the preview URL                        |
| Core Web Vitals (lab)            | LCP < 1.2 s, CLS 0, TBT < 50 ms                                     | `lhci` assertions                                      |
| JavaScript on public routes      | ≤ 60 KB gzip first load (docs ≤ 90 KB with search lazy)             | Turbopack bundle analyzer snapshot diff                |
| Accessibility                    | 0 axe violations, WCAG 2.2 AA contrast on every token pair          | `@axe-core/playwright` per route; `check-contrast.mjs` |
| Security headers                 | A+ on securityheaders.com equivalent; CSP present on every response | `tests/e2e/headers.spec.ts`                            |
| No third-party runtime requests  | 0 requests to non-first-party origins                               | Playwright request log assertion                       |
| HTML                             | valid, one `h1`, landmark structure, `lang`, skip link              | `html-validate` in CI                                  |
| Links                            | 0 broken internal or external links                                 | existing crawler + `lychee` weekly                     |
| Static                           | every route static                                                  | `ensureStatic = 'navigation'` on the root layout       |
| Doctrine conformance             | the site lints clean under its own doctrine                         | `pnpm lint` (doctrine plugin, site profile)            |
| Content                          | no lorem, no stale version numbers, every vendor claim dated        | `scripts/check-content.mjs`                            |

## 1. What is there today (audit, 2026-10-31)

Evidence from the repo (`app/`, `components/`, `features/`, `lib/`) and the live deployment.

| #   | Finding                                                                                                                                                                                                                                                                                      | Severity                   | Where                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------- |
| S1  | The docs publish 48 thin chapters (two "books" restating each other) plus a product spec split by `##` headings. Chapters 14 and CANONICAL-RECONSTRUCTION contradict each other on the call graph.                                                                                           | Critical (content)         | `lib/fetchers/doctrineFetchers.ts`, `context/doctrine/*` |
| S2  | Markdown is rendered with `marked` and injected with `dangerouslySetInnerHTML`, unsanitized.                                                                                                                                                                                                 | High (security posture)    | `components/blocks/doctrine-article.tsx`                 |
| S3  | No Content-Security-Policy on any response.                                                                                                                                                                                                                                                  | High                       | `next.config.ts`, live headers                           |
| S4  | The Maximal browser loads Monaco in the browser (`@monaco-editor/react` fetches Monaco from a public CDN by default) and fetches file contents from `raw.githubusercontent.com` at runtime. Third-party runtime code, multi-MB payload, and a "static site" that depends on GitHub being up. | High                       | `features/maximal/maximalBrowser.client.tsx`             |
| S5  | Signal color `#2f7a8d` used as text on `#05030b`: **4.19:1**, fails WCAG AA.                                                                                                                                                                                                                 | High (a11y)                | `app/globals.css`, sidebar, kickers                      |
| S6  | Fonts: Archivo Black loaded under `--font-big-shoulders-display`; Cinzel as "copperplate fallback"; JetBrains Mono and Fira Code both loaded. The brand spec says Copperplate Gothic Bold.                                                                                                   | Medium                     | `app/layout.tsx`                                         |
| S7  | Logo, wordmark and lockups are JPEGs of text (120–130 KB each); not scalable, not selectable, not themable.                                                                                                                                                                                  | Medium                     | `public/*.jpg`                                           |
| S8  | Two token systems in one stylesheet (`--site-*` and the base set) plus dead aliases (`--acid`, `--violet`, `--magenta` all equal `--signal`); 741 lines; 5 `!important`.                                                                                                                     | Medium                     | `app/globals.css`                                        |
| S9  | No `robots.txt`, `sitemap.xml`, Open Graph image, web manifest or canonical URLs (all 404).                                                                                                                                                                                                  | Medium (SEO/share)         | `app/`                                                   |
| S10 | Docs search filters titles only; no full-text, no keyboard result navigation, `Ctrl+K` focuses an input instead of opening a palette.                                                                                                                                                        | Medium                     | `features/doctrine/doctrineSidebar.client.tsx`           |
| S11 | 306 lines of page copy in `lib/constants/siteCopy.ts` (constants are tuning values only).                                                                                                                                                                                                    | Low (doctrine conformance) | `lib/constants/`                                         |
| S12 | Build-time file loaders live in `lib/fetchers/` (fetchers are authenticated DB reads in this doctrine).                                                                                                                                                                                      | Low (vocabulary)           | `lib/fetchers/*`                                         |
| S13 | `export const dynamicParams = false` — a build error once Cache Components is on.                                                                                                                                                                                                            | Low (forward-compat)       | `app/(public)/doctrine/[...slug]/page.tsx`               |
| S14 | Terms of Service lack governing law, severability, entire-agreement, assignment, indemnity and a non-GitHub contact. FAQ jokes ("Is The Maximal Template a joke? Of course.") sit on the same site as legal text without a boundary.                                                         | Medium (legal clarity)     | `lib/constants/siteCopy.ts`                              |
| S15 | Landing CTA "Get started" goes to the GitHub repo root; "More info" links to a raw PRD on GitHub. No path from the landing page into the doctrine.                                                                                                                                           | Medium (UX)                | `components/blocks/landing-hero.tsx`                     |
| S16 | Mermaid diagrams in Architecture.md render as code blocks on the live site.                                                                                                                                                                                                                  | Low                        | renderer                                                 |
| S17 | No dates, versions or "verified against" stamps on docs pages, so a reader cannot tell if a rule reflects Next 16.4 or 16.1.                                                                                                                                                                 | Medium (credibility)       | docs                                                     |

What is good and stays: the static-first architecture, typed routes, the crawler e2e test, the visual identity (crown, desert horizon, Digital Herencia), the voice on marketing pages, the "Previous/Next" doc navigation, keyboard-reachable sidebar, CI path filtering.

## 2. Information architecture

```text
/                               Landing
/doctrine                       Doctrine home (what it is, reading paths, chapter grid, rule counts)
/doctrine/<chapter>             14 chapters (Preface … Compliance & Performance)
/doctrine/rules                 Rule index (filter by tier, area, enforcement)
/doctrine/rules/<id>            One page per rule: statement, why, enforcement, failing + passing example, chapter link
/doctrine/glossary              Glossary
/doctrine/golden-slice          Golden slice walkthrough
/doctrine/changelog             Doctrine amendments (from the reconciliation ledger), dated
/maximal                        Template explorer (static snapshot, file tree + highlighted source + layer annotations)
/maximal/<path...>              Deep link to a file in the snapshot
/hipster-stack                  CLI: what it does, command reference, interactive command builder
/loaded-vibes                   Plugin: skills, agents, hooks, install
/faq                            FAQ (satire allowed, clearly marked)
/security                       Security policy (human version of SECURITY.md)
/terms                          Terms of Service
/privacy                        Privacy Policy
/offline                        Offline fallback (PWA)
/llms.txt                       Machine index of the doctrine for agents
/doctrine/<chapter>.md          Raw Markdown of each chapter (route handler, static)
/doctrine/rules.json            Machine-readable rule list (ID, tier, statement, enforcement, URL)
/sitemap.xml  /robots.txt  /manifest.webmanifest  /opengraph-image  /icon  /apple-icon
```

Header: wordmark (home) · Doctrine · Maximal · Hipster Stack · Loaded Vibes · ⌘K search · GitHub (icon). Footer: wordmark, the four product links, FAQ · Security · Terms · Privacy · RSS of doctrine changelog, "Doctrine v1.0 · verified 2026-10-31", © 2026 Digital Herencia.

Why `/doctrine/rules/<id>`: lint output prints `CC-READ-002`. The plugin and ESLint messages link to `https://<site>/doctrine/rules/CC-READ-002`. Every finding becomes one click from its justification — the feature no other architecture doc has.

Why `/llms.txt` and raw `.md`: agents are half the audience. The Loaded Vibes plugin and Claude Code can fetch the canonical doctrine instead of carrying stale copies (Tracker L9: "point at them, never copy them").

The site itself becomes an installable PWA that keeps the doctrine readable offline — the doctrine's PWA chapter demonstrated on its own docs. Because every page is public and static, the service worker MAY precache HTML here (the CC-PWA-001 prohibition is about personalized responses).

## 3. Page-by-page specification

Each page lists purpose, structure (top to bottom), components, data source, and acceptance criteria.

### 3.1 `/` Landing

Purpose: in ten seconds, say what this is and route the reader to the doctrine or the repo.

1. **Hero** (full viewport, desert horizon behind): crown mark (SVG); `h1` "When epistemologies fail, the stack still governs." (kept); sub: "An opinionated, executable engineering doctrine for Next.js SaaS — and the factory that generates apps from it."; CTAs: **Read the doctrine** (`/doctrine`, primary) · **Browse the template** (`/maximal`) · GitHub (icon link). Tagline "Nothing to borrow. We checked." stays as the sign-off line.
2. **The sentence**: the governing sentence set large, each clause linking to its chapter.
3. **Four parts**: Doctrine · Maximal Template · Hipster Stack · Loaded Vibes — one card each: one-line purpose, one real number (e.g. "143 rules, 135 enforced from the first commit"; "9 domain modules, 6 add-ons"; "5 commands"; "7 skills, 2 agents"), link. Numbers are computed at build from the source, never typed.
4. **Proof strip**: three code-true claims with links: "Every rule is lint", "RLS proven against real Postgres", "Ownership computed, never cataloged" — each links to the rule page or test file.
5. **Digital Herencia** lockup section (kept, SVG).
6. Footer.

Acceptance: LCP element is the `h1` text (not an image); hero art is a CSS/SVG layer with the desert as AVIF `next/image` `priority` at ≤ 60 KB; 0 layout shift; all copy from `content/public.ts`.

### 3.2 `/doctrine` Doctrine home

1. Title "The Codependent Coding Doctrine", version badge, "verified against Next.js 16.4, Prisma 7, Clerk 7 on 2026-10-31".
2. **Reading paths** (four cards from the Preface table: starting an app, writing a read, writing a mutation, reviewing a PR) — each an ordered list of chapter links.
3. **Chapter grid**: 14 chapters + 3 appendices, each with summary (from frontmatter) and rule count by tier.
4. **Tier legend** and link to the rule index.
5. "What changed" — latest three changelog entries.

### 3.3 `/doctrine/<chapter>`

Three-column layout ≥ 1024 px: sidebar (chapters, collapsible groups, current highlighted) · article (max 72ch prose, code may extend to 100ch) · on-this-page TOC with scroll-spy. Below 1024 px: sidebar becomes a sheet behind a "Chapters" button; TOC becomes a collapsible "On this page" at the top.

Article furniture:

- Breadcrumb `Doctrine / Data`.
- Title, summary, "Rules in this chapter" chip row (each chip links to its anchor).
- **Rule blocks** rendered by an MDX `<Rule>` component: ID (copy-link button), tier badge (icon + word, never color alone), enforcement chip (lint rule name or check), statement, rationale. Anchor `#cc-read-002`.
- Code blocks: Shiki at build (zero client JS), file-path header, copy button (tiny island), line highlighting via meta string, `diff` support.
- Diagrams: Mermaid compiled to inline SVG at build (`mmdc` in the content pipeline), themed with tokens.
- Callouts: `Why`, `Pitfall`, `Tier note` — three kinds only.
- Footer: "Edit on GitHub", last-modified date from git, Previous/Next, "Report a problem" (prefilled GitHub issue).

### 3.4 `/doctrine/rules` and `/doctrine/rules/<id>`

Index: a static table, filterable client-side (tier, area, enforcement type, text) via a small island with URL-synced filters. Each rule page: statement, rationale, tier, enforcement (with link to the rule's source line in `doctrine-map.mjs`), **failing example and passing example pulled from the rule's ESLint test file at build**, related rules, chapter link. 143 static pages generated with `generateStaticParams`.

### 3.5 `/maximal` Template explorer

Replace Monaco + runtime GitHub fetches with a **build-time snapshot**:

- A content loader walks `template/` at build (same exclusion list as the CLI), computes each file's owner (the CLI's ownership function, imported, not re-implemented) and layer (the classifier).
- Left: file tree (virtualized, keyboard navigable, filter by module and by layer).
- Right: Shiki-highlighted source, a layer annotation bar ("Fetcher — auth → authz → scoped select → DTO", linking to the chapter), owner badge, and "Open on GitHub".
- Deep links `/maximal/lib/fetchers/crmFetchers.ts`.
- Module toggle: pick a preset and watch files that would be deleted dim out — the CLI's subtractive composition, visualized, computed from the real manifest.

Acceptance: no request leaves the origin; first load ≤ 90 KB JS; every file in the snapshot has an owner and layer, or the build fails (doubles as a site-side orphan check).

### 3.6 `/hipster-stack`

1. What it does in one paragraph and the composition flowchart (SVG).
2. Command reference generated from the CLI's own command definitions (`commander` metadata exported at build): `new`, `add`, `slice`, `doctor`, `compose` — flags, defaults, examples.
3. Command builder (island): choose preset/modules/tenancy/access/admission/color; shows the exact command and the resulting module closure (`dependsOn`) and file count, computed from the manifest.
4. Slice DSL reference with a live parser preview (the CLI's parser, imported).

### 3.7 `/loaded-vibes`

Install steps (kept), then skills (`idea`, `plan`, `slice`, `classify`, `check`, `ship`, `handoff`) each with trigger, inputs, outputs, and which doctrine chapters it points to; agents (`reviewer`, `verifier`) with their tool permissions (read-only, shown); hooks with the exact events; the MVP loop diagram. All generated from `packages/loaded-vibes/` at build.

### 3.8 `/faq`

Kept as the satire page, with a one-line banner: "This page is satire. The doctrine is not." Add three real questions at the top (Is it open source? — MIT, link LICENSE. Can I use the template for a commercial app? — yes under MIT; marks excluded. Does the site collect data? — no, link privacy.) Then the jokes.

### 3.9 `/security`

Human version of `SECURITY.md`: supported versions (the `main` branch), how to report (GitHub private vulnerability reporting), what to include, response target (acknowledge within 7 days), scope (site, template, CLI, plugin), safe harbor for good-faith research. Also served as `/.well-known/security.txt` (RFC 9116) with `Contact`, `Expires`, `Policy`, `Canonical`.

### 3.10 `/terms`, `/privacy`

Full rewritten text in [`legal.md`](./legal.md). Straight voice. Rendered with the docs prose styles, a dated version stamp, and a short "plain-language summary" box at the top that is explicitly not part of the terms.

### 3.11 `/offline`, `not-found`, `error`

- `/offline`: "You're offline. Pages you've opened before are still here." List of cached chapters (read from the cache on the client).
- `not-found`: on-brand, search box, links to doctrine home and rule index; for `/doctrine/rules/CC-…` misses, suggest the nearest rule IDs.
- `error.tsx` / `global-error.tsx`: generic message, retry, `ref` code.

## 4. Codebase architecture (the site obeys its own doctrine)

```text
app/
├── layout.tsx                    fonts, metadata base, skip link, SiteShell; export const ensureStatic = 'navigation'
├── (public)/
│   ├── page.tsx                  landing → public blocks
│   ├── doctrine/page.tsx · [chapter]/page.tsx · rules/page.tsx · rules/[ruleId]/page.tsx · glossary · golden-slice · changelog
│   ├── doctrine/[chapter].md/route.ts   raw markdown (static GET)
│   ├── maximal/[[...path]]/page.tsx
│   ├── hipster-stack/page.tsx · loaded-vibes/page.tsx · faq · security · terms · privacy · offline
│   ├── loading.tsx · error.tsx
├── llms.txt/route.ts · sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx · icon.svg · apple-icon.png
├── .well-known/security.txt/route.ts
├── global-error.tsx · not-found.tsx · globals.css · typeset.css
components/
├── ui/                           shadcn primitives actually used (button, sheet, command, tabs, tooltip, scroll-area, badge, separator)
├── blocks/public-blocks.tsx      hero, sentence, product cards, proof strip, lockup
├── blocks/docs-blocks.tsx        rule block, callout, code frame, toc, chapter card, tier badge, breadcrumb, pager
├── blocks/maximal-blocks.tsx     tree row, file header, layer bar, owner badge
├── templates/docs-templates.tsx  chapter page, rule page, index page
├── templates/public-templates.tsx
├── nav/site-header.tsx · site-footer.tsx · docs-sidebar.tsx
├── shells/site-shell.tsx · docs-shell.tsx
├── brand/codependent-mark.tsx · codependent-wordmark.tsx · herencia-lockup.tsx   (inline SVG components)
├── error-boundary.tsx
content/
├── public.ts · faq.ts · legal.ts · security.ts               copy (plain data)
├── doctrine/*.mdx                                           the canon chapters (moved from context/canon/doctrine)
features/
├── docs/docsChapterFeature.tsx · docsRuleFeature.tsx · docsSearch.client.tsx · docsTocSpy.client.tsx · docsCopyLink.client.tsx
├── maximal/maximalExplorerFeature.tsx · maximalTree.client.tsx · maximalPresetToggle.client.tsx
├── cli/cliBuilderFeature.tsx · cliBuilder.client.tsx
├── pwa/pwaRegister.client.tsx · pwaInstall.client.tsx
lib/
├── content/doctrine.ts           build-time loader: parse MDX frontmatter, rule blocks, headings; validate with Zod
├── content/rules.ts              rule list = chapters ∪ validation.yaml ∪ doctrine-map (fails build on mismatch)
├── content/template.ts           snapshot + ownership + layer (imports the CLI's pure functions)
├── content/cli.ts · content/plugin.ts
├── content/search.ts             builds the static search index (MiniSearch JSON) at build
├── mdx/                          remark/rehype plugins: rule blocks, shiki, mermaid→svg, heading ids, link checks
├── cache/tags.ts                 (static site: unused beyond build; kept for doctrine parity)
├── constants/site.ts             URLs, version, verified-on date
├── utils/cn.ts
public/
├── sw.js · icons/ · og/ · fonts/ (self-hosted, subset woff2) · art/desert.avif
tests/
├── unit/content/*.test.ts        loaders, rule-sync, ownership snapshot
├── e2e/site/*.spec.ts            links, headers, a11y (axe), no-third-party, offline, search, keyboard nav
```

Decisions:

- **MDX at build, no runtime markdown.** `@next/mdx` is not used (it compiles per page and hides frontmatter); the content loader compiles MDX with `@mdx-js/mdx` in a `'use cache'` function keyed by file hash, producing React Server Components. Result: zero docs JS except islands, no `dangerouslySetInnerHTML` (S2 closed).
- **Search**: MiniSearch index generated at build (titles, headings, rule IDs, rule statements, glossary terms, body text), served as a static JSON file, loaded on first `⌘K` press. The palette is shadcn `Command` (cmdk) in a dialog; results grouped Chapters / Rules / Glossary; arrow keys + Enter; `/` also opens it.
- **Dependencies removed**: `@monaco-editor/react`, `monaco-editor`, `marked`. Added: `@mdx-js/mdx`, `shiki`, `minisearch`, `cmdk` + the used Radix primitives. All exact-pinned, 7-day release age.
- **Content loaders are a layer** (`lib/content`, CC-CONTENT-001), never "fetchers" (ledger A-5).
- **Cache Components on**, `ensureStatic = 'navigation'` at the root; all `generateStaticParams` pages; unknown slugs → `notFound()`.
- **View Transitions** (React 19.3 stable): chapter-to-chapter navigation crossfades the article column while sidebar and header stay fixed; disabled under `prefers-reduced-motion`.
- **CSP**: header CSP from `next.config.ts` (`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; manifest-src 'self'; worker-src 'self'; upgrade-insecure-requests`). Upgrade path to hash-based SRI CSP tracked as an issue.

## 5. Design system

### 5.1 Color (dark only)

| Token                                  | Value                                                      | Use                                                                   | Contrast on `background`                                |
| -------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| `--background`                         | `#05030b`                                                  | canvas                                                                | —                                                       |
| `--surface`                            | `#0b0913`                                                  | cards, sidebar                                                        | —                                                       |
| `--surface-raised`                     | `#120f1c`                                                  | popovers, code blocks                                                 | —                                                       |
| `--foreground`                         | `#f4f1ea`                                                  | body text (warm off-white, not pure white — less glare on near-black) | 18.2:1                                                  |
| `--muted-foreground`                   | `#a9a7b0`                                                  | secondary text                                                        | 8.63:1                                                  |
| `--signal`                             | `#2f7a8d`                                                  | brand: borders, glows, focus ring halo, active rail                   | 4.19:1 — **never body text**                            |
| `--signal-text`                        | `#3a96ad`                                                  | links, kickers, active nav text                                       | 6.0:1                                                   |
| `--signal-strong`                      | `#5bb7cf`                                                  | hover/focus text                                                      | 8.9:1                                                   |
| `--border`                             | `#2f7a8d` (= signal)                                       | boundaries of interactive controls (inputs, buttons, search)          | 4.19:1 (≥ 3:1 for UI components, WCAG 1.4.11)           |
| `--hairline`                           | `color-mix(in srgb, var(--signal) 45%, var(--background))` | decorative separators only (section rules, table rows)                | 1.67:1 — allowed only where the line carries no meaning |
| `--success` / `--warning` / `--danger` | `#4fae7a` / `#d6a64a` / `#e0645c`                          | tier badges, callouts (always with icon + word)                       | 7.49 / 9.19 / 6.00 on canvas; ≥ 5.5 on `surface-raised` |

One stylesheet, one token set. `--site-*` and the dead aliases are deleted. `check-contrast.mjs` runs in CI over every foreground/background pair declared in a `/* @pairs */` comment block.

### 5.2 Typography

| Role                                      | Face                                                                                                                                                                                            | Notes                                                                                                                                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Display (wordmarks, `h1`, section titles) | **Cinzel** 600/700, self-hosted via `next/font/local` (SIL OFL), Latin subset. Stack: `Cinzel, "Copperplate Gothic", Copperplate, serif` with `size-adjust` fallback metrics so nothing shifts. | All caps, `letter-spacing: 0.06em`, signal glow only on the hero `h1`. Decided over licensing Copperplate Gothic: same engraved-capital register, no cost, no licence terms (ledger P-10). |
| Body and UI                               | **JetBrains Mono** variable, subset Latin, self-hosted via `next/font/local`                                                                                                                    | Monospace body is the brand; set at 15/26 desktop, 14/24 mobile; `font-variant-ligatures: none` in prose, ligatures on in code.                                                            |
| Code                                      | JetBrains Mono (same family)                                                                                                                                                                    | Fira Code is dropped: two monospace families is 100+ KB for no visible gain.                                                                                                               |

Type scale (fluid, `clamp`, base 15 px, ratio 1.25): `--text-xs` 0.75rem · `sm` 0.875 · `base` 0.9375 · `lg` 1.125 · `xl` 1.375 · `2xl` clamp(1.6rem, 1.3rem+1vw, 2rem) · `3xl` clamp(2rem, 1.5rem+2vw, 2.75rem) · `display` clamp(2.5rem, 1.5rem+4vw, 4.5rem). Prose measure 72ch. Headings `text-wrap: balance`; paragraphs `text-wrap: pretty`.

### 5.3 Space, layout, shape, motion

- Spacing: 4 px base; steps 1 2 3 4 6 8 12 16 24 32 (× 4 px). Section rhythm `clamp(4rem, 8vw, 8rem)`. Page gutter `clamp(1rem, 4vw, 3rem)`.
- Layout: content max 1280 px; docs grid `16rem minmax(0, 72ch) 14rem` with 2.5rem gaps; header 64 px, sticky, `backdrop-filter: blur(8px)` over `color-mix(background 80%)`.
- Shape: radius 2 px (controls) / 0 (cards); borders 1 px; focus ring `0 0 0 2px var(--background), 0 0 0 4px var(--signal-strong)`.
- Elevation: none; separation by border and surface step. Glow (`--brand-glow`) only on the hero `h1`, the active sidebar rail, and focus.
- Motion: 120 ms / 180 ms, `cubic-bezier(0.2, 0, 0, 1)`; View Transitions for page changes; all motion off under `prefers-reduced-motion`.
- Breakpoints: 480 · 640 · 768 · 1024 · 1280. No horizontal scroll at 320 px.
- Icons: lucide, 16/20 px, stroke 1.75, `aria-hidden` unless labeled.

### 5.4 Brand assets

Redraw the crown mark, the "THE CODEPENDENT CODING™ WEB APP ARCHITECTURE" wordmark and the Digital Herencia lockup as SVG (inline React components in `components/brand`, `currentColor` fills, `<title>` for a11y). Desert horizon re-exported as AVIF (≤ 60 KB at 1920 w) with a CSS gradient fallback. OG image generated by `opengraph-image.tsx` per chapter (title + chapter number + wordmark) at build.

## 6. Content

### 6.1 Voice

| Surface                                    | Voice                                                                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Landing, FAQ, product taglines             | The house satire: dry, deadpan, one joke per block, never at the reader's expense. ™ jokes live here only.                           |
| Doctrine, rule pages, CLI/plugin reference | Plain engineering English. Present tense, active voice, MUST/SHOULD, one idea per sentence, every claim sourced or tested. No jokes. |
| Legal, security                            | Straight, precise, no humor.                                                                                                         |

### 6.2 Copy deck (landing and product pages)

- Landing h1: "When epistemologies fail, the stack still governs."
- Landing sub: "An executable engineering doctrine for Next.js SaaS — and the factory that turns it into running apps."
- Doctrine card: "143 rules. 135 enforced from the first commit. Every lint finding links to its reason."
- Maximal card: "One runnable app holding every module. Generation is deletion: pick what you need, the rest is removed by name."
- Hipster Stack card: "A local CLI that composes a new app from the template, scaffolds vertical slices, and checks your setup."
- Loaded Vibes card: "A Claude Code plugin that keeps the agent inside the rails: grill, plan, slice, check, ship, hand off."
- Proof strip: "Every rule is lint." · "Tenant isolation proven against real Postgres." · "Ownership computed, never cataloged."
- Sign-off: "Nothing to borrow. We checked."

Numbers in the cards are computed from source at build.

### 6.3 Doctrine content

The fourteen chapters and three appendices in `context/canon/doctrine/` replace every page under the current Architecture, Book of Knowledge and Book of Implementation groups. `context/doctrine/` (TypeScripture) is archived to `context/archive/typescripture/` with a README pointing to the canon.

## 7. Quality, testing, CI

- `tests/e2e/site/links.spec.ts` (existing crawler, extended to `/doctrine/rules/*` and `/maximal/*`).
- `tests/e2e/site/a11y.spec.ts`: axe on every route in the sitemap; keyboard: Tab order through header, skip link works, `⌘K` opens palette, Esc closes, focus returns.
- `tests/e2e/site/headers.spec.ts`: CSP + the six security headers on HTML, `sw.js`, `.md`, `.json` routes.
- `tests/e2e/site/no-third-party.spec.ts`: every route, every request origin === site origin.
- `tests/e2e/site/offline.spec.ts`: visit a chapter, go offline, reload, still renders; unknown page → `/offline`.
- `tests/unit/content/rules.test.ts`: chapters ∪ validation.yaml ∪ doctrine-map agree.
- `lhci` on the Vercel preview for `/`, `/doctrine`, one chapter, one rule, `/maximal`, with the §0 assertions.
- Visual review: Playwright screenshots of every template at 375 / 768 / 1280 attached to the PR as artifacts (reviewed by eye, not asserted).

## 8. Milestones and issues

Format matches `context/specs/issues/CC-NNN-*.md`. The issue files are in `context/specs/issues/` with `status: todo`, indexed in `issues.index.json`; `pnpm issues:sync -- --apply --project 19` publishes them. The handoff points Claude Code at CC-047.

| Milestone              | Issue  | Title                                                                                          | Depends on |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------- | ---------- |
| **M-S1 Foundation**    | CC-046 | build(site): enable Cache Components, ensureStatic, remove dynamicParams                       | —          |
|                        | CC-047 | build(deps): pnpm supply-chain settings and single-document lockfile (root + template)         | —          |
|                        | CC-048 | feat(site): header CSP and full security headers; security.txt                                 | 046        |
|                        | CC-049 | refactor(site): move copy to content/, loaders to lib/content                                  | 046        |
| **M-S2 Design system** | CC-050 | feat(site): unified tokens, contrast check script, delete legacy aliases                       | 049        |
|                        | CC-051 | feat(site): self-hosted Cinzel + JetBrains Mono, drop Archivo Black and Fira Code              | 050        |
|                        | CC-052 | feat(brand): SVG mark, wordmark, lockup; AVIF horizon; OG image route                          | 050        |
|                        | CC-053 | feat(site): shells, header, footer, docs sidebar sheet, skip link                              | 050–052    |
| **M-S3 Docs platform** | CC-054 | feat(docs): MDX build pipeline (rule blocks, Shiki, Mermaid→SVG, heading ids)                  | 049        |
|                        | CC-055 | feat(docs): chapter, rule index, rule pages, glossary, golden slice, changelog routes          | 054        |
|                        | CC-056 | feat(docs): rules sync check (chapters ⇄ validation.yaml ⇄ doctrine-map) in CI                 | 055        |
|                        | CC-057 | feat(docs): ⌘K search with static MiniSearch index                                             | 055        |
|                        | CC-058 | feat(docs): llms.txt, raw .md routes, rules.json                                               | 055        |
|                        | CC-059 | docs(doctrine): publish the canon, archive TypeScripture                                       | 055        |
| **M-S4 Product pages** | CC-060 | feat(maximal): build-time template snapshot explorer; remove Monaco and runtime GitHub fetches | 054        |
|                        | CC-061 | feat(cli-page): generated command reference + builder from CLI metadata                        | 049        |
|                        | CC-062 | feat(plugin-page): generated skills/agents/hooks reference                                     | 049        |
|                        | CC-063 | feat(site): landing rebuild with computed numbers and proof strip                              | 052, 053   |
| **M-S5 Trust pages**   | CC-064 | docs(legal): new Terms, Privacy, Security pages; FAQ satire banner                             | 049        |
| **M-S6 PWA + polish**  | CC-065 | feat(pwa): manifest, sw.js with docs precache, offline page, install prompt                    | 055        |
|                        | CC-066 | feat(site): View Transitions, 404 with rule suggestions, error pages                           | 055        |
|                        | CC-067 | test(site): e2e suite (links, a11y, headers, third-party, offline) + lhci gates                | all        |
|                        | CC-068 | chore(site): sitemap, robots, canonical URLs, metadata per page                                | 055        |

The canon also changes the template. These issues bring it into conformance (inputs: ledger §4):

| Milestone                    | Issue  | Title                                                                             | Depends on |
| ---------------------------- | ------ | --------------------------------------------------------------------------------- | ---------- |
| **M-T Template conformance** | CC-069 | fix(template): runtime and system DB roles; RLS policy rewrite                    | —          |
|                              | CC-070 | refactor(template): roles and mode flags into lib/authz; generator-baked policies | —          |
|                              | CC-071 | feat(template): active-organization cookie and switcher                           | 070        |
|                              | CC-072 | refactor(template): workflow direction and pass-through cleanup                   | —          |
|                              | CC-073 | fix(template): single error mapper with fixed messages and reporting              | —          |
|                              | CC-074 | fix(template): remove runtime dotenv; `DATABASE_URL_UNPOOLED`                     | —          |
|                              | CC-075 | feat(template): Cache Components and nonce CSP                                    | —          |
|                              | CC-076 | feat(template): core PWA                                                          | 075        |
|                              | CC-077 | feat(template): hardened Stripe webhook path                                      | 069        |
|                              | CC-078 | refactor(template): per-slice template files                                      | —          |

Order of work: M-S1 → (M-S2 ∥ M-S3) → M-S4 → M-S5 → M-S6, with M-T as a parallel stream from the start. CC-069 and CC-047 are the two security-critical items; do them first in their streams. Each issue is sized for one Claude Code session on the Pro plan (≤ ~400 lines of diff).

## 9. Risks

| Risk                                                   | Mitigation                                                                                                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Cinzel reads less "Copperplate" than the original spec | Accepted trade (ledger P-10); the display face is one `@font-face` swap if a licence is ever bought.                                            |
| Cache Components edge cases with MDX loaders           | Loaders are pure build-time functions in `'use cache'` keyed by content hash; `ensureStatic` fails the build instead of silently going dynamic. |
| Rule sync check blocks a docs-only edit                | The check runs only when chapters, `validation.yaml` or `packages/loaded-vibes/eslint/` change.                                                 |
| Scope creep (the site becomes the product again)       | PRD non-goals stand: no accounts, no server data, no hosted workbench. Every new page needs a decision record.                                  |
| `'unsafe-inline'` in the static CSP draws criticism    | Documented compensating controls (no raw HTML, no user content, no third-party origins, tested); SRI upgrade issue open.                        |
