---
id: CC-024
title: "Module boundary lint rules (CC-MOD-001/002)"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p1
size: m
labels: [type:feature, area:modules, priority:p1, size:m]
depends_on: [CC-021]
status: todo
---

# CC-024 · Module boundary lint rules (CC-MOD-001/002)

## Summary

Mechanically prevent undeclared cross-module imports and base→module imports.

## Scope

- [ ] Add `module-boundaries` rule to `codependent-plugin.mjs` using the ownership resolver and manifest
- [ ] Base files may import module files only from `lib/modules/registry.ts`
- [ ] RuleTester cases for both rules; flip `status: planned` → active in validation.yaml

## Acceptance criteria

- [ ] `pnpm doctrine:test` covers CC-MOD-001/002
- [ ] Template lints clean

## Validation

```powershell
pnpm --dir template doctrine:test
pnpm --dir template lint
```

## Depends on

CC-021

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
