---
id: CC-042
title: "Dogfood run: idea to deployed MVP"
type: spike
area: plugin
milestone: "M6 · Dogfood and v1.0.0"
priority: p0
size: l
labels: [type:spike, area:plugin, priority:p0, size:l]
depends_on: [CC-035, CC-040]
status: done
---

# CC-042 · Dogfood run: idea to deployed MVP

## Summary

Prove G2: a real idea reaches a shareable URL in one working day.

## Scope

- [ ] Pick an idea; time each phase: new, /idea, /plan, /slice ×3, /check, /ship
- [ ] Log friction points as new issues (label `dogfood`)
- [ ] Record timings in progress.json

## Acceptance criteria

- [ ] Deployed URL exists
- [ ] Total time ≤ 1 working day or a written gap analysis

## Validation

```powershell
manual timing log
```

## Depends on

CC-035, CC-040

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
