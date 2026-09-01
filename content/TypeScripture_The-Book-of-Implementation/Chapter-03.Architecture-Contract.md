# Chapter 03: Architecture Contract

**The Book of Implementation™**

The human-readable TypeScripture chapters are the authority. The YAML and JSON below are machine-readable translations of the same intent; they do not invent a second architecture.

## Canonical machine contract — YAML

```yaml
version: 4
architecture: codependent-coding
post_generation_operations: loaded-vibes
operations_root: lib
semantic_authority:
  single_owner_per_concept: true
  derivatives: derive-or-translate-exhaustively
  independently_retyped_closed_vocabularies: forbidden
  exception_rule: documented-security-correctness-provider-or-material-performance-constraint
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
    requires: [capability-permission, tenant-scope, resource-policy-when-applicable]
    vocabulary: single-application-owner
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
    dto_excludes: [locale-formatting, display-labels, presentation-risk]
    selects: exact-typed-prisma-projections
    transactions: atomic-local-database-operations
    concurrency: race-sensitive-read-write-decisions-are-serialized-or-conditional
  fetchers:
    owns: reads
    protected: authenticated-and-authorized
    query_shape: purpose-built-projection-or-aggregate
    n_plus_one: avoid
  integrations:
    owns: provider-specific-external-service-code
    pattern: provider-folder-with-client-and-capability-helpers
    webhook_helpers: colocated-with-provider
    exclusions: [clerk, neon, prisma]
  utils:
    owns: generic-reusable-helpers-with-no-better-owner
    barrels: avoid-by-default
    domain_rules: forbidden-when-a-domain-owner-exists
  workflows:
    owns: domain-business-logic-orchestration
    analogy: business-logic-blocks
    composes: [actions, fetchers, integrations, utils, types, schemas, established-helpers]
    duplication: forbidden
    one_to_one_alias: documented-facade-with-real-callers-only
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
  identity: [provider, event-id]
  identity_facts_immutable: [event-type, verified-payload-hash]
  lifecycle: [claim, process, complete-or-fail, stale-recovery, replay]
  route_errors: classified-and-sanitized
security:
  authentication: auth
  authorization: authz
  tenant_containment: postgres-rls
  protected_mutations: authenticated-and-authorized
  protected_reads: authenticated-and-authorized
  tenant_scope_does_not_imply: resource-access
  untrusted_runtime_input: zod-validated-at-trust-boundary
performance:
  prisma_reads: explicit-selects
  aggregate_questions: aggregate-queries
  imports: direct-by-default
  barrel_exports: avoid-by-default
```

## Canonical machine contract — JSON

```json
{
  "version": 4,
  "architecture": "codependent-coding",
  "postGenerationOperations": "loaded-vibes",
  "operationsRoot": "lib",
  "semanticAuthority": {
    "singleOwnerPerConcept": true,
    "derivatives": "derive-or-translate-exhaustively",
    "independentlyRetypedClosedVocabularies": "forbidden",
    "exceptionRule": "documented-security-correctness-provider-or-material-performance-constraint"
  },
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
      "files": ["permissions.ts", "policies.ts", "resources.ts", "roles.ts"],
      "requires": ["capability-permission", "tenant-scope", "resource-policy-when-applicable"],
      "vocabulary": "single-application-owner"
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
      "dtoExcludes": ["locale-formatting", "display-labels", "presentation-risk"],
      "selects": "exact-typed-prisma-projections",
      "transactions": "atomic-local-database-operations",
      "concurrency": "race-sensitive-read-write-decisions-are-serialized-or-conditional"
    },
    "fetchers": {
      "owns": "reads",
      "protected": "authenticated-and-authorized",
      "queryShape": "purpose-built-projection-or-aggregate",
      "nPlusOne": "avoid"
    },
    "integrations": {
      "owns": "provider-specific-external-service-code",
      "pattern": "provider-folder-with-client-and-capability-helpers",
      "webhookHelpers": "colocated-with-provider",
      "exclusions": ["clerk", "neon", "prisma"]
    },
    "utils": {
      "owns": "generic-reusable-helpers-with-no-better-owner",
      "barrels": "avoid-by-default",
      "domainRules": "forbidden-when-a-domain-owner-exists"
    },
    "workflows": {
      "owns": "domain-business-logic-orchestration",
      "analogy": "business-logic-blocks",
      "composes": ["actions", "fetchers", "integrations", "utils", "types", "schemas", "established-helpers"],
      "duplication": "forbidden",
      "oneToOneAlias": "documented-facade-with-real-callers-only"
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
    "helperOwns": "provider-specific-webhook-mechanics",
    "identity": ["provider", "event-id"],
    "identityFactsImmutable": ["event-type", "verified-payload-hash"],
    "lifecycle": ["claim", "process", "complete-or-fail", "stale-recovery", "replay"],
    "routeErrors": "classified-and-sanitized"
  },
  "security": {
    "authentication": "auth",
    "authorization": "authz",
    "tenantContainment": "postgres-rls",
    "protectedMutations": "authenticated-and-authorized",
    "protectedReads": "authenticated-and-authorized",
    "tenantScopeDoesNotImply": "resource-access",
    "untrustedRuntimeInput": "zod-validated-at-trust-boundary"
  },
  "performance": {
    "prismaReads": "explicit-selects",
    "aggregateQuestions": "aggregate-queries",
    "imports": "direct-by-default",
    "barrelExports": "avoid-by-default"
  }
}
```

## Conformance

Static import rules should enforce deterministic boundaries where practical. Runtime tests prove security and persistence properties that static tooling cannot prove. Semantic review decides whether code placed in the right folder actually owns the right responsibility.
