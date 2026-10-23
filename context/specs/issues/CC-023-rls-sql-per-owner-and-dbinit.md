---
id: CC-023
title: "RLS SQL per owner and db:init"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:feature, area:modules, priority:p0, size:m]
depends_on: [CC-022, CC-016]
status: done
---

# CC-023 · RLS SQL per owner and db:init

## Summary

Each owner ships its RLS policies; generated apps initialize the database in one command.

## Scope

- [ ] Create `prisma/rls/identity.sql` and `prisma/rls/<module>.sql` for every tenant table
- [ ] `template/scripts/db-init.mjs`: `prisma migrate dev --name init`, then create `rls` migration (`--create-only`) with concatenated SQL and apply
- [ ] Add `db:init` script; RLS test (CC-016) uses the same SQL files

## Acceptance criteria

- [ ] Fresh database + `pnpm db:init` → all tenant tables have forced RLS
- [ ] `pnpm test:rls` passes

## Validation

```powershell
pnpm --dir template db:init
pnpm --dir template test:rls
```

## Depends on

CC-022, CC-016

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
