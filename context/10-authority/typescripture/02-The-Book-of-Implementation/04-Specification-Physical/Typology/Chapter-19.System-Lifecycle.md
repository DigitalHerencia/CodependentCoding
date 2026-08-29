---
title: Hipster Stack Golden System Lifecycle Definition Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: system-lifecycle
kind: reference
namespace: hipsterstack.patterns.system-lifecycle.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/lifecycles
  - patterns/canonical
  - status/review
created: 2026-08-05
updated: 2026-08-05
---

# Canonical Pattern 009: The Golden System Lifecycle Definition

A lifecycle defines how a stateful thing enters the system, changes over time, reaches terminal or recoverable states, and preserves its invariants under retries, concurrency, and partial failure.

An enum is not a lifecycle.

A status column is not a lifecycle.

A switch statement in `workflows.ts` is not a lifecycle.

The canonical lifecycle definition includes:

- identity,
- ownership,
- states,
- transitions,
- actors and triggers,
- guards,
- invariants,
- side effects,
- timestamps,
- idempotency,
- concurrency strategy,
- recovery,
- observability,
- and tests.

## Core rule

> **Every durable state transition must have one named authority, one legal transition definition, and one persistence strategy.**

A lifecycle should make illegal states difficult to represent and illegal transitions difficult to execute.

---

# Lifecycle classes

A serious SaaS system contains several lifecycle classes.

## Domain entity lifecycle

Examples:

```text
Project
Invoice
Booking
Membership
Invitation
Subscription
Vouch
```

## Provider mirror lifecycle

Examples:

```text
Stripe Customer
PaymentIntent mirror
Checkout Session mirror
Connected Account readiness
Refund mirror
```

## Operation lifecycle

Examples:

```text
PaymentAttempt
ImportJob
ExportJob
AI generation request
File processing request
Reconciliation run
```

## Delivery lifecycle

Examples:

```text
WebhookEvent
OutboxEvent
OperationalRetry
NotificationDelivery
```

## Access lifecycle

Examples:

```text
User account
Membership
Invitation
API key
Service credential
Session
```

## Release lifecycle

Examples:

```text
Draft specification
Approved specification
Implementation
Validation
Release
Deprecation
Archive
```

Each lifecycle uses the same grammar even when its states differ.

---

# Canonical lifecycle anatomy

```text
Identity
  What uniquely identifies the thing?

Owner
  Which user, organization, or system owns it?

Truth source
  Is the canonical state local, provider-owned, or reconciled?

Initial state
  How does it enter the system?

Active states
  Which states permit continued work?

Terminal states
  Which states end normal processing?

Recoverable states
  Which states can be retried or reconciled?

Transitions
  Which state changes are legal?

Actor / trigger
  Who or what may initiate each transition?

Guards
  What must be true before the transition?

Mutation
  Which fields change atomically?

Side effects
  Which durable work is emitted?

Idempotency
  How does retry avoid duplication?

Concurrency
  How are stale and competing transitions rejected?

Observability
  Which timestamps, events, and errors are recorded?

Recovery
  How does the system resume after partial failure?
```

---

# Canonical lifecycle contract

A lifecycle definition should exist in human-readable documentation and, where useful, machine-readable form.

