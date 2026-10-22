---
id: CC-003
title: "Create labels, milestones and the GitHub Project; sync issues"
type: chore
area: governance
milestone: "M0 · Governance bootstrap"
priority: p0
size: s
labels: [type:chore, area:governance, priority:p0, size:s]
depends_on: []
status: done
---

# CC-003 · Create labels, milestones and the GitHub Project; sync issues

## Summary

Put this backlog on GitHub with Projects v2 automation so status is visible outside the repo.

## Scope

- [ ] Run `pnpm issues:sync` (dry run) and review the plan
- [ ] Run `pnpm issues:sync -- --apply` to create labels from `.github/labels.yml`, milestones M0–M6, and issues from `context/specs/issues/`
- [ ] Create Project (v2) **Codependent Coding** with fields: Status (Todo, In Progress, In Review, Done), Priority (P0–P3), Size (XS–XL), Milestone
- [ ] Enable built-in workflows: Auto-add (repo:DigitalHerencia/CodependentCoding), Item closed → Done, Pull request merged → Done, Item reopened → Todo, Pull request linked to issue → In Progress
- [ ] Run `pnpm issues:sync -- --apply --project <number>` to add all issues to the project
- [ ] Commit the generated `context/specs/issues/.github-map.json`

## Acceptance criteria

- [ ] All 44 issues exist on GitHub with correct labels and milestones
- [ ] All issues appear on the Project board in Todo
- [ ] Re-running the sync creates nothing new (idempotent)

## Validation

```powershell
pnpm issues:sync
gh issue list --limit 100 --state all
```

## References

- context/specs/README.md

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`
