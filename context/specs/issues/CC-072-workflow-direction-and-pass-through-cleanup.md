---
id: CC-072
title: "Workflow direction and pass-through cleanup"
type: refactor
area: template
milestone: "M-T · Template conformance"
priority: p0
size: m
labels: [type:refactor, area:template, priority:p0, size:m]
depends_on: []
status: done
---

# CC-072 · Workflow direction and pass-through cleanup

## Scope

- [x] Lint rule CC-FLOW-003 (no `"use server"` imports in workflows) and CC-FLOW-002 (no single-call bodies)
- [x] Rewrite the five workflows that import actions to use transaction helpers; delete unused pass-throughs

## Acceptance criteria

- [x] `pnpm --dir template lint` clean with both rules on

## Validation

```powershell
pnpm --dir template lint
```

## Depends on

—

## References

- ledger A-1, A-3

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
