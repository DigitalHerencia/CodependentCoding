---
id: CC-017
title: "Test baseline: Vitest and Playwright green"
type: test
area: template
milestone: "M2 · Template conformance"
priority: p1
size: s
labels: [type:test, area:template, priority:p1, size:s]
depends_on: [CC-012]
status: todo
---

# CC-017 · Test baseline: Vitest and Playwright green

## Summary

Existing tests must run; add a minimal E2E smoke.

## Scope

- [ ] Add `vitest` 4.1.11 and `@playwright/test` 1.62.1 to template devDependencies; add `test`, `test:e2e` scripts and `vitest.config.ts`
- [ ] Fix `tests/{onboarding,domain-workflows,auth-webhooks.integration}.test.ts` to run under `pnpm test`
- [ ] Add Playwright smoke: `/` renders, `/dashboard` redirects unauthenticated users to sign-in

## Acceptance criteria

- [ ] `pnpm --dir template test` passes
- [ ] `pnpm --dir template test:e2e` passes locally
- [ ] CI template `test` step no longer has continue-on-error

## Validation

```powershell
pnpm --dir template test
pnpm --dir template test:e2e
```

## Depends on

CC-012

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
