# Pattern 008: Layer Contract

**Purpose/context.** Turn architectural folders into reliable boundaries by specifying input trust, output guarantee, side-effect budget, errors, dependencies, and prohibited leakage.

**Responsibilities.** Name owner, callers/callees, allowed knowledge/imports, data entering/leaving, validation/authz/tenant/transaction/cache rules, failure semantics, conformance, and additive/breaking evolution.

**Non-responsibilities.** A contract does not implement behavior, replace explanatory architecture, or enforce itself.

**Contract.** Object parameters are default for nontrivial boundaries. Outputs use deliberate null/list/error cardinality and serialization. Side-effect classes are `pure`, `read`, `database-write`, `provider-write`, `framework-effect`, or `secondary-effect`.

**Security/tenant.** Persistence/provider objects and secrets cannot cross upward. Authorized scopes cannot originate from clients. Every layer declares tenant requirements and forbidden authority.

**Transaction/cache.** Contract states whether a transaction client is required and whether network work is forbidden. Cache ownership/freshness/invalidation is explicit.

**Naming/placement.** Human owner is `docs/12-layer-contracts.md`; deterministic subset is `.agents/contracts/architecture.yaml`.

**Lifecycle/tests.** define → encode → implement → static/runtime/integration proof → version/migrate. Tests cover imports, directives, types, serialization, cross-tenant behavior, and public-contract evolution.

**Anti-patterns/adjacent.** YAML costume, folder-only architecture, ambiguous outputs, hidden effects. Adjacent: governance, validation, every implementation pattern.
