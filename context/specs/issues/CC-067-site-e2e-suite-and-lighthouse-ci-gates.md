---
id: CC-067
title: "Site e2e suite and Lighthouse CI gates"
type: test
area: site
milestone: "M-S6 · PWA and polish"
priority: p0
size: m
labels: [type:test, area:site, priority:p0, size:m]
depends_on: [CC-063, CC-060, CC-065]
status: todo
---

# CC-067 · Site e2e suite and Lighthouse CI gates

## Scope

- [ ] Specs per Plan §7; `lhci` with §0 assertions on preview URLs

## Acceptance criteria

- [ ] All §0 gates green on the PR that closes this issue

## Validation

```powershell
pnpm test:e2e
lhci autorun
```

## Depends on

CC-063, CC-060, CC-065

## References

- refurbish/PLAN.md §0, §7

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
