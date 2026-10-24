---
id: CC-033
title: "`add` command"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p2
size: m
labels: [type:feature, area:cli, priority:p2, size:m]
depends_on: [CC-029]
status: done
---

# CC-033 · `add` command

## Summary

Add a module to an existing generated app.

## Scope

- [ ] Read `hipster.json`; resolve closure; copy owned files from the template; restore tagged prisma lines; rewrite registry; merge deps and env
- [ ] Refuse when the app modified files the module would overwrite (list conflicts)

## Acceptance criteria

- [ ] `hipster-stack add crm` in a blank app → validate and build pass

## Validation

```powershell
pnpm --dir .sandbox/demo validate
```

## Depends on

CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
