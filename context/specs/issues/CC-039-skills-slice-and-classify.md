---
id: CC-039
title: "Skills: slice and classify"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p0
size: m
labels: [type:feature, area:plugin, priority:p0, size:m]
depends_on: [CC-032, CC-036]
status: todo
---

# CC-039 · Skills: slice and classify

## Summary

`slice` runs the CLI scaffold then fills domain logic; `classify` answers 'where does this go'.

## Scope

- [ ] `slice`: gather fields → run `hipster-stack slice` → implement workflow rules and validation specifics only → run check profile
- [ ] `classify`: read `references/doctrine.md`; output path + filename + layer + rule IDs that apply
- [ ] Both forbid creating directories outside the classifier

## Acceptance criteria

- [ ] Slice skill on a sample entity yields lint-clean code with domain logic filled
- [ ] Classify answers 10 sample prompts correctly

## Validation

```powershell
pnpm validate
```

## Depends on

CC-032, CC-036

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
