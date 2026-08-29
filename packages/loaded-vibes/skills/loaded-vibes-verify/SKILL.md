---
name: loaded-vibes-verify
description: Select and execute proportional verification for an Arrangement change. Use after implementation or during diagnosis to run architecture validation, smoke checks, formatting/lint/typecheck/tests/build or narrower checks required by the changed behavior, and report truthful evidence.
---


# Loaded Vibes: Verify

Prove the changed behavior at the cheapest reliable level first.

1. Read package scripts and repository validation contracts.
2. Run the mechanical architecture validator for architecture-affecting changes.
3. Run the Arrangement smoke validator when project shape/provenance/generation integrity is relevant.
4. Choose focused checks based on the change: formatter, lint, typecheck, targeted unit/integration tests, Prisma validation, RLS tests, webhook tests, browser tests, or build.
5. Escalate to broad suites only when repository policy, change breadth, or failure diagnosis requires them.
6. Never report an unrun check as passing.
7. Report exact commands, outcomes, failures, and residual uncertainty using `references/evidence-rules.md`.

Bundled deterministic scripts live under this skill's `scripts/` and are mirrored from the plugin-level validators.
