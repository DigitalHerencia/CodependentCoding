---
id: CC-044
title: "Release v1.0.0"
type: chore
area: governance
milestone: "M6 · Dogfood and v1.0.0"
priority: p0
size: xs
labels: [type:chore, area:governance, priority:p0, size:xs]
depends_on: [CC-043]
status: todo
---

# CC-044 · Release v1.0.0

## Summary

Tag the factory once every success criterion in PRD §8 has evidence.

## Scope

- [ ] Run the release validation profile
- [ ] Close M0–M6
- [ ] Tag `v1.0.0` and write release notes from progress.json

## Acceptance criteria

- [ ] All PRD §8 criteria have EXECUTED evidence
- [ ] Tag exists

## Validation

```powershell
pnpm validate
pnpm --dir template validate
```

## Depends on

CC-043

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
