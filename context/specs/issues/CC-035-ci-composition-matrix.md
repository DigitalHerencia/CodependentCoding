---
id: CC-035
title: "CI composition matrix"
type: ci
area: ci
milestone: "M4 · Hipster Stack CLI"
priority: p0
size: m
labels: [type:ci, area:ci, priority:p0, size:m]
depends_on: [CC-029]
status: done
---

# CC-035 · CI composition matrix

## Summary

Prove every preset composes and builds.

## Scope

- [ ] Job matrix: blank, each preset, `--all`
- [ ] Steps: `hipster-stack compose .sandbox/<p>` → install → lint → typecheck → build
- [ ] Cache pnpm store; run on PRs touching `template/` or `packages/cli/`

## Acceptance criteria

- [ ] All matrix jobs green on main

## Validation

```powershell
gh run list --workflow ci.yml
```

## Depends on

CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
