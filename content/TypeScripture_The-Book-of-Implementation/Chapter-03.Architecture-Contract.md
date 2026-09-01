# Chapter 03: Architecture Contract

**The Book of Implementation™**

The human-readable Markdown is the authority. The YAML and JSON below are machine-readable translations of the same intent; they do not invent a second architecture.

## Canonical machine contract — YAML

```yaml
version: 2
architecture: loaded-vibes
operations_root: lib
operations:
  actions:
    owns: mutations
    naming: <domain>Actions.ts
    may_use: [schemas, auth, authz, db-selects, db-dto, db-transactions, cache]
  auth:
    owns: authentication-and-identity
    provider: clerk
    files: [auth.ts, clerk.ts, redirects.ts]
  authz:
    owns: authorization-rbac
    files: [permissions.ts, policies.ts, resources.ts, roles.ts]
  cache:
    owns: next-cache-policy
    files: [invalidate.ts, life.ts, tags.ts]
  constants:
    owns: cross-cutting-stable-values
  db:
    owns: persistence-infrastructure
    children: [dto, selects, transactions]
    root_files: [client.ts, provider.ts, tenant.ts]
  fetchers:
    owns: reads
    naming: <domain>Fetchers.ts
  integrations:
    owns: provider-specific-external-service-code
    pattern: provider/client.ts-plus-capability-helpers
    exclusions: [clerk, neon, prisma]
  utils:
    owns: generic-reusable-helpers
    barrels: avoid-by-default
  workflows:
    owns: domain-business-logic-orchestration
    naming: <domain>Workflows.ts
    composes: [actions, fetchers, integrations, utils, types, schemas]
root_contracts:
  schemas: domain-organized-zod-runtime-validation
  types: domain-organized-types-and-interfaces
  prisma: schema-migrations-seed-and-rls
  generated_prisma: generated-output-do-not-hand-edit
security:
  authentication: auth
  authorization: authz
  tenant_containment: postgres-rls
  protected_mutations: authenticated-and-authorized
  protected_reads: authenticated-and-authorized
```

## Canonical machine contract — JSON

```json
{
  "version": 2,
  "architecture": "loaded-vibes",
  "operationsRoot": "lib",
  "operations": {
    "actions": { "owns": "mutations", "naming": "<domain>Actions.ts" },
    "auth": { "owns": "authentication-and-identity", "provider": "clerk" },
    "authz": { "owns": "authorization-rbac" },
    "cache": { "owns": "next-cache-policy" },
    "constants": { "owns": "cross-cutting-stable-values" },
    "db": { "owns": "persistence-infrastructure", "children": ["dto", "selects", "transactions"] },
    "fetchers": { "owns": "reads", "naming": "<domain>Fetchers.ts" },
    "integrations": { "owns": "provider-specific-external-service-code", "pattern": "provider/client.ts-plus-capability-helpers" },
    "utils": { "owns": "generic-reusable-helpers", "barrels": "avoid-by-default" },
    "workflows": { "owns": "domain-business-logic-orchestration", "naming": "<domain>Workflows.ts" }
  },
  "rootContracts": {
    "schemas": "domain-organized-zod-runtime-validation",
    "types": "domain-organized-types-and-interfaces",
    "prisma": "schema-migrations-seed-and-rls",
    "generatedPrisma": "generated-output-do-not-hand-edit"
  },
  "security": {
    "authentication": "auth",
    "authorization": "authz",
    "tenantContainment": "postgres-rls"
  }
}
```

## Conformance

Static import rules should enforce deterministic boundaries where practical. Runtime tests prove security and persistence properties that static tooling cannot prove. Semantic review decides whether code placed in the right folder actually owns the right responsibility.
