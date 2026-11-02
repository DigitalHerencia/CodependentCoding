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
status: done
---

# CC-046 · Enable Cache Components and the static guarantee on the site

## Scope

- [x] `cacheComponents: true`, `partialPrefetching: true` in `next.config.ts`
- [x] `export const ensureStatic = 'navigation'` in `app/layout.tsx`
- [x] Delete `dynamicParams` export; unknown slugs call `notFound()`

## Acceptance criteria

- [x] The affected-site CI build succeeds with the static navigation guarantee enabled.
- [x] The installed Next.js segment schema supports `ensureStatic: 'navigation'`; unknown doctrine slugs retain the existing `notFound()` path.

Owner resource policy supersedes the earlier artificial `cookies()` mutation and repeated-build experiment. Use the framework's static navigation enforcement and the single affected-site CI build; do not start a local build or server.

## Validation

```powershell
node node_modules/eslint/bin/eslint.js next.config.ts app/layout.tsx 'app/(public)/doctrine/[...slug]/page.tsx' --max-warnings=0
node node_modules/typescript/bin/tsc --project tsconfig.build.json --noEmit
```

The affected-site build runs in the pull request's existing CI workflow.

## Depends on

—

## References

- context/canon/doctrine/03-routing-and-rendering.md
- ledger R-1, R-2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
