version: 1
status: final
owner: docs/04-knowledge-modeling.md
scope: codependent-coding-knowledge-system-and-loaded-vibes-architecture

model_rules:
  conceptual_not_persistence_schema: true
  provider_models_do_not_define_domain: true
  tenant_is_architectural_abstraction: true
  organization_is_reference_tenant_noun: true
  project_is_removable_sample_domain: true
  execution_state_cannot_override_canon: true

entities:
  system:
    knowledge-system:
      term: Knowledge System
      definition: Authoritative connected model of concepts, rules, patterns, constraints, procedures, decisions, and evidence.
    webapp-architecture:
      term: WebApp Architecture
      definition: Reusable organization of application responsibilities, boundaries, runtime flows, and implementation patterns.
    tech-stack:
      term: TechStack
      definition: Concrete technologies, providers, libraries, tools, and deployment substrate used to implement an architecture.
    application:
      term: Application
      definition: One deployed product implementation of the architecture.
    product:
      term: Product
      definition: User-facing business system whose requirements specialize the reusable architecture.
    repository:
      term: Repository
      definition: Versioned container of canonical, supporting, operational, and evidentiary artifacts.
    module:
      term: Module
      definition: Cohesive implementation unit with a controlled interface and responsibility.
    domain:
      term: Domain
      definition: Product or engineering problem space containing concepts, rules, and invariants.
    feature:
      term: Feature
      definition: Server-first product-experience orchestration that composes safe reads, actions, and presentation.
    route:
      term: Route
      definition: URL, HTTP, metadata, parameter, redirect, not-found, and framework adaptation boundary.
    component:
      term: Component
      definition: Composable presentation or system part with a bounded rendering responsibility.
    operation:
      term: Operation
      definition: Discrete read, mutation, reconciliation, validation, or delivery activity.
    workflow:
      term: Workflow
      definition: Named application use case coordinating authorization, invariants, persistence, providers, audit, recovery, and outcomes.
    integration:
      term: Integration
      definition: Controlled connection between the application and an external provider or system.
    provider:
      term: Provider
      definition: External system authoritative for a bounded capability or external state.
    contract:
      term: Contract
      definition: Explicit machine- or human-readable boundary of inputs, outputs, guarantees, dependencies, errors, and obligations.
    specification:
      term: Specification
      definition: Scoped implementation intent with acceptance, authorization, lifecycle, data, integration, and validation effects.
    pattern:
      term: Pattern
      definition: Named reusable solution structure for a recurring problem in a defined context.
    constraint:
      term: Constraint
      definition: Rule limiting permitted structure, relationship, state, or behavior.
    validation:
      term: Validation
      definition: Executed check that determines whether an input or artifact satisfies an explicit rule.
    evidence:
      term: Evidence
      definition: Durable record supporting a claim, result, decision, or conformance conclusion.

  identity-tenancy:
    identity:
      term: Identity
      definition: Provider or local representation used to distinguish a user or system principal.
    actor:
      term: Actor
      definition: Trusted server-side representation of the user or system process attempting an operation.
    user:
      term: User
      definition: Local application identity linked to external authentication identity.
    tenant:
      term: Tenant
      definition: Architectural ownership and isolation boundary for customer-scoped application state.
    organization:
      term: Organization
      definition: Reference implementation noun for Tenant.
    membership:
      term: Membership
      definition: Scoped relation joining exactly one User to exactly one Organization with status and role context.
    role:
      term: Role
      definition: Named bundle of stable Capabilities within a membership scope.
    capability:
      term: Capability
      definition: Stable business-operation vocabulary used by authorization decisions.
    permission:
      term: Permission
      definition: Granted capability in a particular authorization model; Capability is preferred code vocabulary.
    resource:
      term: Resource
      definition: Concrete application object against which scoped authorization may be evaluated.
    policy:
      term: Policy
      definition: Decision logic evaluating actor, membership/capability, resource facts, scope, and operation.
    scope:
      term: Scope
      definition: Maximum legal tenant/resource/data boundary within which an operation may act.
    ownership:
      term: Ownership
      definition: Domain relationship identifying the user, tenant, or system responsible for a resource or artifact.

  application-layer:
    route-adapter:
      term: Route Adapter
      definition: Framework entrypoint that validates route/HTTP context and delegates to established application boundaries.
    feature-orchestrator:
      term: Feature Orchestrator
      definition: Product-experience assembler over DTO/page state, fetchers, action references, and components.
    presentation-component:
      term: Presentation Component
      definition: Rendering unit receiving safe typed data or slots without protected persistence/provider authority.
    fetcher:
      term: Fetcher
      definition: Self-securing server-only protected read use case returning bounded serializable DTOs.
    server-action:
      term: Server Action
      definition: Thin Next.js mutation transport adapter that validates input, resolves actor, invokes one workflow, and adapts results/framework effects.
    application-workflow:
      term: Application Workflow
      definition: Authoritative use-case coordinator for one mutation or reconciliation operation.
    transaction-helper:
      term: Transaction Helper
      definition: Atomic database mechanic accepting a transaction client and trusted typed input.
    authorization-policy:
      term: Authorization Policy
      definition: Policy deciding whether an actor may perform an operation against actual scoped facts.
    runtime-schema:
      term: Runtime Schema
      definition: Zod or equivalent runtime contract validating untrusted values at a trust boundary.
    database-select:
      term: Database Select
      definition: Explicit Prisma projection defining the exact persistence fields required by a data operation.
    dto:
      term: DTO
      definition: Stable constrained serializable transport representation exposed across application boundaries.
    dto-mapper:
      term: DTO Mapper
      definition: Pure deterministic translation from selected persistence/provider representation to approved DTO.
    integration-adapter:
      term: Integration Adapter
      definition: Server-only provider mechanics boundary translating provider-neutral application intent to normalized provider results.
    webhook-route:
      term: Webhook Route
      definition: Raw HTTP boundary owning provider signature verification and acknowledgment semantics.
    event-ledger:
      term: Event Ledger
      definition: Durable unique receipt and processing-state record for replayable provider events.
    webhook-processor:
      term: Webhook Processor
      definition: Idempotent lease-aware reconciler of verified provider events into bounded local truth.
    outbox-record:
      term: Outbox Record
      definition: Durable secondary-effect work committed atomically with primary state where eventual delivery is required.
    audit-record:
      term: Audit Record
      definition: Durable record of consequential actor, operation, target, state, and outcome.
    recovery-record:
      term: Recovery Record
      definition: Durable representation of partial cross-system work that can be retried or reconciled without inventing truth.

  commercial-provider:
    customer:
      term: Customer
      definition: Product-domain party receiving or purchasing a tenant-scoped offering; not synonymous with a provider Customer object.
    subscription:
      term: Subscription
      definition: Tenant-owned commercial relationship normalized locally from provider events when subscription billing is enabled.
    plan:
      term: Plan
      definition: Product commercial offering that groups prices and/or entitlements without becoming provider state.
    price:
      term: Price
      definition: Commercial amount/currency configuration mapped to an allowlisted provider price when applicable.
    entitlement:
      term: Entitlement
      definition: Application-owned interpretation of whether a Tenant may use a product capability.
    checkout-session:
      term: Checkout Session
      definition: Provider-hosted transaction/session object used as an operation mechanism, never as entitlement authority.
    billing-portal-session:
      term: Billing Portal Session
      definition: Provider-hosted billing-management session created only for a server-derived tenant/customer context.
    connected-account:
      term: Connected Account
      definition: Provider account relationship used by optional platform-payment flows with explicit connected-account scope.
    payment:
      term: Payment
      definition: Application-normalized record of provider payment truth relevant to product workflows.
    provider-event:
      term: Provider Event
      definition: Signed replayable provider notification that external state may have changed.
    provider-mirror:
      term: Provider Mirror
      definition: Bounded local representation of external identifiers/state retained for reconciliation without replacing domain state.
    reconciliation:
      term: Reconciliation
      definition: Comparison of current provider truth with local normalized state followed by permitted idempotent convergence.

  governance:
    prd:
      term: PRD
      definition: Product requirements artifact defining product intent and user/business outcomes.
    technical-requirement:
      term: Technical Requirement
      definition: Explicit engineering requirement constraining architecture, behavior, quality, or evidence.
    architecture-contract:
      term: Architecture Contract
      definition: Deterministic subset of architecture rules suitable for machine comparison.
    design-contract:
      term: Design Contract
      definition: Durable presentation/design requirements and invariants for a product or reusable asset.
    validation-contract:
      term: Validation Contract
      definition: Deterministic gate, evidence, failure, and completion policy.
    decision:
      term: Decision
      definition: Durable or operational record selecting one consequential outcome among alternatives.
    issue:
      term: Issue
      definition: Repository work item carrying a defect or scoped outcome and its acceptance contract.
    pull-request:
      term: Pull Request
      definition: Reviewable proposed repository change linked to one or more work items.
    acceptance-criterion:
      term: Acceptance Criterion
      definition: Observable condition required for a scoped outcome to be considered complete.
    progress-record:
      term: Progress Record
      definition: Mutable operational record of active/completed/remaining/blocked work and evidence.
    handoff-record:
      term: Handoff Record
      definition: Mutable operational record of current review state, executed/not-executed validation, risks, and next action.
    adr:
      term: ADR
      definition: Durable architectural decision record for a consequential architecture change and its rationale/supersession.
    canonical-pattern:
      term: Canonical Pattern
      definition: Normative pattern whose complete contract defines the default implementation grammar for a recurring concern.

