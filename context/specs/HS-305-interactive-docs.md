---
id: HS-305
title: Merge Libraries and Docs into interactive documentation
status: active
type: implementation-spec
order: 305
depends_on: [HS-302, HS-303, HS-304]
issue: 139
---

# HS-305 — Interactive Docs

## Outcome

Create one simple Docs experience that combines canonical Markdown documentation with the useful browsable/configuration behavior implied by the Libraries and config-detail mockups.

## Required inputs

Read this spec, Issue #139, `context/docs/{web,documentation,configuration}.md`, `context/mockups/{libraries,config}.png`, the existing docs renderer, Libraries feature/data, and only shared Builder/configuration code needed to prevent semantic duplication.

## Required behavior

- `/docs` is the primary documentation destination and includes a browsable functional-area/building-block overview.
- Detail views combine concise canonical explanation, real fixed/configurable status/example, related concepts, and `Open in Builder` when meaningful.
- `docs/` Markdown remains canonical technical content.
- Reuse shared configuration semantics; no second capability/dependency engine.
- Preserve old `/libraries` URLs through the smallest redirect/compatibility route, then remove Libraries-only code with no caller.
- Use the mockup aesthetic and HS-303 components. TanStack informs browse/detail/action ergonomics only.

## Non-goals

No docs framework/CMS, fake controls, unsupported provider/configuration claims, backend state, or broad content rewrite.

## Verification

Web typecheck/build and route smoke for `/docs`, one fixed concept, one configurable concept, one legacy `/libraries` URL, Builder handoff, and one narrow layout.
