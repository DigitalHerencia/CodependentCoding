---
id: CC-075
title: "Cache Components and nonce CSP in the template"
type: feature
area: template
milestone: "M-T · Template conformance"
priority: p0
size: m
labels: [type:feature, area:template, priority:p0, size:m]
depends_on: []
status: done
---

# CC-075 · Cache Components and nonce CSP in the template

## Scope

- [x] `cacheComponents`, `partialPrefetching`; `ensureStatic` on `(public)`
- [x] Nonce CSP in `proxy.ts` with Clerk hosts from Clerk's CSP guide for the installed version
- [x] Lint rule CC-CACHE-002

## Acceptance criteria

- [x] Tenant pages render with a nonce; no CSP violations in the browser console during e2e

## Validation

```powershell
pnpm --dir template test:e2e
```

## Depends on

—

## References

- doctrine/03, 10

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
