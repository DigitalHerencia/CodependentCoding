---
id: CC-073
title: "Single error mapper with fixed messages and reporting"
type: fix
area: template
milestone: "M-T · Template conformance"
priority: p0
size: s
labels: [type:fix, area:template, priority:p0, size:s]
depends_on: []
status: done
---

# CC-073 · Single error mapper with fixed messages and reporting

## Scope

- [ ] `lib/utils/actionResult.ts` per doctrine Ch. 07
- [ ] `lib/observability/report.ts` returning a correlation ref

## Acceptance criteria

- [ ] No internal message reaches a client in tests; INTERNAL results carry `ref`

## Validation

```powershell
pnpm --dir template test
```

## Depends on

—

## References

- ledger I-5, I-6

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
