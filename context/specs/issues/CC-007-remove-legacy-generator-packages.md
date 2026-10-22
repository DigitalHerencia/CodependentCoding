---
id: CC-007
title: "Remove legacy generator packages"
type: refactor
area: cli
milestone: "M1 · Site reduction"
priority: p1
size: s
labels: [type:refactor, area:cli, priority:p1, size:s]
depends_on: [CC-006]
status: todo
---

# CC-007 · Remove legacy generator packages

## Summary

`packages/core`, `packages/schema`, and the Codex `packages/loaded-vibes` implement the retired generator. Remove them; salvage only what M4/M5 will reuse.

## Scope

- [ ] Copy reusable pieces to `context/doctrine/salvage/` for reference: `packages/core/src/presets.ts`, `ontologies.ts`, Loaded Vibes validators and prompts
- [ ] Delete `packages/core`, `packages/schema`, `packages/loaded-vibes`, `packages/cli` (rebuilt in M4), `tsdown.config.ts`, `dist/`
- [ ] Remove `cli:dev`, `cli:build`, `test:generated` scripts until M4

## Acceptance criteria

- [ ] `pnpm install` and `pnpm validate` pass
- [ ] No `@hipster-stack/*` imports remain

## Validation

```powershell
pnpm validate
```

## Depends on

CC-006

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
