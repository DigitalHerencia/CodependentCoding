---
id: CC-041
title: "Agents: reviewer and verifier"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p1
size: s
labels: [type:feature, area:plugin, priority:p1, size:s]
depends_on: [CC-036]
status: todo
---

# CC-041 · Agents: reviewer and verifier

## Summary

Independent review and evidence verification.

## Scope

- [ ] `agents/reviewer.md`: architecture + AUTH threat checklist (AUTH.md §11), outputs findings with CC IDs
- [ ] `agents/verifier.md`: re-runs required checks, compares claims in progress.json with executed results

## Acceptance criteria

- [ ] Reviewer catches a planted violation (cross-tenant query without predicate)
- [ ] Verifier flags a claimed-but-not-run check

## Validation

```powershell
manual
```

## Depends on

CC-036

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