relationships:
  - id: knowledge-system-governs-architecture
    subject: knowledge-system
    predicate: defines-governs-validates
    object: webapp-architecture
    cardinality: one-to-one-reference-architecture
    owner: docs/01-knowledge-system-definition.md
  - id: architecture-structures-stack
    subject: webapp-architecture
    predicate: organizes-constrains
    object: tech-stack
    cardinality: one-to-many-technology-responsibilities
    owner: docs/10-loaded-vibes-architecture.md
  - id: application-implements-architecture
    subject: application
    predicate: implements
    object: webapp-architecture
    cardinality: many-applications-to-one-reference-architecture
    owner: docs/10-loaded-vibes-architecture.md
  - id: repository-contains-artifacts
    subject: repository
    predicate: contains
    object: contract
    cardinality: one-to-many
    owner: MANIFEST.md
  - id: user-membership
    subject: user
    predicate: participates-in
    object: organization
    via: membership
    cardinality: user-zero-or-many-memberships;organization-zero-or-many-memberships;membership-exactly-one-user-and-one-organization
    owner: docs/14-security-model.md
  - id: organization-realizes-tenant
    subject: organization
    predicate: reference-realization-of
    object: tenant
    cardinality: one-reference-noun-per-generated-baseline-unless-adr-reset
    owner: docs/10-loaded-vibes-architecture.md
  - id: membership-role
    subject: membership
    predicate: receives
    object: role
    cardinality: one-or-more-role-assignments-as-product-contract-allows
    owner: docs/14-security-model.md
  - id: role-capability
    subject: role
    predicate: aggregates
    object: capability
    cardinality: one-role-to-zero-or-many-capabilities
    owner: docs/14-security-model.md
  - id: policy-evaluation
    subject: policy
    predicate: evaluates
    object: actor
    context: [capability, resource, scope, operation]
    cardinality: one-decision-per-requested-operation
    owner: docs/12-layer-contracts.md
  - id: route-feature
    subject: route-adapter
    predicate: delegates-presentation-orchestration-to
    object: feature-orchestrator
    cardinality: one-route-entrypoint-to-one-primary-feature-entrypoint
    owner: patterns/07-route-feature-orchestration.md
  - id: feature-presentation
    subject: feature-orchestrator
    predicate: composes
    object: presentation-component
    cardinality: one-to-many
    owner: patterns/07-route-feature-orchestration.md
  - id: feature-fetcher
    subject: feature-orchestrator
    predicate: invokes
    object: fetcher
    cardinality: zero-or-many-bounded-reads
    owner: docs/12-layer-contracts.md
  - id: fetcher-dto
    subject: fetcher
    predicate: returns
    object: dto
    cardinality: one-approved-dto-contract-per-read-result-shape
    owner: patterns/01-fetcher.md
  - id: server-action-workflow
    subject: server-action
    predicate: delegates-to
    object: application-workflow
    cardinality: exactly-one-primary-workflow-per-action
    owner: patterns/02-server-action.md
  - id: workflow-policy
    subject: application-workflow
    predicate: authorizes-through
    object: authorization-policy
    cardinality: one-or-more-as-required-by-resource-and-operation
    owner: patterns/03-application-workflow.md
  - id: workflow-transaction
    subject: application-workflow
    predicate: coordinates
    object: transaction-helper
    cardinality: zero-or-many-short-atomic-units
    owner: patterns/03-application-workflow.md
  - id: workflow-integration
    subject: application-workflow
    predicate: invokes
    object: integration-adapter
    cardinality: zero-or-many-provider-operations-outside-db-transaction
    owner: patterns/03-application-workflow.md
  - id: select-mapper-dto
    subject: database-select
    predicate: supplies-selected-record-to
    object: dto-mapper
    result: dto
    cardinality: one-selected-shape-to-one-or-more-explicit-mappers
    owner: patterns/01-fetcher.md
  - id: adapter-provider
    subject: integration-adapter
    predicate: isolates
    object: provider
    cardinality: one-adapter-family-to-one-provider-semantics
    owner: docs/12-layer-contracts.md
  - id: webhook-route-processor
    subject: webhook-route
    predicate: verifies-and-delegates-to
    object: webhook-processor
    cardinality: one-provider-route-to-one-bounded-processor-entrypoint
    owner: patterns/06-webhook-processor.md
  - id: provider-event-ledger
    subject: provider-event
    predicate: recorded-as
    object: event-ledger
    cardinality: exactly-one-ledger-identity-per-provider-plus-event-id
    owner: patterns/06-webhook-processor.md
  - id: webhook-reconciliation
    subject: webhook-processor
    predicate: performs
    object: reconciliation
    cardinality: zero-or-one-logical-reconciliation-per-claimed-event-attempt
    owner: patterns/06-webhook-processor.md
  - id: workflow-outbox-audit-recovery
    subject: application-workflow
    predicate: may-create
    object: audit-record
    companions: [outbox-record, recovery-record]
    cardinality: zero-or-many-according-to-consequence
    owner: docs/13-system-lifecycles.md
  - id: tenant-subscription
    subject: subscription
    predicate: belongs-to
    object: tenant
    cardinality: many-subscriptions-over-time-to-one-tenant;at-most-one-current-billing-subscription-per-product-contract-when-required
    owner: docs/14-security-model.md
  - id: plan-entitlement
    subject: plan
    predicate: includes
    object: entitlement
    cardinality: one-plan-to-zero-or-many-entitlements
    owner: docs/14-security-model.md
  - id: provider-mirror-provider
    subject: provider-mirror
    predicate: mirrors-bounded-state-from
    object: provider
    cardinality: many-local-mirrors-to-one-provider
    owner: docs/14-security-model.md
  - id: issue-acceptance
    subject: issue
    predicate: defines
    object: acceptance-criterion
    cardinality: one-issue-to-one-or-many-criteria
    owner: docs/15-governance-model.md
  - id: pull-request-issue
    subject: pull-request
    predicate: implements-or-relates-to
    object: issue
    cardinality: one-pr-to-one-primary-issue-by-default;bounded-multi-issue-when-coupled
    owner: docs/15-governance-model.md
  - id: specification-requirement
    subject: specification
    predicate: refines
    object: technical-requirement
    cardinality: one-specification-to-one-or-many-requirements
    owner: docs/16-specification-model.md
  - id: evidence-validation
    subject: evidence
    predicate: records-result-of
    object: validation
    cardinality: one-evidence-record-to-one-executed-check-or-explicit-review
    owner: docs/17-validation-conformance.md

