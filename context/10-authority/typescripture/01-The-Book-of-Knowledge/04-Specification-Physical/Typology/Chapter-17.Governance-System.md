---
title: Codependent Coding Governance Model
type: contract
scope: domain
project: CodependentCoding
domain: governance
artifact: governance-model
kind: contract
namespace: codependentcoding.docs.governance-model.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.specification-model.contract]]"
  - "[[codependentcoding.docs.validation-conformance.contract]]"
supersedes: []
tags:
  - codependentcoding/governance
  - codependentcoding/contracts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/15-governance-model.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 8222d957632dcd2cf403f2d39cdc2ed57c547c50
source_format: markdown
---
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
---
title: Codependent Coding Specification Model
type: contract
scope: domain
project: CodependentCoding
domain: specification
artifact: specification-model
kind: contract
namespace: codependentcoding.docs.specification-model.contract
status: active
authority: source-of-truth
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.governance-model.contract]]"
supersedes: []
tags:
  - codependentcoding/specification
  - codependentcoding/contracts
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: docs/16-specification-model.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 6ffcce8236e589964fc148e83b3bff95c6827f92
source_format: markdown
---
# Specification Model

## Descriptive versus enforceable

Descriptive documentation explains context, rationale, and current understanding. Normative specifications state required behavior and acceptance. Deterministic contracts encode mechanically comparable constraints. Tests/validators provide evidence. None is a substitute for the others.

## Required specification families

| Specification | Required content |
|---|---|
| Product requirements | problem, users, outcomes, scope/non-goals, product invariants, success measures |
| Technical requirements | quality attributes, constraints, environments, dependencies, operability |
| Architecture | context, topology, layers, dependencies, trust/state ownership, decisions |
| Feature | flows, roles, states, inputs/outputs, failures, acceptance, affected contracts |
| Route | path/surface, params/search, auth, feature entrypoint, metadata, loading/error/not-found |
| Data | entities, relationships, tenant keys, constraints, lifecycle, migration/backfill/rollback |
| Security | threats, trust boundaries, authn/authz, RLS, secrets, abuse cases, security tests |
| Integration | provider ownership, adapter contract, IDs/scope, idempotency, webhooks, recovery |
| Test | risk-to-test mapping, fixtures, environment, assertions, evidence, exclusions |
| Operations | configuration, deploy order, telemetry, alerts, runbooks, recovery, rollback |

## Canonical feature-spec shape

Every consequential feature specification includes: problem; goals; non-goals; terminology; actors/capabilities; user flows; routes and UI states; inputs/outputs; domain entities and lifecycle transitions; authorization and tenant scope; integration/provider behavior; failure/recovery/idempotency; accessibility/responsive requirements; observability; migrations; acceptance criteria; test plan; rollout/rollback; affected canonical docs/contracts; and explicit exclusions.

Acceptance criteria are observable, unambiguous, and paired with evidence. Implementation detail is specified only when it protects an architectural, security, compatibility, or operational property.

## Relationship

Product requirements justify technical requirements. Architecture constrains specifications. Feature/route/data/security/integration specs partition one change without conflicting ownership. Machine contracts mirror stable enforceable subsets. Execution records reference approved specs and cannot add requirements. Discoveries either remain implementation detail or are promoted through a governed decision.
---
title: Codependent Coding Pattern 010 Governance System
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: governance-system
kind: reference
namespace: codependentcoding.patterns.governance-system.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.docs.governance-model.contract]]"
  - "[[codependentcoding.docs.validation-conformance.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/governance
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/10-governance-system.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 746d9944176e514cc14cfcff0475c995eec0103c
source_format: markdown
---
# Pattern 010: Governance System

**Purpose/context.** Preserve durable intent, deterministic constraints, scoped change, mutable execution state, decisions, and proof across humans, agents, branches, and time.

**Responsibilities.** Separate canonical Markdown, machine YAML contracts, scoped specs, execution JSON, decisions, validators, CI, archives, and source precedence. Detect drift and promote durable discoveries.

**Non-responsibilities.** Governance does not contain secrets, runtime product behavior, unapproved product invention, or temporary notes masquerading as architecture.

**Contract.** Humans approve context/specs/decisions. Agents read and mutate within scope. Validators consume contracts. Execution references real specs/files/commands and cannot override canon.

**Failure/security.** Conflicts are classified and resolved/escalated; validation failures block completion; evidence distinguishes inspected/implemented/executed/skipped. Secrets and raw payload patterns are rejected.

**Transaction/cache/tenant.** Not a runtime data transaction pattern. Governance explicitly owns tenant/security rules but stores no tenant production data. Generated indexes may cache discovery only and are reproducible.

**Naming/placement.** `AGENTS.md`, canonical `docs/`, `.agents/contracts/*.yaml`, `.agents/execution/*.json`, `provenance/`, `scripts/`.

**Lifecycle/tests.** context → contract → spec → execution → validation → decision/handoff → promotion/archive. Validate presence, syntax, cross-references, implementation conformance, runtime properties, secret absence.

**Anti-patterns/adjacent.** duplicate sources of truth, execution JSON redefining architecture, CI duplicating script lists, archived docs in active indexes. Adjacent: layer contract, lifecycle, validation, agent execution.
---
title: Codependent Coding GitHub Issue Template Configuration
type: reference
scope: domain
project: CodependentCoding
domain: github
artifact: issue-template-config
kind: reference
namespace: codependentcoding.github.issue-template.config.reference
status: active
authority: reference
parent: "[[codependentcoding.manifest.map]]"
depends_on: []
supersedes: []
tags:
  - codependentcoding/github
  - codependentcoding/templates
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: .github/ISSUE_TEMPLATE/config.yml
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 3ba13e0cec6cbbfd462e9ebf529dd2093148cd69
source_format: yaml
---
# GitHub Issue Template Configuration

