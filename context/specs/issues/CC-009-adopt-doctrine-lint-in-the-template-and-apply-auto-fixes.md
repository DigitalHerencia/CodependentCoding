---
id: CC-009
title: "Adopt doctrine lint in the template and apply auto-fixes"
type: refactor
area: template
milestone: "M2 · Template conformance"
priority: p0
size: s
labels: [type:refactor, area:template, priority:p0, size:s]
depends_on: [CC-001]
status: todo
---

# CC-009 · Adopt doctrine lint in the template and apply auto-fixes

## Summary

The doctrine plugin is already in `template/eslint/`. Turn it on and let auto-fix clear the mechanical findings (server-only, @/ imports).

## Scope

- [ ] Confirm `template/eslint.config.mjs` loads `doctrine` from `./eslint/codependent-plugin.mjs`
- [ ] Add scripts `doctrine:test` (`node --test eslint/*.test.mjs`) and `lint:fix`
- [ ] Run `pnpm lint:fix` once; commit the auto-fix as its own commit
- [ ] Record remaining findings by rule ID in progress.json

## Acceptance criteria

- [ ] `pnpm doctrine:test` passes (44 tests)
- [ ] No CC-SRV-001 or CC-STYLE-002 findings remain
- [ ] Typecheck error count does not increase vs. before the fix

## Validation

```powershell
pnpm --dir template doctrine:test
pnpm --dir template lint
pnpm --dir template typecheck
```

## Depends on

CC-001

## References

- Audit 2026-10-22: 241 findings → 73 after auto-fix, 0 new type errors

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
