---
id: CC-038
title: "Skill: plan (docs → issues)"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p1
size: s
labels: [type:feature, area:plugin, priority:p1, size:s]
depends_on: [CC-037]
status: todo
---

# CC-038 · Skill: plan (docs → issues)

## Summary

Decompose an app's PRD into issues using this repo's issue format and optionally sync to GitHub.

## Scope

- [ ] Writes `context/specs/issues/*.md` with the same frontmatter as the factory
- [ ] Bundles `sync-issues.mjs` usage (copied into generated apps by the CLI)

## Acceptance criteria

- [ ] Generated issues parse with the sync script dry run

## Validation

```powershell
node scripts/github/sync-issues.mjs
```

## Depends on

CC-037

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
