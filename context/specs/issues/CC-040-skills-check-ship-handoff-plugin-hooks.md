---
id: CC-040
title: "Skills: check, ship, handoff; plugin hooks"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p0
size: m
labels: [type:feature, area:plugin, priority:p0, size:m]
depends_on: [CC-036]
status: done
---

# CC-040 · Skills: check, ship, handoff; plugin hooks

## Summary

Validation, deployment, and execution-state discipline inside generated apps.

## Scope

- [ ] `check`: run validation profiles, group findings by CC ID, fix, re-run
- [ ] `ship`: env sync to Vercel, `vercel deploy --prod`, smoke the URL, record evidence
- [ ] `handoff`: update decisions/progress/handoff JSON
- [ ] `hooks/hooks.json`: PostToolUse lint (reuse `.claude/hooks/lint-edited-file.mjs`), Stop execution-state guard; active only when `hipster.json` exists

## Acceptance criteria

- [ ] Hooks fire in a generated app and not in unrelated repos
- [ ] `ship` produces a working URL on a test app

## Validation

```powershell
vercel ls
```

## Depends on

CC-036

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
