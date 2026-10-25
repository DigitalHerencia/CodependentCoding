---
id: CC-043
title: "Docs, README and doctrine sync check"
type: docs
area: governance
milestone: "M6 · Dogfood and v1.0.0"
priority: p1
size: s
labels: [type:docs, area:governance, priority:p1, size:s]
depends_on: [CC-042]
status: in-review
---

# CC-043 · Docs, README and doctrine sync check

## Summary

Final documentation pass and a script that keeps validation.yaml and doctrine-map.mjs aligned.

## Scope

- [ ] Rewrite root README: what the factory is, install CLI, install plugin, MVP loop
- [ ] `pnpm doctrine:check`: every CC id in doctrine-map/plugin exists in validation.yaml and vice versa
- [ ] Update context/docs where implementation diverged; record decisions

## Acceptance criteria

- [ ] `pnpm doctrine:check` passes
- [ ] README instructions work on a clean clone

## Validation

```powershell
pnpm doctrine:check
```

## Depends on

CC-042

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