```yaml
version: 1

lifecycle:
  name: invoice
  entity: Invoice
  tenant_key: organizationId
  truth_source: application_database
  version_field: version

  initial_state: draft

  terminal_states:
    - paid
    - void
    - written_off

  recoverable_states:
    - payment_pending
    - payment_failed

  states:
    draft:
      description: Editable invoice not yet presented for payment.

    issued:
      description: Immutable payable invoice presented to the customer.

    payment_pending:
      description: Provider payment operation exists but has not settled.

    paid:
      description: Canonical payment settlement has been reconciled.

    payment_failed:
      description: Latest payment attempt failed; invoice remains payable.

    void:
      description: Invoice was intentionally canceled before settlement.

    written_off:
      description: Balance was administratively closed without payment.

  transitions:
    - name: issue
      from: [draft]
      to: issued
      actors:
        - capability: invoice.issue
      guards:
        - invoice_has_line_items
        - total_is_positive
        - customer_is_active
      atomic_writes:
        - freeze_invoice_version
        - set_issued_at
        - create_audit_event

    - name: begin_payment
      from: [issued, payment_failed]
      to: payment_pending
      actors:
        - capability: invoice.pay
      guards:
        - amount_matches_current_version
        - no_active_payment_attempt
      idempotency:
        key: "invoice:{invoiceId}:v{version}:checkout"
      atomic_writes:
        - create_payment_attempt
        - create_audit_event

    - name: settle_payment
      from: [issued, payment_pending, payment_failed]
      to: paid
      actors:
        - system: stripe-webhook
      guards:
        - provider_payment_succeeded
        - amount_matches_attempt
        - currency_matches_attempt
        - invoice_version_matches_attempt
      atomic_writes:
        - upsert_payment
        - update_invoice
        - update_payment_attempt
        - create_audit_event
        - create_outbox_event

    - name: void
      from: [draft, issued, payment_failed]
      to: void
      actors:
        - capability: invoice.void
      guards:
        - no_succeeded_payment
      atomic_writes:
        - set_voided_at
        - increment_version
        - create_audit_event
```

The YAML describes the contract.

The domain code and transaction tests enforce it.

---

# TypeScript lifecycle model

## States

```ts
export const INVOICE_STATES = [
  "draft",
  "issued",
  "payment_pending",
  "paid",
  "payment_failed",
  "void",
  "written_off",
] as const;

export type InvoiceState =
  (typeof INVOICE_STATES)[number];
```

## Transition names

```ts
export const INVOICE_TRANSITIONS = [
  "issue",
  "begin_payment",
  "settle_payment",
  "record_payment_failure",
  "void",
  "write_off",
] as const;

export type InvoiceTransition =
  (typeof INVOICE_TRANSITIONS)[number];
```

## Legal transition map

```ts
export const INVOICE_TRANSITION_MAP = {
  issue: {
    from: ["draft"],
    to: "issued",
  },

  begin_payment: {
    from: ["issued", "payment_failed"],
    to: "payment_pending",
  },

  settle_payment: {
    from: [
      "issued",
      "payment_pending",
      "payment_failed",
    ],
    to: "paid",
  },

  record_payment_failure: {
    from: ["issued", "payment_pending"],
    to: "payment_failed",
  },

  void: {
    from: ["draft", "issued", "payment_failed"],
    to: "void",
  },

  write_off: {
    from: ["issued", "payment_failed"],
    to: "written_off",
  },
} as const satisfies Record<
  InvoiceTransition,
  {
    from: readonly InvoiceState[];
    to: InvoiceState;
  }
>;
```

## Pure transition guard

```ts
export function assertInvoiceTransitionAllowed(input: {
  current: InvoiceState;
  transition: InvoiceTransition;
}): InvoiceState {
  const definition =
    INVOICE_TRANSITION_MAP[input.transition];

  if (!definition.from.includes(input.current)) {
    throw new ApplicationError(
      "CONFLICT",
      `Invoice cannot ${input.transition} from ${input.current}.`,
    );
  }

  return definition.to;
}
```

The pure transition guard defines graph legality.

Additional guards define business legality.

---

# Transition authority

One transition must have one authoritative application use case.

```text
invoice.issue
  → issueInvoiceWorkflow()

invoice.begin_payment
  → createCheckoutSessionWorkflow()

invoice.settle_payment
  → reconcileSucceededPaymentWorkflow()

invoice.void
  → voidInvoiceWorkflow()
```

Avoid allowing these unrelated modules to invent invoice transitions independently:

```text
Server Action
Webhook processor
Admin route
Cron job
Migration helper
UI component
```

They may all invoke an authoritative transition workflow.

They should not each implement their own version.

---

# Persistence model

A lifecycle-bearing entity should usually record:

```prisma
model Invoice {
  id             String       @id @default(cuid())
  organizationId String
  status         InvoiceStatus
  version        Int          @default(1)

  issuedAt       DateTime?
  paymentPendingAt DateTime?
  paidAt         DateTime?
  failedAt       DateTime?
  voidedAt       DateTime?
  writtenOffAt   DateTime?

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum InvoiceStatus {
  draft
  issued
  payment_pending
  paid
  payment_failed
  void
  written_off
}
```

