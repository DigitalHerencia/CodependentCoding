---
title: Codependent Coding Agent-Execution Model
type: execution
scope: domain
project: CodependentCoding
domain: agent-execution
artifact: execution-model
kind: execution
namespace: codependentcoding.docs.agent-execution.execution
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.agents.execution]]"
  - "[[codependentcoding.agents.contracts.execution.contract]]"
supersedes: []
tags:
  - codependentcoding/agents
  - codependentcoding/execution
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/18-agent-execution.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 99a015394137d84fd46608f28574d1b395a50973
source_format: markdown
---
# Agent-Execution Model

## Authority

Humans own product intent, approval, legal/financial discretion, risk acceptance, production authority, and changes to canonical doctrine. Agents may inspect, propose, implement, test, document, and prepare reviewable repository changes within granted scope.

Execution notes are operational evidence, not durable architectural truth. They may report what happened, what remains, what is blocked, and what was inferred. They may not override canonical documents, accepted decisions, or actual runtime evidence.

## Operating loop

1. Read [[codependentcoding.agents.execution|AGENTS]], the active specification, canonical architecture/security/lifecycle material, root configuration, schemas/migrations, tests, and affected files.
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

[[codependentcoding.provenance.synthesis-decisions.reference]] owns durable consequential synthesis decisions. Temporary implementation choices should not silently become architecture. Promote a consequential choice into the durable register when it changes the canonical system.

## Machine-readable roles

- [[codependentcoding.agents.contracts.product.contract]]: product class, nouns, state owners, required/prohibited properties.
- [[codependentcoding.agents.contracts.architecture.contract]]: layers, imports, trust, tenant, provider, and lifecycle invariants.
- [[codependentcoding.agents.contracts.ontology.contract]]: machine-readable domain entities and relationships.
- [[codependentcoding.agents.contracts.validation.contract]]: validation philosophy and generated-application gate expectations.
- [[codependentcoding.agents.contracts.execution.contract]]: compact agent operating principles.

## Escalation

Escalate conflicting equal authority, missing product behavior that changes user outcomes, new privileged roles/routes/provider money movement, weakened tenant/auth/RLS/idempotency, destructive production action, secrets/credentials, legal/compliance choices, or irreversible migration risk. Routine implementation details consistent with doctrine do not require escalation.

## Completion criteria

Scope implemented; public contracts synchronized; security and tenant invariants preserved; affected application validation actually executed or explicitly identified as skipped/blocked; no known critical contradiction; remaining risks stated plainly.
---
title: Codependent Coding Execution Contract
type: contract
scope: domain
project: CodependentCoding
domain: agent-execution
artifact: machine-contract
kind: contract
namespace: codependentcoding.agents.contracts.execution.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.agent-execution.execution]]"
supersedes: []
tags:
  - codependentcoding/contracts
  - codependentcoding/execution
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: .agents/contracts/execution.yaml
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: d5236ce1fe38de3d6e8371f111a2184a915dd5f4
source_format: yaml
---
# Execution Machine Contract

The original machine-readable payload is preserved verbatim below.

```yaml
version: 1
status: final
owner: docs/18-agent-execution.md
scope: agent-execution-principles

principles:
  execution_state_is_operational_not_canonical: true
  completion_requires-truthful-evidence: true
  confidence-cannot-substitute-for-execution: true
  known-blockers-must-remain-visible: true
  smallest-correct-change: true

workflow:
  - read-governing-context
  - identify-contradictions-and-scope
  - define-files-interfaces-migrations-and-tests
  - implement-smallest-correct-change
  - run-affected-application-gates
  - update-docs-and-contracts-for-public-boundary-changes
  - report-executed-skipped-blocked-and-inferred-work-truthfully

escalate_when:
  - human-product-decision-required
  - authority-or-security-boundary-would-change
  - destructive-production-action-required
  - secret-disclosure-required
  - financial-or-legal-discretion-required
```
