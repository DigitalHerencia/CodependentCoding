---
id: CC-028
title: "CLI skeleton and local install"
type: feature
area: cli
milestone: "M4 · Hipster Stack CLI"
priority: p0
size: s
labels: [type:feature, area:cli, priority:p0, size:s]
depends_on: [CC-018]
status: done
---

# CC-028 · CLI skeleton and local install

## Summary

Create `packages/cli` with commander + @clack/prompts; installable with `pnpm link --global`.

## Scope

- [ ] `packages/cli/{package.json,src/cli.ts,src/commands/,src/compose/,src/manifest/,templates/}`
- [ ] `bin: hipster-stack`; root scripts `cli`, `cli:build`, `cli:link`
- [ ] Template resolution: `HIPSTER_TEMPLATE` env or `<repo>/template`
- [ ] `hipster-stack --version` and `--help`

## Acceptance criteria

- [ ] `pnpm cli:link` then `hipster-stack --help` works from any directory on Windows

## Validation

```powershell
pnpm cli:build
hipster-stack --help
```

## Depends on

CC-018

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
