---
id: CC-006
title: "Reduce the site to the landing page"
type: refactor
area: site
milestone: "M1 · Site reduction"
priority: p1
size: m
labels: [type:refactor, area:site, priority:p1, size:m]
depends_on: [CC-002]
status: todo
---

# CC-006 · Reduce the site to the landing page

## Summary

Only `/` survives. Delete every catalog/workbench/reader route and the code that exists only for them.

## Scope

- [ ] Delete `app/{anthimeria,maximal-template,ontologies,simples,typescripture}`
- [ ] Delete root `lib/{anthimeria,docs,libraries,maximal,public-catalog}.ts` and any component used only by deleted routes
- [ ] Remove `@monaco-editor/react`, `monaco-editor`, `@hipster-stack/core` and other now-unused deps
- [ ] Keep `app/{page,layout,loading,not-found,global-error}.tsx`, `globals.css`, assets in `public/`

## Acceptance criteria

- [ ] `pnpm build` succeeds; route list shows only `/` (+ framework files)
- [ ] `pnpm lint` and `pnpm typecheck` pass at root
- [ ] No import references deleted files

## Validation

```powershell
pnpm validate
pnpm build
```

## Depends on

CC-002

## References

- FR-SITE-1
- DEC-002

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
