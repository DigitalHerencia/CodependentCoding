# Chapter 03: Architecture Contract

**The Book of Implementation™**

## Canonical machine contract

```yaml
version: 1
architecture: loaded-vibes
entry:
  page: feature
presentation:
  order: [primitives, blocks, features, pages]
reads:
  public_boundary: fetcher
  data_primitives: [select, mapper, scoped-transaction-client]
writes:
  public_boundary: server-action
  coordinator: workflow
  atomic_boundary: transaction-helper
  persistence: [transaction-helper, owner-local-db-helper]
security:
  identity: auth
  authorization: authz-policy
  tenant_containment: postgres-rls
providers:
  boundary: integration-adapter
  reconciliation: webhook-processor
forbidden:
  - page-to-fetcher-shortcut
  - page-to-action-shortcut
  - component-protected-io
  - prisma-outside-approved-data-boundaries
  - provider-sdk-outside-integrations
```

## Conformance

- Static import rules should enforce deterministic dependency rules. Runtime tests prove behavior static tooling cannot prove. Semantic review decides whether code nominally placed in the right folder actually owns the right responsibility.
