# Governance Model

## Artifact authority

- `README.md` and system definition own identity and scope.
- Doctrine, terminology, architecture, security, layer, and lifecycle documents own durable normative truth.
- `.agents/contracts` encode deterministic subsets; they do not replace explanatory owners.
- Specifications own approved scoped change intent and acceptance.
- ADRs/decision registers own consequential choices and supersession.
- Implementation and tests are evidence.
- `.agents/execution` owns mutable task state only.

## Canonical project documentation

Every product derived from Loaded Vibes™ maintains product requirements, technical requirements, architecture, design, authentication/authorization, data, integrations, validation, operations, and active feature/route specifications. Public boundaries and product-specific vocabulary have one canonical owner.

## Change control

1. Classify the requested change and affected authority.
2. Inspect governing documents, contracts, implementation, migrations, and tests.
3. Resolve contradictions before implementation.
4. Approve a scoped specification with acceptance and evidence.
5. Update canonical context and deterministic contracts when the boundary changes.
6. Implement the smallest correct change on an isolated branch.
7. Run narrow and required complete gates.
8. Review security, architecture, product semantics, migrations, and evidence.
9. Merge, deploy when authorized, verify, observe, and update handoff.

## Pull requests and work items

One work item represents one coherent outcome and links its specification. PRs identify why, behavior, files/contracts/migrations, security and tenant invariants, validation executed/not executed, rollout/rollback, and remaining risk. Reviewers verify semantic correctness rather than style alone. CI invokes repository-owned commands.

## Exceptions and debt

An exception record names rule, scope, owner, rationale, risk, compensating controls, expiry/review trigger, detection, and removal plan. Exceptions cannot authorize secret exposure, false evidence, or silent weakening of tenant/payment invariants. Technical debt is scheduled work with observable impact, not an unlabeled architectural contradiction.

## Drift and deprecation

Validators compare contracts to route trees, imports, schemas, package scripts, capabilities, and lifecycles. Scheduled reviews compare docs, generated templates, and reference applications. Deprecation marks replacement, migration, compatibility window, and removal. Superseded artifacts leave active indexes but remain historically traceable.

## Maintenance cadence

Review after public contract/security/technology changes and before generator releases. Version-sensitive technology guidance lives in generated-product support matrices, not timeless doctrine. Provenance and conformance are regenerated for canonical releases.
