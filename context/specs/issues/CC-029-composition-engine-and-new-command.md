---
id: CC-029
title: "Composition engine and `new` command"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p0
size: l
labels: [type:feature, area:cli, priority:p0, size:l]
depends_on: [CC-028, CC-019, CC-021, CC-022]
status: done
---

# CC-029 · Composition engine and `new` command

## Summary

Implement the composition pipeline from Architecture §6.

## Scope

- [ ] Dependency closure + cycle detection
- [ ] Copy with exclusions; delete files owned by unselected modules (reuse ownership resolver)
- [ ] Strip `// @module <removed>` lines; rewrite registry; prune package.json deps declared only by removed modules; rebuild `.env.example`
- [ ] Write `hipster.json`; apply brand color tokens; run `prisma validate`
- [ ] Interactive prompts (name, preset or modules, color) and flags (`--preset`, `--modules`, `--color`, `--yes`, `--no-install`, `--no-git`)
- [ ] Determinism test: composing twice yields identical trees

## Acceptance criteria

- [ ] `hipster-stack new demo --preset blank --yes` → app installs, lints, typechecks, builds
- [ ] Composition unit tests pass for blank, crm, and --all

## Validation

```powershell
pnpm test
hipster-stack new .sandbox/demo --preset blank --yes
pnpm --dir .sandbox/demo validate
pnpm --dir .sandbox/demo build
```

## Depends on

CC-028, CC-019, CC-021, CC-022

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
