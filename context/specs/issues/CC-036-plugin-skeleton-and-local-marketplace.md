---
id: CC-036
title: "Plugin skeleton and local marketplace"
type: feature
area: plugin
milestone: "M5 · Loaded Vibes plugin"
priority: p0
size: s
labels: [type:feature, area:plugin, priority:p0, size:s]
depends_on: [CC-030]
status: done
---

# CC-036 · Plugin skeleton and local marketplace

## Summary

Create the Loaded Vibes Claude Code plugin and make it installable from this repo.

## Scope

- [ ] `plugin/loaded-vibes/.claude-plugin/plugin.json` (name, version, description)
- [ ] Root `.claude-plugin/marketplace.json` listing the plugin at `./plugin/loaded-vibes`
- [ ] `references/doctrine.md`: condensed classifier + CC table generated from validation.yaml
- [ ] README section: `/plugin marketplace add <repo path>`, `/plugin install loaded-vibes@codependent-coding`

## Acceptance criteria

- [ ] Plugin installs in Claude Code on Windows
- [ ] Skills list shows the plugin namespace

## Validation

```powershell
claude plugin validate plugin/loaded-vibes  # if available, else manual install
```

## Depends on

CC-030

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
