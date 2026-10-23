---
id: CC-025
title: "Validated env per owner"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p1
size: s
labels: [type:feature, area:modules, priority:p1, size:s]
depends_on: [CC-018]
status: done
---

# CC-025 · Validated env per owner

## Summary

Replace ad-hoc `process.env` reads with Zod-validated `lib/env/<owner>.ts`.

## Scope

- [ ] `lib/env/base.ts` (Clerk, database), `lib/env/<module>.ts` for modules with env
- [ ] Manifest `env` entries match the Zod schemas (script check)
- [ ] `.env.example` generated from manifest entries by `template/scripts/env-example.mjs`

## Acceptance criteria

- [ ] No `process.env` outside `lib/env/**` and config files (lint or rg check)
- [ ] Missing required env fails fast with a clear message

## Validation

```powershell
rg -n "process\.env" template --glob '!lib/env/**' --glob '!*.config.*' --glob '!node_modules'
```

## Depends on

CC-018

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
