---
id: CC-015
title: "Error, loading and ISR conventions"
type: feature
area: template
milestone: "M2 · Template conformance"
priority: p1
size: s
labels: [type:feature, area:template, priority:p1, size:s]
depends_on: [CC-012]
status: done
---

# CC-015 · Error, loading and ISR conventions

## Summary

Make route-group error/loading boundaries and public ISR explicit (gap found during doctrine pass).

## Scope

- [ ] Each route group has `error.tsx` and `loading.tsx`; root `global-error.tsx` exists
- [ ] Public pages export `revalidate` (ISR) per Design/tech requirements
- [ ] Every dynamic tenant page wraps its feature in `Suspense` with the feature skeleton (CC-UX-001)

## Acceptance criteria

- [ ] Route groups audited; checklist in PR
- [ ] `pnpm --dir template build` shows public routes as static/ISR

## Validation

```powershell
pnpm --dir template build
```

## Depends on

CC-012

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
