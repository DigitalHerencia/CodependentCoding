---
id: CC-019
title: "Ownership resolver and orphan check"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:feature, area:modules, priority:p0, size:m]
depends_on: [CC-018]
status: done
---

# CC-019 · Ownership resolver and orphan check

## Summary

Compute the owner of every file from naming conventions; fail on ambiguity.

## Scope

- [ ] Implement `template/scripts/ownership.mjs` exporting `ownerOf(path, manifest)` per Architecture §5.2
- [ ] `pnpm check:ownership` prints a per-module file count and fails on files matched by two modules
- [ ] Snapshot test: ownership report for the current template

## Acceptance criteria

- [ ] `pnpm --dir template check:ownership` runs and reports
- [ ] Ambiguities listed (fixed in CC-020)

## Validation

```powershell
pnpm --dir template check:ownership
```

## Depends on

CC-018

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
