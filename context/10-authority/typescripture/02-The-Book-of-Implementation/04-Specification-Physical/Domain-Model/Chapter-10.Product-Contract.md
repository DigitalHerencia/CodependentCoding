version: 1
status: final
system:
  name: "Codependent Coding™ Knowledge System"
  architecture: "Loaded Vibes™ WebApp Architecture"
  tech_stack: "Hipster Stack™ TechStack"
  hierarchy:
    - knowledge-system-defines-governs-validates-architecture
    - architecture-organizes-constrains-structures-tech-stack
    - tech-stack-implements-executes-operates-application
product_class: multi-tenant-b2b-saas
tenant:
  abstraction: Tenant
  reference_noun: Organization
  access_entities: [User, Membership]
  rename_requires_coherent_reset: true
truth_owners:
  authentication: Clerk
  application_state: PostgreSQL
  provider_payment_state: Stripe
  product_transition: application-workflow
required_properties:
  - server-owned-business-truth
  - self-securing-protected-reads
  - workflow-owned-mutations
  - capability-and-resource-authorization
  - rls-tenant-containment
  - provider-idempotency-and-reconciliation
  - stable-transport-dtos
  - executable-validation
prohibited_assumptions:
  - client-identity-is-authoritative
  - client-tenant-is-authoritative
  - clerk-metadata-is-product-role-truth
  - checkout-redirect-grants-entitlement
  - webhook-delivery-is-exactly-once
  - provider-model-is-domain-model
  - project-is-hidden-tenant
optional_modules:
  - stripe-subscription-billing
  - stripe-connect
  - persistent-application-cache
