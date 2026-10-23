---
id: CC-022
title: "Prisma multi-file schema with module tags"
type: refactor
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:refactor, area:modules, priority:p0, size:m]
depends_on: [CC-020]
status: done
---

# CC-022 · Prisma multi-file schema with module tags

## Summary

Split `prisma/schema.prisma` into `prisma/schema/<owner>.prisma`; tag cross-module relation fields.

## Scope

- [ ] `base.prisma` (generator, datasource), `identity.prisma` (User, Organization, Membership, AuditLog, WebhookEvent), one file per module
- [ ] Tag every module relation field on base models with `// @module <id>`
- [ ] Update `prisma.config.ts` schema path; regenerate client

## Acceptance criteria

- [ ] `prisma validate` passes
- [ ] Deleting a module's schema file + its tagged lines still validates (scripted check)

## Validation

```powershell
pnpm --dir template exec prisma validate
```

## Depends on

CC-020

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
