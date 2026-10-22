---
id: CC-014
title: "Remove generator debris from the template"
type: chore
area: template
milestone: "M2 · Template conformance"
priority: p1
size: s
labels: [type:chore, area:template, priority:p1, size:s]
depends_on: [CC-011]
status: todo
---

# CC-014 · Remove generator debris from the template

## Summary

Generated apps must be white-label and self-contained.

## Scope

- [ ] Remove the ngrok dev script and `concurrently`; `dev` = `next dev`
- [ ] Delete `template/.agents`, `template/context`, `template/AGENTS.md`, `template/content` (if generator-only)
- [ ] Delete `components/blocks/ontology-showcase.tsx` and other factory-specific blocks
- [ ] Remove personal URLs, names, and Digital Herencia branding from template code (keep in factory landing only)

## Acceptance criteria

- [ ] `rg -n "ngrok|liberal-gull|Digital Herencia|Anthimeria" template --glob '!node_modules'` returns nothing
- [ ] `pnpm --dir template validate` passes

## Validation

```powershell
pnpm --dir template validate
```

## Depends on

CC-011

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
