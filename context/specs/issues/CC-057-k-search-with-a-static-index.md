---
id: CC-057
title: "⌘K search with a static index"
type: feature
area: site
milestone: "M-S3 · Docs platform"
priority: p1
size: m
labels: [type:feature, area:site, priority:p1, size:m]
depends_on: [CC-055]
status: todo
---

# CC-057 · ⌘K search with a static index

## Scope

- [ ] Build MiniSearch JSON (titles, headings, rule IDs/statements, glossary, body)
- [ ] `docsSearch.client.tsx`: shadcn Command dialog; `⌘K`, `Ctrl+K`, `/` open; grouped results

## Acceptance criteria

- [ ] Index loads only on first open
- [ ] Searching `CC-READ-002` returns the rule first
- [ ] Fully keyboard operable; axe clean

## Validation

```powershell
pnpm test:e2e -- search
```

## Depends on

CC-055

## References

- refurbish/PLAN.md §4

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
