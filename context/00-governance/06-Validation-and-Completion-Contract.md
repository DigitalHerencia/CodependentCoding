# Validation and Completion Contract

## Principle

Use minimum sufficient evidence. Validation proves only what actually executes. Do not create extra assurance machinery merely to prove another validator ran.

## Per-segment gate

For every segment:

1. inspect the actual changed ownership surface;
2. run formatting/lint/type checks that cover the changed files when configured;
3. run the narrowest relevant unit/integration/contract tests;
4. run the affected app/package build when the change can break bundling/framework integration;
5. perform one direct behavioral check for the user-visible or generator behavior changed;
6. record executed/skipped/blocked/inferred evidence.

Do not turn every UI segment into a repository-wide release exercise.

## Security/consequence escalation

Broader evidence is required for changes affecting:

- auth/authz;
- tenant isolation/RLS;
- provider/payment state;
- data migrations or destructive transforms;
- webhook/reconciliation semantics;
- generator ownership/pruning that could produce corrupt Arrangements;
- public machine contracts.

## Final repository gate

At the end, discover the **actual final scripts** and run the complete coherent gate. The supplied workspace currently defines a root `validate` chain containing formatting, lint, typecheck, tests, generated tests, package build, and web build, but the exact final command may change during consolidation. Do not blindly preserve an obsolete command; preserve equivalent coverage.

## Representative end-to-end proof

Final completion requires evidence for this chain:

```text
select one canonical Ontology
→ apply supported presentation intent
→ resolve dependency-closed Virgule
→ preview the same resolved state in Anthimeria
→ create generation plan
→ materialize from the real Maximal Template
→ run a representative Arrangement validation/build/smoke
→ run Loaded Vibes Arrangement smoke against that output
```

One representative path does not prove every Ontology, so also execute deterministic resolver tests across all nine defaults.

## UI acceptance

Directly verify at desktop and narrow viewport:

- landing;
- Ontology catalog + one detail;
- Simples landing;
- one BusinessLogic detail;
- one PureUI example/detail;
- TypeScripture docs deep link;
- Anthimeria import/export/share/preview round-trip;
- Maximal explorer;
- keyboard focus and link/control reality.

## Completion report vocabulary

Final handoff MUST contain four explicit sections:

- **Executed**
- **Skipped**
- **Blocked**
- **Inferred**

A skipped/blocked required check prevents the corresponding claim, but does not automatically invalidate unrelated completed work.
