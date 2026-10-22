---
id: CC-016
title: "RLS cross-tenant test harness against real Postgres"
type: test
area: template
milestone: "M2 · Template conformance"
priority: p0
size: m
labels: [type:test, area:template, priority:p0, size:m]
depends_on: [CC-012]
status: todo
---

# CC-016 · RLS cross-tenant test harness against real Postgres

## Summary

No real-Postgres RLS test exists. Prove tenant isolation with the runtime role.

## Scope

- [ ] Add `tests/rls/` with a Vitest suite using `DATABASE_URL_TEST` (Neon test branch or local Postgres)
- [ ] Setup: migrate as owner, apply `prisma/rls/*.sql`, seed two orgs with rows in every tenant table
- [ ] Assert via `app_user`: org A cannot select/update/delete org B rows, with and without app predicates; missing context returns zero rows
- [ ] Add `test:rls` script; add an optional CI job gated on a `DATABASE_URL_TEST` secret

## Acceptance criteria

- [ ] `pnpm --dir template test:rls` passes locally
- [ ] Fails if any tenant table lacks a policy (negative check)

## Validation

```powershell
pnpm --dir template test:rls
```

## Depends on

CC-012

## References

- context/docs/AUTH.md §6
- CC-SEC-002
- CC-SEC-005

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