state_models:
  artifact-canonicality:
    owner: docs/01-knowledge-system-definition.md
    values: [canonical, supporting, implementation-evidence, project-specific, legacy, superseded, operational]
    constraints:
      - only-canonical-artifacts-and-accepted-durable-decisions-create-doctrine
      - operational-execution-state-never-overrides-canonical-truth
  actor-kind:
    owner: patterns/05-auth-authz-policy.md
    values: [user, system]
    constraints:
      - user-actors-resolve-from-authenticated-local-users
      - system-actors-have-explicit-narrow-system-identity
  membership-status:
    owner: patterns/05-auth-authz-policy.md
    values: [active, invited, suspended, revoked]
    constraints:
      - protected-member-access-requires-state-allowed-by-product-policy
      - revoked-membership-does-not-authorize-tenant-access
  webhook-processing:
    owner: patterns/06-webhook-processor.md
    values: [received, processing, processed, ignored, failed]
    terminal: [processed, ignored]
    recoverable: [received, failed, processing-with-expired-lease]
    constraints:
      - existing-ledger-row-does-not-prove-processing-completed
      - finalization-requires-current-lock-token
  validation-result:
    owner: docs/17-validation-conformance.md
    values: [passed, failed, skipped, blocked, inferred]
    constraints:
      - inferred-does-not-equal-passed
      - required-failure-blocks-completion

