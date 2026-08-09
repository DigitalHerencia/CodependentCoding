# Loaded Vibes Build Specifications

Each `LV-###` file is designed to become one GitHub Issue and one bounded Codex delivery unit.

## Issue conversion

Preserve:

- spec ID in title;
- outcome;
- dependencies;
- scope;
- acceptance criteria;
- validation;
- evidence requirements;
- non-goals.

Do not combine unrelated specs just to reduce Issue count.

## Sequence

```text
LV-001 Canonical template freeze
  -> LV-002 Generation manifest/config
  -> LV-003 CLI/prompts
  -> LV-004 Destination safety
  -> LV-005 Materialization/transforms
  -> LV-006 Install/git/validation lifecycle
  -> LV-007 Generated governance
  -> LV-008 Generator + output CI
  -> LV-009 Package/release proof
  -> LV-010 First optional module
  -> LV-011 Codependent Coding handoff
  -> LV-012 Vibes replacement proof
```

LV-003 and LV-004 may proceed in parallel after LV-002 if their shared config/path contracts are fixed.

## Status vocabulary

`ready-for-issue`, `in-progress`, `blocked`, `implemented`, `verified`, `superseded`.

Live status belongs in `.agents/execution/progress.json`.
