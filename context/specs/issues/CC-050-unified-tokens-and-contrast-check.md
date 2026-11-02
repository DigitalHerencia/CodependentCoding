---
id: CC-050
title: "Unified tokens and contrast check"
type: feature
area: site
milestone: "M-S2 · Design system"
priority: p1
size: m
labels: [type:feature, area:site, priority:p1, size:m]
depends_on: [CC-049]
status: done
---

# CC-050 · Unified tokens and contrast check

## Scope

- [x] Rewrite `app/globals.css` to the Plan §5.1 token set; delete `--site-*` and legacy aliases; zero `!important`
- [x] `scripts/check-contrast.mjs` reads `/* @pairs */` and fails below 4.5:1 text / 3:1 UI
- [x] Replace every text use of `--signal` with `--signal-text`

## Acceptance criteria

- [x] Contrast script passes locally. Owner resource policy supersedes the additional CI validation requirement.
- [ ] Owner verifies preview routes, control hover/selected states and reduced motion; browser/axe results remain unrun until reported.

## Validation

```powershell
node scripts/check-contrast.mjs
node node_modules/typescript/bin/tsc --project tsconfig.build.json --noEmit
```

## Depends on

CC-049

## References

- context/canon/refurbish/PLAN.md §5.1
- ledger P-9

## Definition of done

- Acceptance criteria checked with EXECUTED evidence in `.claude/execution/progress.json`
- `decisions.json` updated if a choice was made; `handoff.json` points at the next issue
- PR uses the template and says `Closes #<this issue>`

Owner policy: no additional CI validation/test jobs or agent dev servers. CI performs changed-file formatting/lint fixes, type generation/checking and the affected-site build. Browser verification is owner-run.

## Delivery

Merged in PR #352 at `d2a4a9b`; issue #302 closed. Previously recorded focused checks and CI passed. Owner browser/appearance checks remain unrun follow-up; unchecked runtime criteria are not claimed as passing.
