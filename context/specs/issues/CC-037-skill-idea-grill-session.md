---
id: CC-037
title: "Skill: idea (grill session)"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p0
size: m
labels: [type:feature, area:plugin, priority:p0, size:m]
depends_on: [CC-036]
status: done
---

# CC-037 · Skill: idea (grill session)

## Summary

Mad-Libs interview that fills the five docs and compiles the three YAML contracts in a generated app.

## Scope

- [ ] Interview script: problem, user, core entities, MVP scope (3–5 slices), success metric, modules to keep
- [ ] Writes `context/docs/*.md` from the app-governance templates; never touches doctrine sections
- [ ] Compiles `.claude/contracts/{application,validation,design}.yaml`; records DEC entries
- [ ] Proposes `hipster-stack slice` commands for each entity

## Acceptance criteria

- [ ] Dry run on a sample idea produces coherent docs and valid YAML
- [ ] Asks at most ~12 questions

## Validation

```powershell
node -e "require('yaml')"  # YAML validity check script
```

## Depends on

CC-036

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
