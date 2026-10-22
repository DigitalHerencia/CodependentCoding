## Summary

<!-- One or two sentences: what changed and why. -->

Closes #

## Issue scope

- [ ] Changes stay within the linked issue's Scope
- [ ] Every acceptance criterion is met (check them on the issue)

## Evidence

<!-- Paste the commands you EXECUTED and their result. "Should pass" is not evidence. -->

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