invariants:
  - id: identity-provider-not-product-authorization
    rule: Clerk authentication identity cannot be canonical for membership, role, capability, billing entitlement, or workflow state.
    enforcement: [auth-adapter, application-database, authorization-tests, architecture-review]
  - id: tenant-access-through-membership
    rule: User access to an Organization is established through a Membership rather than a global user role.
    enforcement: [prisma-schema, unique-constraint, authorization-policy, rls-policy, real-database-tests]
  - id: capability-not-role-string-in-business-code
    rule: Business authorization evaluates stable capabilities/resource policies rather than scattered raw role comparisons.
    enforcement: [typescript, policy-modules, lint-or-architecture-tests, policy-tests]
  - id: protected-read-self-secures
    rule: A Fetcher validates input, resolves actor, derives legal scope, applies tenant containment, selects minimal persistence fields, maps, and returns DTOs without writes.
    enforcement: [zod, auth-authz, prisma-selects, rls, architecture-tests, integration-tests]
  - id: mutation-boundary-separation
    rule: Server Actions adapt transport; Workflows coordinate use cases; Transaction Helpers preserve atomic database facts; Integration Adapters own provider mechanics.
    enforcement: [import-rules, ast-rules, workflow-tests, transaction-tests]
  - id: no-network-in-db-transaction
    rule: Provider/network operations do not execute inside database transactions.
    enforcement: [layer-contract, import-rules, review, integration-tests]
  - id: provider-state-not-domain-model
    rule: Provider objects and statuses are normalized through adapters/mirrors and cannot be copied wholesale into product-domain truth.
    enforcement: [integration-contracts, dto-mappers, schemas, review]
  - id: webhook-at-least-once
    rule: Provider events are replayable, concurrent, potentially duplicated and out of order; processing is durable, atomically claimed, idempotent, and recoverable.
    enforcement: [unique-constraint, lease-transaction, webhook-tests, provider-retrieval]
  - id: rls-defense-in-depth
    rule: Protected tenant tables use transaction-local tenant context under a restricted runtime role without table ownership or BYPASSRLS.
    enforcement: [migration-grants, rls-policies, canonical-db-helper, privilege-tests, cross-tenant-attack-tests]
  - id: dto-is-approved-boundary
    rule: Prisma models, unrestricted provider objects, secrets, and non-serializable persistence values do not cross into presentation/client contracts.
    enforcement: [selects, dto-mappers, typescript, serialization-tests, review]
  - id: execution-does-not-redefine-canon
    rule: Progress, handoff, and operational decisions record current execution but cannot override canonical context or deterministic contracts.
    enforcement: [governance-validation, decision-cross-reference, review]
  - id: evidence-must-name-execution
    rule: A passed validation/conformance claim identifies the executed command or review, environment, result, timestamp, scope, and limitations.
    enforcement: [validation-contract, execution-schema, ci-evidence, review]

