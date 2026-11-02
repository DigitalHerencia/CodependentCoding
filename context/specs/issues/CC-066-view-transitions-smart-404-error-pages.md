---
id: CC-066
title: "View Transitions, smart 404, error pages"
type: feature
area: site
milestone: "M-S6 · PWA and polish"
priority: p2
size: s
labels: [type:feature, area:site, priority:p2, size:s]
depends_on: [CC-055]
status: todo
---

# CC-066 · View Transitions, smart 404, error pages

## Scope

- [ ] View Transitions on docs navigation, off under reduced motion
- [ ] 404 suggests nearest rule IDs for `/doctrine/rules/*` misses

## Acceptance criteria

- [ ] No motion when `prefers-reduced-motion: reduce`

## Validation

```powershell
pnpm test:e2e
```

## Depends on

CC-055

## References

- refurbish/PLAN.md §3.11

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
