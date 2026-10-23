---
id: CC-011
title: "Fix server-layer boundary and naming findings"
type: refactor
area: template
milestone: "M2 · Template conformance"
priority: p0
size: m
labels: [type:refactor, area:template, priority:p0, size:m]
depends_on: [CC-009]
status: done
---

# CC-011 · Fix server-layer boundary and naming findings

## Summary

Resolve CC-INT-001, CC-READ-001, CC-FLOW-001, CC-SCHEMA-001 and CC-NAME-001 findings.

## Scope

- [ ] `lib/integrations/{stripe,sendgrid}/webhooks.ts`: keep verification/parsing; move persistence to the webhook route via `*.tx.ts` or a workflow (CC-INT-001)
- [ ] `lib/fetchers/aiFetchers.ts`: move provider calls to `aiWorkflows.ts` (CC-READ-001); `integrationFetchers.ts`: read status via `lib/env` or move to a workflow
- [ ] `lib/workflows/crm/calculate-pipeline-value.logic.ts`: rename to `lib/workflows/crm/calculatePipelineValue.ts`; replace runtime `@prisma/client` import with a DTO type (CC-FLOW-001, CC-NAME-001)
- [ ] `schemas/adminSchemas.ts`: take role values from `lib/constants/roles.ts` (CC-SCHEMA-001)
- [ ] Rename `types/access.ts` → `types/accessTypes.ts`; move or delete `features/explorer` (generator debris)

## Acceptance criteria

- [ ] `pnpm --dir template lint` reports 0 CC-* findings
- [ ] Webhook integration tests still pass

## Validation

```powershell
pnpm --dir template lint
pnpm --dir template test
```

## Depends on

CC-009

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
