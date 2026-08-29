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