invalid_combinations:
  - user-directly-has-global-product-role-without-membership-scope
  - clerk-metadata-is-canonical-membership-or-role-state
  - project-is-tenant-or-billing-boundary
  - route-or-feature-or-component-imports-prisma-or-provider-sdk
  - fetcher-performs-database-or-provider-write
  - server-action-implements-multi-step-domain-workflow
  - transaction-helper-performs-network-call
  - provider-object-is-exposed-as-domain-or-ui-contract
  - checkout-success-redirect-grants-entitlement-or-payment-authority
  - existing-webhook-ledger-row-is-treated-as-processed
  - runtime-database-role-owns-protected-table-or-has-bypassrls
  - execution-record-overrides-canonical-document-or-contract
  - inferred-or-expected-validation-is-recorded-as-executed-pass

enforcement_classes:
  typescript:
    proves: compile-time-shape-and-exhaustiveness-subsets
    does_not_prove: runtime-trust-or-database-containment
  zod:
    proves: runtime-input-shape-and-declared-semantic-rules
    does_not_prove: authorization-or-persistence-integrity
  prisma-schema:
    proves: declared-persistence-model-relations-indexes-and-supported-constraints
    does_not_prove: complete-domain-ontology
  postgres-constraints:
    proves: database-enforced-invariants-and-uniqueness
    does_not_prove: product-authorization
  rls-policies:
    proves: row-containment-under-tested-runtime-role
    does_not_prove: business-capability-legality
  lint-architecture-rules:
    proves: mechanically-detectable-dependency-and-boundary-rules
    does_not_prove: full-semantic-correctness
  authorization-tests:
    proves: sampled-policy-matrix-behavior
    does_not_prove: database-rls-role-configuration-without-real-db-tests
  transaction-tests:
    proves: atomicity-concurrency-and-rollback-properties-when-run-on-real-postgres
    does_not_prove: provider-network-outcomes
  webhook-tests:
    proves: replay-lease-idempotency-and-reconciliation-behavior-covered-by-cases
    does_not_prove: provider-delivery-guarantees-beyond-contract
  ci-gates:
    proves: recorded-checks-executed-for-a-specific-revision
    does_not_prove: unexecuted-or-unmodeled-properties

