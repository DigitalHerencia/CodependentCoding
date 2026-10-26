<!--
Title: a Conventional Commit, because it becomes the squash commit on main.
  type(scope): summary      e.g. fix(cli): ask for the Neon connection string
  types: feat fix docs style refactor perf test build ci chore revert   (add ! for breaking)
Branch: <type>/<issue#>-<slug>. Merging deletes the branch and closes the issue below.
-->

## Summary

<!-- One or two sentences: what changed and why. -->

Closes #

Docs / spec: <!-- context/docs/<file>.md §N or context/specs/issues/CC-NNN-*.md -->

## Issue scope

- [ ] Changes stay within the linked issue's Scope
- [ ] Every acceptance criterion is met (check them on the issue)

## Evidence

<!-- CI runs only the checks the changed files need. Paste anything you ran locally
     that CI does not (e.g. pnpm --dir template test:rls against Neon). "Should pass" is not evidence. -->

```text
pnpm validate                    →
pnpm --dir template validate     →
```

## Doctrine

- [ ] No new CC-* findings (`pnpm lint`)
- [ ] No `eslint-disable` without an inline reason and a DEC entry
- [ ] If a rule changed: Architecture.md + validation.yaml + template/eslint updated together (label `doctrine`)

## Security (template / generated-app changes)

- [ ] Actions authenticate → authorize → validate (Zod) → write
- [ ] Tenant queries include `organizationId` in the predicate
- [ ] New tenant tables have RLS policies and `test:rls` coverage
- [ ] No secrets in client code or `NEXT_PUBLIC_*`

## Execution state

- [ ] `.claude/execution/progress.json` records the evidence above
- [ ] `.claude/execution/decisions.json` updated (if a decision was made)
- [ ] `.claude/execution/handoff.json` points at the next issue
