---
id: CC-061
title: "Generated CLI reference and command builder"
type: feat
area: site
milestone: "M-S4 · Product pages"
priority: p1
size: m
labels: [type:feat, area:site, priority:p1, size:m]
depends_on: [CC-049]
status: todo
---

# CC-061 · Generated CLI reference and command builder

## Scope

- [ ] Export command metadata from `packages/cli`; render reference at build
- [ ] Builder island computes the module closure from the manifest

## Acceptance criteria

- [ ] Changing a CLI flag changes the page without editing site code

## Validation

```powershell
pnpm build
```

## Depends on

CC-049

## References

- refurbish/PLAN.md §3.6

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
