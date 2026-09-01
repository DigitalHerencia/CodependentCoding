# Chapter 03: Architecture Contract

**The Book of Implementation™**

The human-readable TypeScripture chapters are the authority. The YAML and JSON below are machine-readable translations of the same intent; they do not invent a second architecture.

## Canonical machine contract — YAML

```yaml
version: 3
architecture: loaded-vibes
operations_root: lib
organization:
  domain_files: shallow
  naming:
    actions: <domain>Actions.ts
    fetchers: <domain>Fetchers.ts
    workflows: <domain>Workflows.ts
    types: <domain>Types.ts
    schemas: <domain>Schemas.ts
operations:
  actions:
    owns: mutations
    may_read_for: [authorization, invariants, mutation-decisions, result-shaping]
    protected: authenticated-and-authorized
  auth:
    owns: authentication-and-identity
    provider: clerk
    files: [auth.ts, clerk.ts, redirects.ts]
    webhook_helper: permitted-when-identity-specific
  authz:
    owns: authorization-rbac
    files: [permissions.ts, policies.ts, resources.ts, roles.ts]
  cache:
    owns: next-cache-policy
    files: [invalidate.ts, life.ts, tags.ts]
  constants:
    owns: cross-cutting-stable-values
    placement: case-by-case-when-no-better-owner
    disputed_name: routes.ts
  db:
    owns: persistence-infrastructure
    children: [dto, selects, transactions]
    root_files: [client.ts, provider.ts, tenant.ts]
    client: prisma-client-with-neon-adapter
    provider: trusted-provider-or-organization-transaction-context
    tenant: authenticated-local-user-membership-and-rls-context
    dto: persistence-record-to-application-dto
    selects: exact-typed-prisma-projections
    transactions: atomic-local-database-operations
  fetchers:
    owns: reads
    protected: authenticated-and-authorized
  integrations:
    owns: provider-specific-external-service-code
    pattern: provider-folder-with-client-and-capability-helpers
    webhook_helpers: colocated-with-provider
    exclusions: [clerk, neon, prisma]
  utils:
    owns: generic-reusable-helpers-with-no-better-owner
    barrels: avoid-by-default
  workflows:
    owns: domain-business-logic-orchestration
    analogy: business-logic-blocks
    composes: [actions, fetchers, integrations, utils, types, schemas, established-helpers]
    duplication: forbidden
root_contracts:
  schemas:
    owns: domain-organized-zod-runtime-validation
    runtime: true
  types:
    owns: domain-organized-types-and-interfaces
    runtime_behavior: false
  prisma:
    owns: [schema, migrations, seed, grants, rls]
  generated_prisma:
    owns: generated-output
    hand_edit: forbidden
  proxy_ts:
    owns: clerk-next-request-protection
  prisma_config_ts:
    owns: prisma-tooling-configuration
webhooks:
  route: app/api/<provider>/.../route.ts
  provider_helper: lib/integrations/<provider>/webhooks.ts
  route_owns: http-request-response-boundary
  helper_owns: provider-specific-webhook-mechanics
security:
  authentication: auth
  authorization: authz
  tenant_containment: postgres-rls
  protected_mutations: authenticated-and-authorized
  protected_reads: authenticated-and-authorized
  untrusted_runtime_input: zod-validated-at-trust-boundary
performance:
  prisma_reads: explicit-selects
  imports: direct-by-default
  barrel_exports: avoid-by-default
```

## Canonical machine contract — JSON

```json
{
  "version": 3,
  "architecture": "loaded-vibes",
  "operationsRoot": "lib",
  "organization": {
    "domainFiles": "shallow",
    "naming": {
      "actions": "<domain>Actions.ts",
      "fetchers": "<domain>Fetchers.ts",
      "workflows": "<domain>Workflows.ts",
      "types": "<domain>Types.ts",
      "schemas": "<domain>Schemas.ts"
    }
  },
  "operations": {
    "actions": {
      "owns": "mutations",
      "mayReadFor": ["authorization", "invariants", "mutation-decisions", "result-shaping"],
      "protected": "authenticated-and-authorized"
    },
    "auth": {
      "owns": "authentication-and-identity",
      "provider": "clerk",
      "files": ["auth.ts", "clerk.ts", "redirects.ts"],
      "webhookHelper": "permitted-when-identity-specific"
    },
    "authz": {
      "owns": "authorization-rbac",
      "files": ["permissions.ts", "policies.ts", "resources.ts", "roles.ts"]
    },
    "cache": {
      "owns": "next-cache-policy",
      "files": ["invalidate.ts", "life.ts", "tags.ts"]
    },
    "constants": {
      "owns": "cross-cutting-stable-values",
      "placement": "case-by-case-when-no-better-owner",
      "disputedName": "routes.ts"
    },
    "db": {
      "owns": "persistence-infrastructure",
      "children": ["dto", "selects", "transactions"],
      "rootFiles": ["client.ts", "provider.ts", "tenant.ts"],
      "client": "prisma-client-with-neon-adapter",
      "provider": "trusted-provider-or-organization-transaction-context",
      "tenant": "authenticated-local-user-membership-and-rls-context",
      "dto": "persistence-record-to-application-dto",
      "selects": "exact-typed-prisma-projections",
      "transactions": "atomic-local-database-operations"
    },
    "fetchers": {
      "owns": "reads",
      "protected": "authenticated-and-authorized"
    },
    "integrations": {
      "owns": "provider-specific-external-service-code",
      "pattern": "provider-folder-with-client-and-capability-helpers",
      "webhookHelpers": "colocated-with-provider",
      "exclusions": ["clerk", "neon", "prisma"]
    },
    "utils": {
      "owns": "generic-reusable-helpers-with-no-better-owner",
      "barrels": "avoid-by-default"
    },
    "workflows": {
      "owns": "domain-business-logic-orchestration",
      "analogy": "business-logic-blocks",
      "composes": ["actions", "fetchers", "integrations", "utils", "types", "schemas", "established-helpers"],
      "duplication": "forbidden"
    }
  },
  "rootContracts": {
    "schemas": { "owns": "domain-organized-zod-runtime-validation", "runtime": true },
    "types": { "owns": "domain-organized-types-and-interfaces", "runtimeBehavior": false },
    "prisma": { "owns": ["schema", "migrations", "seed", "grants", "rls"] },
    "generatedPrisma": { "owns": "generated-output", "handEdit": "forbidden" },
    "proxyTs": { "owns": "clerk-next-request-protection" },
    "prismaConfigTs": { "owns": "prisma-tooling-configuration" }
  },
  "webhooks": {
    "route": "app/api/<provider>/.../route.ts",
    "providerHelper": "lib/integrations/<provider>/webhooks.ts",
    "routeOwns": "http-request-response-boundary",
    "helperOwns": "provider-specific-webhook-mechanics"
  },
  "security": {
    "authentication": "auth",
    "authorization": "authz",
    "tenantContainment": "postgres-rls",
    "protectedMutations": "authenticated-and-authorized",
    "protectedReads": "authenticated-and-authorized",
    "untrustedRuntimeInput": "zod-validated-at-trust-boundary"
  },
  "performance": {
    "prismaReads": "explicit-selects",
    "imports": "direct-by-default",
    "barrelExports": "avoid-by-default"
  }
}
```

## Conformance

Static import rules should enforce deterministic boundaries where practical. Runtime tests prove security and persistence properties that static tooling cannot prove. Semantic review decides whether code placed in the right folder actually owns the right responsibility.
