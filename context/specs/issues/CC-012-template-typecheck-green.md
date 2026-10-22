---
id: CC-012
title: "Template typecheck green"
type: fix
area: template
milestone: "M2 · Template conformance"
priority: p0
size: m
labels: [type:bug, area:template, priority:p0, size:m]
depends_on: [CC-010, CC-011]
status: todo
---

# CC-012 · Template typecheck green

## Summary

With Prisma generated, ~30 non-Prisma type errors remain. Fix them and remove CI `continue-on-error`.

## Scope

- [ ] Run `pnpm --dir template prisma:generate && pnpm --dir template typecheck`; triage by file
- [ ] Fix errors without loosening tsconfig (CC-TS-001)
- [ ] Remove `continue-on-error` from template lint/typecheck in CI

## Acceptance criteria

- [ ] `pnpm --dir template typecheck` exits 0
- [ ] `pnpm --dir template lint` exits 0
- [ ] CI template job green without continue-on-error

## Validation

```powershell
pnpm --dir template typecheck
pnpm --dir template lint
```

## Depends on

CC-010, CC-011

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
