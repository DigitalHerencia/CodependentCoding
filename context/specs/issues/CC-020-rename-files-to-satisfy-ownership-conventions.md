---
id: CC-020
title: "Rename files to satisfy ownership conventions"
type: refactor
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:refactor, area:modules, priority:p0, size:m]
depends_on: [CC-019]
status: todo
---

# CC-020 · Rename files to satisfy ownership conventions

## Summary

Make ownership unambiguous: prefix transactions, split shared files, move domain code out of base names.

## Scope

- [ ] Transactions → `<module>-<verb>-<noun>.tx.ts` (e.g. `update-deal-stage.tx.ts` → `crm-update-deal-stage.tx.ts`)
- [ ] Split mixed files (`commonActions.ts`, `organizationWorkflows.ts` if module-specific parts exist)
- [ ] Move domain templates to `<module>…Template.tsx` names
- [ ] Update the `filename-convention` table if the transaction pattern changes

## Acceptance criteria

- [ ] `pnpm check:ownership` passes with zero ambiguities
- [ ] `pnpm validate` passes

## Validation

```powershell
pnpm --dir template check:ownership
pnpm --dir template validate
```

## Depends on

CC-019

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
