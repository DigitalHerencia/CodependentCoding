---
id: CC-034
title: "`doctor` command"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p2
size: s
labels: [type:feature, area:cli, priority:p2, size:s]
depends_on: [CC-029]
status: todo
---

# CC-034 · `doctor` command

## Summary

Diagnose a generated app's readiness.

## Scope

- [ ] Checks: required env present (from manifest), DB reachable, migrations applied, RLS enabled on tenant tables, lint, ownership
- [ ] Output: pass/warn/fail table with fix hints

## Acceptance criteria

- [ ] Clear output on a fresh app (missing env → warn with exact variable names)

## Validation

```powershell
hipster-stack doctor
```

## Depends on

CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
