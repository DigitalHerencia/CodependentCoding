# Specs — build backlog

The complete build of Codependent Coding v1, decomposed into 44 issues across 7 milestones. Each file in `issues/` is one GitHub issue; frontmatter drives labels, milestone, and dependencies.

## Milestones

| Milestone                     | Goal                                                           | Issues          | Exit criteria                                                             |
| ----------------------------- | -------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------- |
| **M0 · Governance bootstrap** | One governance system, working toolchain, CI, GitHub Project   | CC-001 → CC-005 | Lint runs at root and template; CI reports; hooks fire; backlog on GitHub |
| **M1 · Site reduction**       | Landing page only; legacy generator gone                       | CC-006 → CC-008 | Only `/` builds; no `@hipster-stack/*` imports                            |
| **M2 · Template conformance** | Template obeys the doctrine                                    | CC-009 → CC-017 | 0 CC findings, typecheck green, RLS test passes                           |
| **M3 · Module system**        | Computed ownership, registry, multi-file Prisma, RLS per owner | CC-018 → CC-027 | Ownership check passes; base builds with empty registry                   |
| **M4 · Hipster Stack CLI**    | `new`, `slice`, `add`, `doctor`, `compose`                     | CC-028 → CC-035 | Every preset composes and builds in CI                                    |
| **M5 · Loaded Vibes plugin**  | Claude Code plugin: skills, hooks, agents                      | CC-036 → CC-041 | Plugin drives a generated app through idea → ship                         |
| **M6 · Dogfood and v1.0.0**   | Prove the hours-not-weeks goal                                 | CC-042 → CC-044 | Timed MVP run; v1.0.0 tag                                                 |

## Critical path

```text
CC-003 (sync) ─┐
CC-001 ─► CC-002 ─► CC-006 ─► CC-007
   │
   └─► CC-009 ─► CC-010/011 ─► CC-012 ─► CC-016
                                  └─► CC-018 ─► CC-019 ─► CC-020 ─► CC-021/022 ─► CC-023 ─► CC-027
                                                                      └─► CC-028 ─► CC-029 ─► CC-032 ─► CC-039
                                                                                     └─► CC-030 ─► CC-036 ─► CC-037/040
                                                                                     └─► CC-035 ─────────────► CC-042 ─► CC-043 ─► CC-044
```

Start order for Claude Code: **CC-003, CC-001, CC-002, CC-004, CC-005**, then M1 and M2 in parallel streams.

## Issue file format

```yaml
---
id: CC-012
title: "Template typecheck green"
type: fix # feature | fix | chore | refactor | test | docs | ci | spike
area: template # governance | site | template | modules | cli | plugin | ci
milestone: "M2 · Template conformance"
priority: p0 # p0 critical · p1 high · p2 normal · p3 low
size: m # xs <1h · s ~2h · m ~half day · l ~1 day · xl split it
labels: [type:fix, area:template, priority:p0, size:m]
depends_on: [CC-010, CC-011]
status: todo # todo | in-progress | in-review | done (mirrors the Project)
---
```

Body sections: Summary · Scope (checklist) · Acceptance criteria (checklist) · Validation (commands) · Depends on · References · Definition of done.

## GitHub sync

```powershell
pnpm issues:sync                         # dry run: shows labels, milestones, issues to create
pnpm issues:sync -- --apply              # create/update labels + milestones, create missing issues
pnpm issues:sync -- --apply --project 19  # also add every issue to Project #19 (owner DigitalHerencia)
```

- Idempotent: issues are matched by `CC-NNN` title prefix; existing ones are skipped.
- Mapping of `CC-NNN → #number` is written to `issues/.github-map.json`.
- Requires `gh auth login` with `project` scope: `gh auth refresh -s project`.

## Project (v2) setup

Fields: **Status** (Todo, In Progress, In Review, Done) · **Priority** (P0–P3) · **Size** (XS–XL) · **Milestone** (built-in).

Built-in workflows to enable (Project → ⋯ → Workflows):

| Workflow                     | Setting                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| Auto-add to project          | `repo:DigitalHerencia/CodependentCoding is:issue,pr is:open` |
| Item added to project        | Status → Todo                                                |
| Pull request linked to issue | Status → In Progress                                         |
| Pull request merged          | Status → Done                                                |
| Item closed                  | Status → Done                                                |
| Item reopened                | Status → Todo                                                |
| Auto-archive items           | `is:closed updated:<@today-14d`                              |

Views: **Board** by Status (filter current milestone) · **Roadmap** by Milestone · **Table** grouped by area.

## Working an issue (agent or human)

1. `gh issue develop <n> --checkout --name <type>/<n>-<slug>` (or create the branch manually).
2. Open a **draft PR** early with `Closes #<n>`; Project moves the item to In Progress.
3. Implement within the issue scope only. Run the Validation commands.
4. Record evidence in `.claude/execution/progress.json`; decisions in `decisions.json`; next step in `handoff.json`.
5. Mark ready for review → squash-merge → issue closes → Project moves to Done.
