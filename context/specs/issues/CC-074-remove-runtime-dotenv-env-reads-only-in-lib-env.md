---
id: CC-074
title: "Remove runtime dotenv; env reads only in lib/env"
type: fix
area: template
milestone: "M-T · Template conformance"
priority: p1
size: s
labels: [type:fix, area:template, priority:p1, size:s]
depends_on: []
status: done
---

# CC-074 · Remove runtime dotenv; env reads only in lib/env

## Scope

- [ ] Delete `dotenv` calls outside `prisma.config.ts` and scripts
- [ ] Rename `DIRECT_DATABASE_URL` → `DATABASE_URL_UNPOOLED` across template, CLI and docs

## Acceptance criteria

- [ ] `grep -r "dotenv" lib app` is empty

## Validation

```powershell
pnpm --dir template validate
```

## Depends on

—

## References

- ledger F-7, D-2

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
