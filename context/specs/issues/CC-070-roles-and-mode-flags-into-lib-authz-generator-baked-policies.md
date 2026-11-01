---
id: CC-070
title: "Roles and mode flags into lib/authz; generator-baked policies"
type: refactor
area: template
milestone: "M-T · Template conformance"
priority: p0
size: m
labels: [type:refactor, area:template, priority:p0, size:m]
depends_on: []
status: todo
---

# CC-070 · Roles and mode flags into lib/authz; generator-baked policies

## Scope

- [ ] `lib/constants/roles.ts` → `lib/authz/roles.ts` (pure)
- [ ] Delete runtime `accessControl` branch; generator emits RBAC or ABAC `policies.ts`
- [ ] `tenancy` → `lib/authz/mode.ts`; `INVITATION_TTL_DAYS` stays in constants

## Acceptance criteria

- [ ] `grep -r "\"ADMIN\"" components content features` is empty
- [ ] No file imports `lib/constants/access`

## Validation

```powershell
pnpm --dir template validate
```

## Depends on

—

## References

- ledger I-1, I-2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