Use dedicated timestamps for operationally meaningful transitions.

Do not infer everything from `updatedAt`.

`updatedAt` answers:

> When did any tracked field last change?

It does not answer:

> When was payment settled?

---

# Conditional transition mutation

The database write should assert the expected current state and version.

```ts
const transitioned = await tx.invoice.updateMany({
  where: {
    id: input.invoiceId,
    organizationId: input.organizationId,
    status: {
      in: input.allowedFromStates,
    },
    version: input.expectedVersion,
  },
  data: {
    status: input.nextState,
    version: {
      increment: 1,
    },
    ...input.transitionFields,
  },
});

if (transitioned.count !== 1) {
  throw new ApplicationError(
    "CONFLICT",
    "Invoice changed before the transition completed.",
  );
}
```

This protects the lifecycle from stale and competing commands.

---

# Lifecycle invariants

An invariant must remain true in every legal state.

Examples:

```text
paid invoice
  → paidAt is not null
  → succeeded payment exists
  → outstanding balance is zero

void invoice
  → voidedAt is not null
  → no succeeded payment exists

active membership
  → user and organization exist
  → revokedAt is null

processed webhook
  → processedAt is not null
  → lockToken is null
  → leaseExpiresAt is null

succeeded payment attempt
  → provider payment ID exists
  → expected amount and currency were matched
```

Represent invariants in multiple layers where appropriate:

```text
type system
database constraints
conditional transactions
domain assertions
integration tests
reconciliation jobs
```

No single layer catches every violation.

---

# Domain lifecycle versus provider lifecycle

Do not collapse provider state directly into domain state.

Example:

```text
Stripe PaymentIntent.status
  requires_payment_method
  requires_action
  processing
  requires_capture
  succeeded
  canceled

Application PaymentAttempt.status
  pending
  provider_created
  processing
  succeeded
  failed
  expired

Invoice.status
  issued
  payment_pending
  paid
  payment_failed
```

These are related but not identical.

The provider mirror preserves provider truth.

The domain lifecycle preserves product truth.

The reconciliation workflow maps one into the other under explicit rules.

---

# Webhook lifecycle

```text
received
  → processing
    → processed
    → ignored
    → failed
```

Required fields:

```text
receivedAt
lockedAt
leaseExpiresAt
processedAt
failedAt
attemptCount
nextAttemptAt
failureCode
```

Recovery:

```text
processing + expired lease
  → claimable

failed + nextAttemptAt <= now
  → claimable

processed
  → terminal and idempotent
```

A webhook status without a lease and retry policy is incomplete.

---

# Outbox lifecycle

```text
pending
  → processing
    → delivered
    → failed
    → dead_letter
```

An outbox event should define:

- unique identity,
- topic,
- aggregate ID,
- attempt count,
- lease,
- next attempt time,
- terminal dead-letter condition,
- delivery idempotency key.

The outbox lifecycle is separate from the domain lifecycle.

A payment may be settled even while its receipt email remains pending.

---

# Membership lifecycle

```text
invited
  → active
    → suspended
    → active
    → revoked
```

Questions the lifecycle must answer:

- Who may invite?
- Does reinvitation reuse or replace an invitation?
- What happens when a user already belongs?
- Can a revoked membership be restored?
- Does suspending membership terminate sessions?
- What happens to owned resources?
- Which states count for RLS membership policies?

---

# Subscription lifecycle

Separate:

```text
application entitlement
```

from:

```text
Stripe Subscription.status
```

A canonical subscription lifecycle might include:

```text
trialing
active
past_due
grace_period
suspended
canceled
```

The application must define:

- when entitlements begin,
- how long grace lasts,
- what past due permits,
- whether cancellation is immediate or period-end,
- how provider webhooks reconcile state,
- which state is authoritative during provider outages.

---

# Runtime request lifecycle

A protected user request follows:

```text
request received
  → route input validated
  → actor resolved
  → membership resolved
  → capability/resource policy evaluated
  → use case executed
  → transaction committed
  → cache invalidated
  → response returned
```

