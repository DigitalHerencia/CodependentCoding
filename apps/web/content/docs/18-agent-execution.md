# Agent-Execution Model

## Authority

Humans own product intent, approval, legal/financial discretion, risk acceptance, production authority, and changes to canonical doctrine. Agents may inspect, propose, implement, test, document, and prepare reviewable repository changes within granted scope.

Execution notes are operational evidence, not durable architectural truth. They may report what happened, what remains, what is blocked, and what was inferred. They may not override canonical documents, accepted decisions, or actual runtime evidence.

## Operating loop

1. Read `AGENTS.md`, the active specification, canonical architecture/security/lifecycle material, root configuration, schemas/migrations, tests, and affected files.
2. Identify contradictions and exact governing evidence before mutation.
3. Define the narrow outcome, files/interfaces/migrations/tests, and validation.
4. Implement the smallest contract-compliant change.
5. Run narrow checks, correct root causes, then run the complete affected application gate.
6. Update durable docs/contracts for public-boundary changes.
7. Report what was executed, skipped, blocked, or inferred.
8. Deliver through a reviewable PR when repository policy requires one.

## Evidence vocabulary

- `executed`: a command or review actually ran; record its result and revision.
- `skipped`: a known check was deliberately not run.
- `blocked`: a required check could not execute because a prerequisite was unresolved.
- `inferred`: a conclusion came from inspection/reasoning rather than execution.

Only `executed` evidence can claim a pass or failure.

## Decisions

`provenance/synthesis-decisions.md` owns durable consequential synthesis decisions. Temporary implementation choices should not silently become architecture. Promote a consequential choice into the durable register when it changes the canonical system.

## Machine-readable roles

- `.agents/contracts/product.yaml`: product class, nouns, state owners, required/prohibited properties.
- `.agents/contracts/architecture.yaml`: layers, imports, trust, tenant, provider, and lifecycle invariants.
- `.agents/contracts/ontology.yaml`: machine-readable domain entities and relationships.
- `.agents/contracts/validation.yaml`: validation philosophy and generated-application gate expectations.
- `.agents/contracts/execution.yaml`: compact agent operating principles.

## Escalation

Escalate conflicting equal authority, missing product behavior that changes user outcomes, new privileged roles/routes/provider money movement, weakened tenant/auth/RLS/idempotency, destructive production action, secrets/credentials, legal/compliance choices, or irreversible migration risk. Routine implementation details consistent with doctrine do not require escalation.

## Completion criteria

Scope implemented; public contracts synchronized; security and tenant invariants preserved; affected application validation actually executed or explicitly identified as skipped/blocked; no known critical contradiction; remaining risks stated plainly.
