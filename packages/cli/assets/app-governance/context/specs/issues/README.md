# Issues

One Markdown file per unit of work: `<PREFIX>-NNN-<slug>.md`. An issue's Scope and Acceptance criteria are the whole job; `.claude/execution/handoff.json` names the next one.

## Format

```yaml
---
id: APP-001
title: "Short imperative title"
type: feature # feature | fix | chore | refactor | test | docs | ci | spike
area: base # a module id, or base
milestone: "M1 · MVP" # optional; created on GitHub by issues:sync
priority: p1 # p0 critical · p1 high · p2 normal · p3 low
size: m # xs <1h · s ~2h · m ~half day · l ~1 day · xl split it
labels: [type:feature, area:base, priority:p1, size:m] # optional; derived from the fields above when absent
depends_on: []
status: todo # todo | in-progress | in-review | done
---
```

Body sections, in order:

1. **Summary**: one or two sentences.
2. **Scope**: a checklist of what to build. Nothing else is in scope.
3. **Acceptance criteria**: a checklist an agent can prove with commands.
4. **Validation**: the commands, e.g. `pnpm validate`, `pnpm test`, `pnpm test:rls`.
5. **Depends on**: issue ids.
6. **Definition of done**: acceptance checked with EXECUTED evidence in `.claude/execution/progress.json`; decisions recorded; handoff points at the next issue.

## Writing good issues

- One capability per issue, sized `m` or smaller.
- New domain entity: start with `hipster-stack slice`, then customize.
- Name the module that owns the work (`area`), so file placement and ownership are clear.
- `/plan` (Loaded Vibes) writes these files from `context/docs/PRD.md`.

## Sync to GitHub

```text
pnpm issues:sync            validate every issue file and show what would change (dry run)
pnpm issues:sync --apply    create the labels, milestones and missing issues (needs gh, signed in)
```

Issues match by their `<ID> ·` title prefix, so reruns never duplicate; GitHub numbers are kept in `.github-map.json` here.