model_relationships:
  taxonomy: Classifies ontology entities and artifacts; it does not define their meaning.
  terminology: Owns approved words for ontology concepts and disambiguation.
  schema: Encodes valid storage/transport/runtime shapes for selected ontology concepts; it is not the ontology itself.
  domain-model: Implements product-specific entities, states, and invariants derived from the ontology.
  architecture: Assigns responsibilities and dependency boundaries among ontology concepts/modules.
  knowledge-graph: May store instances of source-to-claim-to-decision-to-artifact-to-validator relationships defined by this ontology.

source_traceability:
  - source: Codependent-Coding-Knowledge-System.txt
    location: Section 1 Ontology; subsections 1.1-1.8
    contribution: required-entity-families-relationships-cardinalities-constraints-states-and-enforcement-mapping
    disposition: adopted
  - source: web-development.knowledge-modeling.ontology-taxonomy.reference(1).md
    location: Core distinction; Ontology; Domain modeling; Authorization; Practical classification stack
    contribution: ontology-vs-taxonomy-schema-type-domain-model-and-authority-distinctions
    disposition: adopted-refined
  - source: software-development.system-architecture.terminology.reference(1).md
    location: Core software/system; domain/data; behavior/lifecycle; security/authority; governance/quality terms
    contribution: canonical-concept-definitions-and-boundary-language
    disposition: adopted
  - source: How-I-Build-Opinionated-SaaS-Applications.txt
    location: Architecture Overview through Authorization, Data, Integrations, Governance, Security
    contribution: applied-entity-ownership-and-runtime-relationship-evidence
    disposition: adopted-refined-by-later-canonical-patterns
  - source: vouch.complete-system-documentation.md
    location: Sections 0.1-0.12
    contribution: reference-implementation-evidence-for-truth-ownership-runtime-flows-lifecycles-provider-boundaries-and-validation
    disposition: implementation-evidence-only-for-vouch-specific-domain-rules
