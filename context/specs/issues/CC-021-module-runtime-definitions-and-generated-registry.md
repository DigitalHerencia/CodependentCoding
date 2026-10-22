---
id: CC-021
title: "Module runtime definitions and generated registry"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p0
size: l
labels: [type:feature, area:modules, priority:p0, size:l]
depends_on: [CC-020]
status: todo
---

# CC-021 · Module runtime definitions and generated registry

## Summary

Base reaches modules only through `lib/modules/registry.ts`.

## Scope

- [ ] Add `types/moduleTypes.ts` (`ModuleDefinition`: id, nav, dashboard, permissions)
- [ ] Create `lib/modules/<id>.module.ts` for every module
- [ ] Create `lib/modules/registry.ts` (all modules in the maximal template) with a 'generated' header
- [ ] Refactor tenant shell sidebar, dashboard widgets, and `lib/authz/resources.ts` to read `installedModules`
- [ ] Remove hard-coded module nav/routes from base (`lib/constants/routes.ts` keeps base routes only)

## Acceptance criteria

- [ ] Emptying the registry array still type-checks and builds base
- [ ] Sidebar/dashboard render from registry

## Validation

```powershell
pnpm --dir template validate
pnpm --dir template build
```

## Depends on

CC-020

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
