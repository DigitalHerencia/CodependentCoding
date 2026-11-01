---
id: CC-069
title: "Runtime and system database roles; RLS policy rewrite"
type: fix
area: template
milestone: "M-T · Template conformance"
priority: p0
size: l
labels: [type:fix, area:template, priority:p0, size:l]
depends_on: []
status: todo
---

# CC-069 · Runtime and system database roles; RLS policy rewrite

## Scope

- [ ] Migration creating `app_runtime` and `app_system` (SQL, idempotent, NOBYPASSRLS)
- [ ] Rewrite `prisma/rls/*.sql`: setting cast, `(SELECT …)`, `TO app_runtime`; AuditEvent insert/select only; RLS on system tables
- [ ] RLS ships only as migrations; CI diffs `pg_policies` against source

## Acceptance criteria

- [ ] `doctor` reports runtime role not owner, not BYPASSRLS, not in neon_superuser
- [ ] EXPLAIN of a tenant list query under RLS uses the `(organizationId, …)` index
- [ ] Cross-tenant suite passes as `app_runtime`

## Validation

```powershell
pnpm --dir template test:rls
pnpm --dir template exec hipster-stack doctor
```

## Depends on

—

## References

- context/canon/doctrine/05-data.md
- ledger D-1..D-7

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
