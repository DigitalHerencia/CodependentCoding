---
id: CC-018
title: "Module manifest and schema"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:feature, area:modules, priority:p0, size:m]
depends_on: [CC-012]
status: todo
---

# CC-018 · Module manifest and schema

## Summary

Create `template/hipster.modules.json` (build-time facts only) with a Zod schema and JSON Schema.

## Scope

- [ ] Define Zod schema in `packages/cli` later; for now `template/scripts/modules-schema.mjs` + generated `hipster.modules.schema.json`
- [ ] Entries for domain modules (crm, projects, support, marketing, invoicing, social, ai, portal, admin) and add-ons (billing, uploads, media, email, inference, ratelimit)
- [ ] Presets per application.yaml
- [ ] Validate: unique ids, reserved ids rejected, dependsOn targets exist, no cycles

## Acceptance criteria

- [ ] Manifest validates
- [ ] Unit test covers cycle and reserved-id rejection

## Validation

```powershell
node template/scripts/check-modules.mjs
```

## Depends on

CC-012

## References

- context/docs/Architecture.md §5.1

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
