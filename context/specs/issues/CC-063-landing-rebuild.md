---
id: CC-063
title: "Landing rebuild"
type: feature
area: site
milestone: "M-S4 · Product pages"
priority: p1
size: m
labels: [type:feature, area:site, priority:p1, size:m]
depends_on: [CC-052, CC-053]
status: in-review
---

# CC-063 · Landing rebuild

## Scope

- [x] Sections per Plan §3.1; numbers computed from source
- [x] CTAs to `/doctrine`, `/maximal`, GitHub

## Acceptance criteria

- [ ] LCP element is the h1; Lighthouse 100 ×4 mobile

## Validation

```powershell
# Focused formatting, changed-code ESLint and root TypeScript.
# Owner preview: desktop/mobile appearance, links, LCP and layout shift.
```

## Depends on

CC-052, CC-053

## References

- refurbish/PLAN.md §3.1, §6.2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`

## Delivery notes

- Existing PR #349 rebased on #355; no duplicate homepage implementation.
- Canonical public copy, tokens, local fonts, SVG brands, content loaders and skip target preserved.
- No local server, build, Lighthouse or full suite. Browser/performance acceptance remains owner-run.
