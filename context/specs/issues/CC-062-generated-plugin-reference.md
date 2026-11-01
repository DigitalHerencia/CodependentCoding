---
id: CC-062
title: "Generated plugin reference"
type: feat
area: site
milestone: "M-S4 · Product pages"
priority: p2
size: s
labels: [type:feat, area:site, priority:p2, size:s]
depends_on: [CC-049]
status: todo
---

# CC-062 · Generated plugin reference

## Scope

- [ ] Read skills/agents/hooks from `plugin/loaded-vibes/` at build

## Acceptance criteria

- [ ] Agent tool permissions shown match the agent files

## Validation

```powershell
pnpm build
```

## Depends on

CC-049

## References

- refurbish/PLAN.md §3.7

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
