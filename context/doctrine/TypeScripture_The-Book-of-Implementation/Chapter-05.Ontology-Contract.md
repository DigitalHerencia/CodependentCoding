# Chapter 05: Ontology Contract

**The Book of Implementation™**

## Canonical contract shape

```yaml
entities:
  User: { identity: local }
  Organization: { kind: reference-tenant }
  Membership: { relates: [User, Organization], status: [active, suspended, revoked] }
  Role: { aggregates: Capability }
  Actor: { source: server-authentication }
  Workflow: { owns: use-case-sequence }
  ProviderMirror: { authority: bounded-local-mirror }
relationships:
  - User 0..* Membership
  - Organization 0..* Membership
  - Membership 1 Role
  - Role 1..* Capability
constraints:
  - tenant-authority-requires-active-membership
  - provider-identifiers-are-not-client-authority
  - persistence-models-do-not-cross-presentation-boundary
```

## Implementation rule

- Machine ontology is a deterministic subset of the human model. Prisma schema may realize entities but does not redefine the ontology merely because a table or field exists.
