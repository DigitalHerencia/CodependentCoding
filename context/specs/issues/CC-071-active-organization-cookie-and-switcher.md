---
id: CC-071
title: "Active-organization cookie and switcher"
type: feature
area: template
milestone: "M-T · Template conformance"
priority: p1
size: m
labels: [type:feature, area:template, priority:p1, size:m]
depends_on: [CC-070]
status: done
---

# CC-071 · Active-organization cookie and switcher

## Scope

- [ ] `lib/auth/active-organization.ts`; tenancy wrapper prefers the cookie and re-validates
- [ ] Org switcher action + nav widget

## Acceptance criteria

- [ ] A two-membership user can switch and every page follows

## Validation

```powershell
pnpm --dir template test
```

## Depends on

CC-070

## References

- ledger I-3

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
