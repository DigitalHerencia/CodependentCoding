---
id: CC-005
title: "Verify the Claude Code harness on Windows"
type: chore
area: governance
milestone: "M0 · Governance bootstrap"
priority: p0
size: xs
labels: [type:chore, area:governance, priority:p0, size:xs]
depends_on: [CC-001]
status: done
---

# CC-005 · Verify the Claude Code harness on Windows

## Summary

Hooks are the enforcement point for agents; prove they fire in the VS Code extension on Windows.

## Scope

- [x] Open the repo in Claude Code; confirm CLAUDE.md loads
- [x] Edit a `.ts` file with a deliberate violation; confirm the PostToolUse hook feeds the ESLint error back
- [x] End a session after a code edit without touching `.claude/execution/`; confirm the Stop hook blocks once with the reminder
- [x] If hooks fail on Windows, adjust `.claude/settings.json` commands (Node path, quoting) and record the fix in decisions.json

## Acceptance criteria

- [x] Lint feedback appears after an edit
- [x] Stop guard fires once and does not loop
- [x] Result recorded in progress.json

## Validation

```powershell
node .claude/hooks/lint-edited-file.mjs < sample.json
node .claude/hooks/execution-state-guard.mjs < sample.json
```

## Depends on

CC-001

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