The original source payload is preserved verbatim below.

```yaml
blank_issues_enabled: false
```
---
title: Codependent Coding Knowledge-System Defect Template
type: template
scope: domain
project: CodependentCoding
domain: github
artifact: defect-issue-template
kind: template
namespace: codependentcoding.github.issue-template.defect.template
status: active
authority: reference
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.validation-conformance.contract]]"
  - "[[codependentcoding.docs.governance-model.contract]]"
supersedes: []
tags:
  - codependentcoding/github
  - codependentcoding/templates
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: .github/ISSUE_TEMPLATE/defect.yml
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: f98c6404473a6124167b10d658836a55d33a1c3c
source_format: yaml
---
# Knowledge-System Defect Issue Template

The original source payload is preserved verbatim below.

```yaml
name: Knowledge-system defect
about: Report a conformance, provenance, architecture, governance, or verification defect
title: "[DEF-] "
labels:
  - bug
body:
  - type: markdown
    attributes:
      value: |
        Use this form for defects in the Codependent Coding™ Knowledge System. Do not mark work complete without executed validation evidence.
  - type: input
    id: defect_id
    attributes:
      label: Defect / finding ID
      description: Use the authoritative audit or finding identifier when one exists.
      placeholder: DEF-HIGH-001
    validations:
      required: true
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Critical
        - High
        - Medium
        - Low
    validations:
      required: true
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: State the defect and why it matters.
    validations:
      required: true
  - type: textarea
    id: evidence
    attributes:
      label: Evidence
      description: Cite current repository paths, commit SHAs, commands, outputs, or source evidence.
    validations:
      required: true
  - type: textarea
    id: affected_artifacts
    attributes:
      label: Affected artifacts
      description: List canonical documents, contracts, scripts, reports, or repository areas.
    validations:
      required: true
  - type: input
    id: requirement_ids
    attributes:
      label: Requirement IDs
      description: Exact traceability IDs when known. Leave blank rather than inventing identifiers.
      placeholder: VAL-011, RPT-007
  - type: textarea
    id: remediation
    attributes:
      label: Required remediation
      description: Describe the required outcome, not an implementation shortcut.
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      description: Provide objective, testable criteria using a task list where useful.
      placeholder: |
        - [ ] Criterion one
        - [ ] Criterion two
    validations:
      required: true
  - type: textarea
    id: validation
    attributes:
      label: Validation procedure and evidence
      description: State the commands/reviews that must run, the expected evidence, and what the evidence proves.
    validations:
      required: true
  - type: textarea
    id: dependencies
    attributes:
      label: Dependencies / blockers
      description: Use GitHub issue links or numbers when known. State None when there are no blockers.
    validations:
      required: true
```
---
title: Codependent Coding Pull Request Template
type: template
scope: domain
project: CodependentCoding
domain: github
artifact: pull-request-template
kind: template
namespace: codependentcoding.github.pull-request.template
status: active
authority: reference
parent: "[[codependentcoding.manifest.map]]"
depends_on:
  - "[[codependentcoding.docs.governance-model.contract]]"
  - "[[codependentcoding.docs.validation-conformance.contract]]"
supersedes: []
tags:
  - codependentcoding/github
  - codependentcoding/templates
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: .github/pull_request_template.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 54c7d182a08c798fbc7ad4e8d841cc60edbcbf12
source_format: markdown
---
# Pull Request Template

## Linked issues

Use GitHub closing keywords only for issues this PR actually resolves.

- Closes/Fixes/Resolves:
- Related:

## Defect IDs addressed

List the authoritative defect/finding IDs addressed by this change.

## Remediation summary

Describe the bounded outcome implemented by this PR and why it satisfies the linked acceptance criteria.

## Affected canonical artifacts

List changed canonical Markdown, provenance, manifests, reports, or other durable repository artifacts.

## Affected contracts

List changed `.agents/contracts/*` files, public boundaries, schemas, or machine-readable contracts. Write `None` when not applicable.

## Provenance / source changes

Describe newly processed sources, changed dispositions, conflict resolutions, or provenance updates. Write `None` when not applicable.

## Validation executed

Record only commands or reviews that actually ran.

| Command / review | Environment | Result | Scope / limitations |
|---|---|---|---|
|  |  |  |  |

## Requirement / conformance delta

List affected requirement IDs and the evidence for any PASS/FAIL/BLOCKED status change. Do not manufacture audit counts.

## Remaining blockers

List unresolved blockers or write `None`.

## Security / invariant impact

Describe impact on authentication, authorization, tenant isolation/RLS, provider state, secrets, idempotency, transactions, lifecycle invariants, or write `None`.

## Completion checklist

- [ ] Linked issues and defect IDs are accurate.
- [ ] Change is limited to the approved remediation scope.
- [ ] Canonical docs and deterministic contracts are synchronized where affected.
- [ ] Provenance/source dispositions are updated where affected.
- [ ] Required validation was actually executed and results are recorded above.
- [ ] Failed, skipped, blocked, and inferred evidence is distinguished from passed execution.
- [ ] Validation/security checks were not weakened merely to obtain a passing result.
- [ ] No secrets, raw provider payloads, or privileged credentials were added.
- [ ] Remaining blockers and risks are explicit.
- [ ] GitHub closing keywords are used only for defects objectively resolved by this PR.
