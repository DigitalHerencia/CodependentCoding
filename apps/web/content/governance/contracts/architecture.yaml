version: 1
status: final
grammar:
  - routes-adapt
  - features-orchestrate
  - components-render
  - fetchers-read
  - actions-write
  - schemas-validate
  - authorization-decides
  - transactions-preserve-invariants
  - webhooks-reconcile-external-truth
layers:
  app:
    roots: [app]
    may_import: [features, components, lib/fetchers, lib/actions, schemas, types]
    forbidden: [prisma-client, provider-sdk, lib/db, domain-mutation]
  features:
    roots: [features]
    may_import: [components, lib/fetchers, lib/actions, schemas, types]
    forbidden: [prisma-client, provider-sdk, lib/db, clerk-backend-sdk]
  components:
    roots: [components]
    may_import: [components, types]
    forbidden: [lib/db, lib/fetchers, lib/integrations, clerk-backend-sdk]
  fetchers:
    roots: [lib/fetchers]
    side_effect: read
    requires: [server-only, runtime-validation, actor, authorization-scope, tenant-scope, explicit-select, dto]
    forbidden: [database-write, provider-write, next-navigation, next-cache]
  actions:
    roots: [lib/actions]
    side_effect: framework-effect
    requires: [use-server, runtime-validation, actor, one-workflow, typed-result]
    forbidden: [prisma-client, provider-sdk, transaction-implementation]
  workflows:
    roots: [lib/*/workflows]
    side_effect: application-coordination
    may_import: [lib/authz, lib/db, lib/integrations, lib/observability, types]
    forbidden: [app, features, components, next-navigation, next-cache, FormData]
  transactions:
    roots: [lib/db/transactions]
    requires: [Prisma.TransactionClient, trusted-input, tenant-context, atomic-invariant]
    forbidden: [root-prisma-union, network, provider-sdk, clerk, next, email, cache]
  integrations:
    roots: [lib/integrations]
    owns: [provider-client, provider-scope, request-mechanics, response-normalization]
    forbidden: [product-authorization, presentation, domain-transition]
  webhooks:
    roots: [lib/webhooks]
    requires: [verified-event, durable-inbox, atomic-lease, idempotent-reconciliation, token-finalization, recovery]
tenant_database:
  runtime_role:
    pooled: true
    owns_protected_tables: false
    bypass_rls: false
  migration_role:
    direct: true
    owns_schema_and_policies: true
  context:
    transaction_local_only: true
    canonical_helper_only: true
  policies_require: [select, insert, update, delete, using, with-check]
provider_rules:
  network_inside_database_transaction: false
  stable_idempotency_keys: true
  provider_objects_escape_adapter: false
  webhook_processing: at-least-once-idempotent-recoverable
presentation:
  order: [tokens, primitives, shared-components, domain-components, blocks, features, routes]
  server_components_default: true
  client_authority: false