An unexpected failure should preserve:

```text
requestId
actorId
organizationId
operation
resourceId
error classification
duration
```

The runtime request lifecycle belongs in observability and error-handling documentation even though it is not persisted as one entity.

---

# Release lifecycle

Canonical engineering work also has a lifecycle:

```text
idea
  → context
  → contract
  → specification
  → approved
  → implementation
  → validation
  → released
  → observed
  → deprecated
  → archived
```

Each stage should define its entrance and exit criteria.

Example:

```text
approved specification
  requires:
    - problem statement
    - scope
    - acceptance criteria
    - affected contracts
    - test plan
    - migration impact
    - rollback plan when consequential
```

This lifecycle connects the architecture to governance.

---

# Recovery contract

Every nontrivial lifecycle must answer:

```text
What if the process dies after step 1?
What if the request is repeated?
What if two actors race?
What if provider state arrives out of order?
What if local and provider truth diverge?
What if a terminal state is discovered to be wrong?
```

Recovery mechanisms include:

- idempotency keys,
- version columns,
- processing leases,
- retry records,
- outbox records,
- reconciliation jobs,
- operator review queues,
- compensating transitions,
- append-only audit events.

---

# Audit contract

Every consequential transition should emit an audit event containing:

```text
eventName
entityType
entityId
organizationId
actorType
actorId or system identity
fromState
toState
requestId
providerEventId when relevant
occurredAt
reason or metadata
```

Audit events describe what happened.

They should not be the only place canonical state exists.

---

# Lifecycle diagram convention

Use one consistent notation:

```text
[state]
  -- transition / actor / guards -->
[next state]
```

Example:

```text
[draft]
  -- issue / invoice.issue / has-lines + positive-total -->
[issued]

[issued]
  -- begin-payment / invoice.pay / current-version -->
[payment_pending]

[payment_pending]
  -- settle-payment / stripe-webhook / amount+currency-match -->
[paid]

[payment_pending]
  -- record-failure / stripe-webhook / provider-failed -->
[payment_failed]
```

Document loops, retries, and terminal states explicitly.

---

# Lifecycle tests

## Transition matrix tests

For every transition:

```text
allowed source state succeeds
every disallowed source state fails
target state is correct
required timestamps are set
version increments
audit event is emitted
```

## Concurrency tests

```text
two actors attempt the same transition
stale version loses
duplicate provider event is idempotent
final slot reservation admits one winner
expired lease is reclaimable
active lease is exclusive
```

## Invariant tests

```text
every paid invoice has paidAt
every processed webhook has no live lease
every active membership has no revokedAt
every succeeded payment matches amount and currency
```

## Recovery tests

```text
crash before provider call
crash after provider success
crash after database commit
out-of-order provider event
retry after timeout
dead-letter after max attempts
```

---

# Lifecycle versioning

Lifecycle definitions evolve.

Adding a new state is a schema and behavior change.

Required work may include:

- database migration,
- backfill,
- transition-map update,
- workflow changes,
- DTO changes,
- UI state support,
- contract update,
- audit update,
- tests,
- operational dashboard support.

Never add a new enum value without checking every exhaustive switch and every terminal-state query.

---

# Golden lifecycle checklist

```text
[ ] Lifecycle identity and tenant ownership are explicit
[ ] Canonical truth source is named
[ ] Initial, active, recoverable, and terminal states are identified
[ ] Every legal transition has a name
[ ] Every transition names actors or triggers
[ ] Guards and invariants are separate
[ ] One workflow owns each transition
[ ] Persistence asserts expected state and version
[ ] Important transitions receive dedicated timestamps
[ ] Provider state and domain state are not collapsed
[ ] Idempotency and concurrency strategies are defined
[ ] Recovery from partial failure is documented
[ ] Audit and observability requirements are defined
[ ] Transition, concurrency, invariant, and recovery tests exist
```

## Compressed canonical definition

```text
Lifecycle =
  states
  + legal transitions
  + actors/triggers
  + guards
  + invariants
  + atomic writes
  + idempotency
  + concurrency
  + recovery
  + observability
```

A lifecycle is the executable history of a system concept—not merely the list of words accepted by its `status` column.
