---
id: CC-004
title: "CI baseline workflow"
type: ci
area: ci
milestone: "M0 · Governance bootstrap"
priority: p0
size: s
labels: [type:ci, area:ci, priority:p0, size:s]
depends_on: [CC-001]
status: done
---

# CC-004 · CI baseline workflow

## Summary

Every PR must prove format, lint, doctrine tests, typecheck and tests for root and template.

## Scope

- [ ] Verify `.github/workflows/ci.yml` runs on PR and push to main
- [ ] Jobs: `root` (format:check, lint, typecheck, test) and `template` (format:check, lint, doctrine:test, prisma generate, typecheck, test)
- [ ] Use `pnpm/action-setup` + `actions/setup-node` with Node 24 and pnpm cache
- [ ] Add `doctrine:test` (`node --test eslint/*.test.mjs`) to `template/package.json` if CC-009 has not landed yet
- [ ] Allow `continue-on-error` only on template format/lint/typecheck until CC-012/CC-013 land

## Acceptance criteria

- [ ] CI runs on a test PR and reports both jobs
- [ ] Doctrine tests (44 cases) pass in CI

## Validation

```powershell
gh run list --limit 5
gh run view --log-failed
```

## Depends on

CC-001

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
