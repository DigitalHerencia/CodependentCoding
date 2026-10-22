---
id: CC-032
title: "`slice` scaffolder"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p0
size: l
labels: [type:feature, area:cli, priority:p0, size:l]
depends_on: [CC-027, CC-029]
status: todo
---

# CC-032 · `slice` scaffolder

## Summary

Generate a full vertical slice for an entity from golden-module templates.

## Scope

- [ ] Field DSL parser: `string`, `text`, `int`, `decimal`, `boolean`, `datetime`, `enum(a|b)`, `ref(Model)`, optional `?`
- [ ] Templates in `packages/cli/templates/slice/` derived from `projects` (model, rls, schemas, types, select, dto, fetchers, actions, list/detail features, new/edit forms, client companion, skeletons, pages, module nav entry, permissions, test stub)
- [ ] Merges into existing module files where they exist (append functions/exports) or creates new ones
- [ ] Runs `prisma format` and `eslint --fix` on outputs

## Acceptance criteria

- [ ] `hipster-stack slice invoice --module invoicing --fields "number:string,amount:decimal,status:enum(draft|sent|paid)"` in a generated app → lint, typecheck, build pass
- [ ] Generated files satisfy every CC rule without edits

## Validation

```powershell
pnpm --dir .sandbox/demo lint
pnpm --dir .sandbox/demo typecheck
```

## Depends on

CC-027, CC-029

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
