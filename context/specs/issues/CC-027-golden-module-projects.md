---
id: CC-027
title: "Golden module: projects"
type: feature
area: modules
milestone: "M3 · Module system"
priority: p0
size: m
labels: [type:feature, area:modules, priority:p0, size:m]
depends_on: [CC-021, CC-022, CC-023]
status: done
---

# CC-027 · Golden module: projects

## Summary

`projects` is the reference slice for scaffolds. Make it exemplary and annotated.

## Scope

- [ ] Audit every layer of `projects` against AUTH.md §5.3 read/write paths
- [ ] Add short 'why' header comments to each file type (one per file)
- [ ] Ensure list, detail, new, edit, client filtering, skeletons, permissions, RLS SQL, and tests exist
- [ ] Document the slice file list in `context/docs/Architecture.md` appendix (generated list)

## Acceptance criteria

- [ ] Reviewer agent checklist passes for `projects`
- [ ] `projects` composes alone and builds

## Validation

```powershell
pnpm --dir template validate
```

## Depends on

CC-021, CC-022, CC-023

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
