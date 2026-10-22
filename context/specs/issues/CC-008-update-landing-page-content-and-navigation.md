---
id: CC-008
title: "Update landing page content and navigation"
type: feature
area: site
milestone: "M1 · Site reduction"
priority: p2
size: s
labels: [type:feature, area:site, priority:p2, size:s]
depends_on: [CC-006]
status: todo
---

# CC-008 · Update landing page content and navigation

## Summary

Remove dead links and describe the factory: doctrine, template, CLI, plugin.

## Scope

- [ ] Header: logo + GitHub link only
- [ ] Replace CTAs with 'Read the doctrine' (on-page anchor) and 'GitHub'
- [ ] Add a compact section listing the four components with one line each
- [ ] Footer: remove FAQ/Terms/Privacy links that pointed nowhere

## Acceptance criteria

- [ ] No link on `/` returns 404
- [ ] Lighthouse accessibility ≥ 95
- [ ] Matches design.yaml `surfaces.landing`

## Validation

```powershell
pnpm build
pnpm start  # then manual Lighthouse
```

## Depends on

CC-006

## References

- context/docs/Design.md §2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
