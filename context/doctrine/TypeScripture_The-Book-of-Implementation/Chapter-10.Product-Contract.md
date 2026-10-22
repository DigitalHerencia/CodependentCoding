# Chapter 10: Product Contract

**The Book of Implementation™**

## Canonical machine contract

```yaml
product:
  class: multi-tenant-b2b-saas
  tenant: Organization
  participation: Membership
state_owners:
  authentication: Clerk
  application: PostgreSQL
  payment_provider: Stripe
required:
  - server-first-presentation
  - capability-based-authorization
  - tenant-containment
  - typed-runtime-boundaries
  - recoverable-provider-operations
prohibited:
  - client-authoritative-role
  - client-authoritative-price
  - provider-object-as-domain-model
```

## Usage

- Product contracts are compact deterministic constraints. Human product requirements and feature specifications remain the explanatory owners.
