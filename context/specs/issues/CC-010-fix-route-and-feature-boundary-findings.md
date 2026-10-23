---
id: CC-010
title: "Fix route and feature boundary findings"
type: refactor
area: template
milestone: "M2 · Template conformance"
priority: p0
size: m
labels: [type:refactor, area:template, priority:p0, size:m]
depends_on: [CC-009]
status: done
---

# CC-010 · Fix route and feature boundary findings

## Summary

Resolve CC-ROUTE-001, CC-FEAT-001/002/004 and CC-CLIENT-001 findings.

## Scope

- [ ] `app/(tenant)/layout.tsx`: move onboarding gate out of the route into `requireTenant()` redirect or the tenant shell feature (CC-ROUTE-001)
- [ ] Rename `features/auth/signInFeature.tsx`/`signUpFeature.tsx` to `*Form.tsx` if they own RHF state, or strip RHF/UI into a block (CC-FEAT-001, CC-CLIENT-001)
- [ ] Edit forms (`crmEdit*Form`, `expenseEditForm`, …): stop importing fetchers; the server `*EditFeature` fetches and passes `defaultValues` as props (CC-FEAT-002)
- [ ] `adminUserDetailFeature.client.tsx`: import role values from `lib/constants`/`types`, not `lib/authz` (CC-FEAT-004)

## Acceptance criteria

- [ ] No CC-ROUTE-_, CC-FEAT-_, CC-CLIENT-* findings
- [ ] Affected pages render (manual or Playwright smoke)

## Validation

```powershell
pnpm --dir template lint
pnpm --dir template typecheck
```

## Depends on

CC-009

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
