---
id: CC-046
title: "Enable Cache Components and the static guarantee on the site"
type: build
area: site
milestone: "M-S1 · Foundation"
priority: p0
size: s
labels: [type:build, area:site, priority:p0, size:s]
depends_on: []
status: todo
---

# CC-046 · Enable Cache Components and the static guarantee on the site

## Scope

- [ ] `cacheComponents: true`, `partialPrefetching: true` in `next.config.ts`
- [ ] `export const ensureStatic = 'navigation'` in `app/layout.tsx`
- [ ] Delete `dynamicParams` export; unknown slugs call `notFound()`

## Acceptance criteria

- [ ] `pnpm build` succeeds and every route is reported static
- [ ] Adding a `cookies()` call to any page fails the build (verified once, reverted)

## Validation

```powershell
pnpm build
```

## Depends on

—

## References

- context/canon/doctrine/03-routing-and-rendering.md
- ledger R-1, R-2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
