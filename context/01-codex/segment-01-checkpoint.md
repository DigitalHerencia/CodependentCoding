# Segment Checkpoint

```yaml
segment: 1 - Product identity, shell, and Visual Vibes foundation
outcome: The active web package and shared shell now express the Codependent Coding product identity with canonical navigation, supplied brand assets, a Landing-mockup-faithful responsive Visual Vibes composition, real staged canonical routes, and legacy redirects.
status: completed
```

## Reused / migrated implementation

- Moved the existing Next 16 `src/CodependentCoding-site` implementation to `apps/web`.
- Moved the existing shared schema/core/CLI packages to `packages/{schema,core,cli}` without rewriting their semantics.
- Moved the supplied brand images into `apps/web/public` and used the Codependent Coding crown/logo plus Digital Herencia banner directly.
- Retained the shared-core browser adapter, UI button primitive, docs renderer, and legacy feature source for later segments.

## Changed

- Replaced Hipster Stack-as-product metadata/header/landing copy with the canonical Codependent Coding identity chain.
- Changed primary navigation to `Ontologies | Simples | Anthimeria | Maximal`.
- Added real staged `/ontologies`, `/simples`, `/anthimeria`, and `/maximal` routes with truthful canonical boundaries.
- Added `/libraries/* -> /simples` and `/configure -> /anthimeria` compatibility redirects.
- Added the missing Tailwind/base stylesheet and shared Visual Vibes color, type, border, focus, layout, panel, code, and responsive rules.
- Updated product/architecture machine contracts and the root README identity.
- Reconciled the owner-supplied `docs/mockups/Landing Mockup.jpg` into the active landing hierarchy: crown, thesis, two real actions, provenance line, Digital Herencia landscape, and compact footer.

## Deleted / superseded

- Removed the empty `packages/TheHipsterStackTechnologyStack` wrapper after canonical-path typecheck/build validation.
- Superseded the old active header/landing Constituter, Libraries, Product, and Hipster Stack product presentation.
- Deleted no unique implementation source; legacy internal catalog/workbench code remains for its owning segments.

## Compatibility adapters still present

- Four generic presets and Constituter-named internal components remain migration source for Segments 3, 6, and 7.
- Legacy Libraries catalog/detail source remains migration evidence for Segments 3 and 4.
- `/libraries/*` and `/configure` redirects remain through final cleanup.
- Canonical routes other than the landing are truthful staged surfaces pending their owning segments.

## Evidence

### Executed

- `corepack pnpm install --frozen-lockfile`: PASS; all five workspace projects, 278 packages, pnpm 11.1.1.
- `corepack pnpm typecheck`: PASS.
- `corepack pnpm --dir apps/web typecheck`: PASS after Next route type generation.
- Targeted ESLint over changed shell/route/landing TSX: PASS.
- Targeted Prettier check over governance, contracts, docs, CSS, and changed web files: PASS.
- `corepack pnpm --dir apps/web build`: PASS; Next 16.2.6 compiled and generated 25 pages including all canonical and legacy routes.
- Desktop browser smoke at 1440x900: PASS for canonical title/H1/nav, loaded images, and no horizontal overflow (`scrollWidth === clientWidth === 1425`).
- Narrow browser smoke at 390x844: PASS for all four visible nav links, loaded landing, responsive H1, and no horizontal overflow (`scrollWidth === clientWidth === 375`).
- Browser navigation smoke: `/ontologies` rendered; `/configure` redirected to `/anthimeria`; `/libraries/example` redirected to `/simples`; no console warnings/errors.
- Active shell/landing identity scan: PASS; no Constituter/Libraries primary identity or links remain.
- Additional full-page browser audit: PASS; one hero/intro, one entry grid, ordered non-overlapping section geometry, 15 real links, no broken images, no horizontal overflow, and semantic header/main/footer landmarks.
- Focus visibility inspection: PASS; focused links receive the configured cyan outline and dark separation ring.
- Owner-supplied visual inventory: PASS; ten named JPG references present under `docs/mockups/`, with native dimensions and SHA-256 hashes recorded during inspection.
- Native landing comparison at 894x1600: PASS after two focused correction loops; rendered document 879x1602 inside the scrollbar-adjusted viewport, regions at header 54px, brand 554px, statement 420px, landscape 502px, and footer 71px.
- Native landing content audit: PASS; zero broken images, zero horizontal overflow, one H1, all four canonical header links visible, and `Get started -> /ontologies`, `More info -> /docs`, and `FAQ -> /docs` are real links.
- Narrow comparison at 390x844: PASS; all four canonical links visible, zero broken images, and `scrollWidth === clientWidth === 375`.
- Browser console inspection after the native and narrow passes: PASS; zero warnings or errors.

### Skipped

- Automated pixel-diff scoring; the visual loop used native-dimension renders, DOM geometry, asset/load checks, and direct image comparison because the reference includes lossy JPEG glow and the browser scrollbar changes the content width by 15px.
- Visual comparison against the remaining nine mockups; they belong to Segments 3-7 and are now available for those owning segments.
- Full root validation chain; Segment 1 changed only workspace wiring and the web shell, and the template/generator final layout is intentionally incomplete until later segments.

### Blocked

- None.

### Inferred

- The nine non-landing references are assigned to their owning segments; no acceptance claim for those surfaces is made here.
- No remote, push, publication, deployment, provider, migration, or secret action occurred.

## Known unresolved issues

- Run the visual render/compare/fix loop for each remaining source image in its owning segment.
- Replace the staged canonical surfaces with their real owning implementations in Segments 2–7.

## Next segment

- Segment 2 — render the canonical TypeScripture pair as one reader with book/chapter switching, deep links, and cross-links.
