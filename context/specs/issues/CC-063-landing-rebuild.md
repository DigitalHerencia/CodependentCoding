---
id: CC-063
title: "Landing rebuild"
type: feat
area: site
milestone: "M-S4 · Product pages"
priority: p1
size: m
labels: [type:feat, area:site, priority:p1, size:m]
depends_on: [CC-052, CC-053]
status: todo
---

# CC-063 · Landing rebuild

## Scope

- [ ] Sections per Plan §3.1; numbers computed from source
- [ ] CTAs to `/doctrine`, `/maximal`, GitHub

## Acceptance criteria

- [ ] LCP element is the h1; Lighthouse 100 ×4 mobile

## Validation

```powershell
lhci autorun
```

## Depends on

CC-052, CC-053

## References

- refurbish/PLAN.md §3.1, §6.2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
