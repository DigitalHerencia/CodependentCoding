---
title: Hipster Stack Golden Application Workflow Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: application-workflow
kind: reference
namespace: hipsterstack.patterns.application-workflow.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/workflows
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 003: The Golden Application Workflow

The workflow owns **use-case sequence**.

It coordinates domain policy, persistence, transactions, and external providers without becoming a 1,000-line utility drawer labeled `workflows.ts`.

## Canonical flow

```text
trusted actor + validated command
             ↓
load authorized resource
             ↓
authorize operation
             ↓
enforce workflow invariants
             ↓
record local operation intent
             ↓
perform provider operation if required
             ↓
persist provider result
             ↓
audit / outbox
             ↓
return DTO + invalidation plan
```

## Responsibilities

A golden workflow owns:

- One named business use case
- Resource-aware authorization
- Domain invariant enforcement
- Sequencing queries, commands, transactions, and provider calls
- Stable provider idempotency keys
- Recovery state when database and provider cannot share one transaction
- Audit and outbox creation through persistence commands
- A framework-neutral application result

It does not own:

- `"use server"`
- `FormData`
- `redirect()`
- `revalidatePath()`
- JSX
- Raw HTTP responses
- Signature verification
- Provider SDK details that belong in an adapter
- Long database transactions around network calls

## File structure

```text
lib/
├── application/
│   └── billing/
│       └── create-checkout-session.workflow.ts
├── authz/
│   └── invoice.policy.ts
├── db/
│   ├── commands/
│   │   ├── invoice.commands.ts
│   │   └── payment-attempt.commands.ts
│   ├── queries/
│   │   └── invoice.queries.ts
│   └── transactions/
│       └── prepare-invoice-checkout.tx.ts
├── integrations/
│   └── stripe/
│       ├── checkout.adapter.ts
│       └── customer.adapter.ts
├── errors/
│   └── application-error.ts
└── cache/
    └── invalidation.ts
```

## Workflow input

The action has already parsed transport input and resolved the actor.

```ts
interface CreateCheckoutSessionWorkflowInput {
  actor: Actor;
  input: {
    organizationId: string;
    invoiceId: string;
  };
}
```

The workflow still treats IDs as identifiers, not authorization proof.

`organizationId` coming from the browser does not establish membership. `invoiceId` coming from the browser does not establish ownership.

## Provider/database consistency

PostgreSQL and Stripe cannot participate in one shared ACID transaction.

Therefore, model the provider operation locally before calling Stripe.

```text
Database transaction:
  verify invoice state
  create or reuse PaymentAttempt
  persist stable idempotency key
  commit

Stripe call:
  create/retrieve Checkout Session using that key

Database command:
  attach provider IDs and URL
  mark attempt ready

Webhook:
  reconcile eventual payment truth
```

This sequence makes every intermediate state recoverable.

## Local operation model

```prisma
model PaymentAttempt {
  id                    String               @id @default(cuid())
  organizationId        String
  invoiceId             String
  kind                  PaymentAttemptKind
  status                PaymentAttemptStatus @default(pending)

  idempotencyKey        String               @unique
  invoiceVersion        Int
  expectedAmountCents   Int
  currency              String               @db.VarChar(3)

  stripeCustomerId      String?
  stripeCheckoutId      String?              @unique
  stripePaymentIntentId String?              @unique
  checkoutUrl           String?

  failureCode           String?
  failureMessage        String?

  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Restrict)

  @@index([organizationId, invoiceId, status])
}

enum PaymentAttemptKind {
  checkout
}

enum PaymentAttemptStatus {
  pending
  provider_created
  processing
  succeeded
  failed
  expired
}
```

The attempt captures the exact invoice version and amount being offered for payment.

## Provider adapter

The workflow should not know Stripe request syntax.

```ts
// lib/integrations/stripe/checkout.adapter.ts

import "server-only";

import { stripe } from "@/lib/integrations/stripe/client";

export interface CreateInvoiceCheckoutInput {
  customerId?: string;
  invoiceId: string;
  attemptId: string;
  invoiceVersion: number;
  amountCents: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  idempotencyKey: string;
}

export interface CreatedInvoiceCheckout {
  checkoutSessionId: string;
  paymentIntentId: string | null;
  url: string;
}

export async function createInvoiceCheckout(
  input: CreateInvoiceCheckoutInput,
): Promise<CreatedInvoiceCheckout> {
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer: input.customerId,
      client_reference_id: input.invoiceId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency,
            unit_amount: input.amountCents,
            product_data: {
              name: input.description,
            },
          },
        },
      ],
      metadata: {
        invoiceId: input.invoiceId,
        paymentAttemptId: input.attemptId,
        invoiceVersion: String(input.invoiceVersion),
      },
      payment_intent_data: {
        metadata: {
          invoiceId: input.invoiceId,
          paymentAttemptId: input.attemptId,
        },
      },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    },
    {
      idempotencyKey: input.idempotencyKey,
    },
  );

  if (!session.url) {
    throw new Error("STRIPE_CHECKOUT_URL_MISSING");
  }

  return {
    checkoutSessionId: session.id,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
    url: session.url,
  };
}
```

The adapter translates application intent into provider mechanics.

It does not decide whether the actor may pay the invoice.

## Transactionally prepare the operation

```ts
// lib/db/transactions/prepare-invoice-checkout.tx.ts

import type { Prisma } from "@/prisma/generated/prisma/client";

import { ApplicationError } from "@/lib/errors/application-error";

export interface PreparedCheckout {
  invoice: {
    id: string;
    organizationId: string;
    customerUserId: string;
    status: string;
    version: number;
    totalAmountCents: number;
    currency: string;
    description: string;
  };
  attempt: {
    id: string;
    idempotencyKey: string;
  };
}

export async function prepareInvoiceCheckoutTx(
  tx: Prisma.TransactionClient,
  input: {
    actor: Actor;
    organizationId: string;
    invoiceId: string;
  },
): Promise<PreparedCheckout> {
  const invoice = await tx.invoice.findFirst({
    where: {
      id: input.invoiceId,
      organizationId: input.organizationId,
      deletedAt: null,
    },
    select: {
      id: true,
      organizationId: true,
      customerUserId: true,
      status: true,
      version: true,
      totalAmountCents: true,
      currency: true,
      description: true,
    },
  });

  if (!invoice) {
    throw new ApplicationError("NOT_FOUND", "Invoice not found.");
  }

  requireInvoicePaymentAuthorization({
    actor: input.actor,
    invoice,
  });

  assertInvoicePayable(invoice);

  const idempotencyKey = [
    "invoice-checkout",
    invoice.id,
    `v${invoice.version}`,
  ].join(":");

  const attempt = await tx.paymentAttempt.upsert({
    where: {
      idempotencyKey,
    },
    create: {
      organizationId: invoice.organizationId,
      invoiceId: invoice.id,
      kind: "checkout",
      status: "pending",
      idempotencyKey,
      invoiceVersion: invoice.version,
      expectedAmountCents: invoice.totalAmountCents,
      currency: invoice.currency,
    },
    update: {},
    select: {
      id: true,
      idempotencyKey: true,
    },
  });

  return {
    invoice,
    attempt,
  };
}
```

The same logical invoice version receives the same local attempt and provider idempotency key.

## The golden workflow

```ts
// lib/application/billing/create-checkout-session.workflow.ts

import "server-only";

import { runSerializableTransaction } from "@/lib/db/transactions/run-serializable";
import { prepareInvoiceCheckoutTx } from "@/lib/db/transactions/prepare-invoice-checkout.tx";
import {
  attachCheckoutSession,
  markPaymentAttemptFailed,
} from "@/lib/db/commands/payment-attempt.commands";
import { createInvoiceCheckout } from "@/lib/integrations/stripe/checkout.adapter";
import { getOrCreateStripeCustomer } from "@/lib/integrations/stripe/customer.adapter";
import type { MutationOutcome } from "@/lib/cache/invalidation";
import type { CheckoutSessionDTO } from "@/types/billing.types";

export async function createCheckoutSessionWorkflow({
  actor,
  input,
}: CreateCheckoutSessionWorkflowInput): Promise<
  MutationOutcome<CheckoutSessionDTO>
> {
  const prepared = await runSerializableTransaction((tx) =>
    prepareInvoiceCheckoutTx(tx, {
      actor,
      organizationId: input.organizationId,
      invoiceId: input.invoiceId,
    }),
  );

  try {
    const stripeCustomer = await getOrCreateStripeCustomer({
      organizationId: prepared.invoice.organizationId,
      userId: prepared.invoice.customerUserId,
    });

    const checkout = await createInvoiceCheckout({
      customerId: stripeCustomer.stripeCustomerId,
      invoiceId: prepared.invoice.id,
      attemptId: prepared.attempt.id,
      invoiceVersion: prepared.invoice.version,
      amountCents: prepared.invoice.totalAmountCents,
      currency: prepared.invoice.currency,
      description: prepared.invoice.description,
      successUrl: buildInvoiceSuccessUrl(prepared.invoice.id),
      cancelUrl: buildInvoiceCancelUrl(prepared.invoice.id),
      idempotencyKey: prepared.attempt.idempotencyKey,
    });

    await attachCheckoutSession({
      paymentAttemptId: prepared.attempt.id,
      stripeCustomerId: stripeCustomer.stripeCustomerId,
      stripeCheckoutSessionId: checkout.checkoutSessionId,
      stripePaymentIntentId: checkout.paymentIntentId,
      checkoutUrl: checkout.url,
    });

    return {
      data: {
        invoiceId: prepared.invoice.id,
        checkoutSessionId: checkout.checkoutSessionId,
        checkoutUrl: checkout.url,
      },
      invalidate: {
        tags: [
          `invoice:${prepared.invoice.id}`,
          `organization:${prepared.invoice.organizationId}:invoices`,
        ],
      },
    };
  } catch (error) {
    await markPaymentAttemptFailed({
      paymentAttemptId: prepared.attempt.id,
      error,
    });

    throw mapStripeWorkflowError(error);
  }
}
```

No database transaction remains open while Stripe is called.

If Stripe succeeds and the final database update fails, the stable idempotency key allows recovery. A reconciliation job or webhook can attach the provider object later.

## Simple workflow

Not every workflow needs a provider operation.

```ts
export async function archiveProject({
  actor,
  input,
}: ArchiveProjectWorkflowInput): Promise<
  MutationOutcome<ProjectSummaryDTO>
> {
  const project = await runSerializableTransaction(async (tx) => {
    const current = await getProjectForMutationTx(tx, {
      projectId: input.projectId,
      organizationId: input.organizationId,
    });

    requireProjectArchiveAuthorization({
      actor,
      project: current,
    });

    assertProjectArchivable(current);

    return archiveProjectTx(tx, {
      projectId: current.id,
      organizationId: current.organizationId,
      expectedVersion: current.version,
      actorUserId: actor.userId,
      now: new Date(),
    });
  });

  return {
    data: mapProjectSummaryDTO(project),
    invalidate: {
      tags: [
        `project:${project.id}`,
        `organization:${project.organizationId}:projects`,
      ],
    },
  };
}
```

Even here, the workflow owns the use case; the transaction helper owns the atomic mutation.

## One workflow per use case

Good:

```text
create-project.workflow.ts
archive-project.workflow.ts
issue-invoice.workflow.ts
create-checkout-session.workflow.ts
confirm-booking.workflow.ts
change-membership-role.workflow.ts
```

Bad:

```text
project-workflows.ts       2,400 lines
billing.actions.ts         sovereign nation
utils.ts                   crime scene
```

## Error handling

A workflow should throw stable application errors:

```text
NOT_FOUND
FORBIDDEN
CONFLICT
PROVIDER_ERROR
```

It should preserve the original error as a cause for logs while exposing a safe message to the action.

Do not return `ActionResult` from the workflow. `ActionResult` belongs to the Next.js transport layer.

## Tests

Workflow tests should verify use-case sequence with mocked ports:

- Resource authorization occurs before mutation
- Domain invariant failure prevents writes
- Stable idempotency key is reused
- Stripe is not called while a transaction is open
- Provider failure marks the local attempt failed
- Provider success persists external IDs
- Final persistence failure remains recoverable
- Invalidation intent is accurate
- Cross-tenant IDs never escape authorized scope

Use real provider sandbox tests separately. Unit tests should not call Stripe.

## Golden workflow checklist

```text
[ ] One file represents one business use case
[ ] Input contains a trusted actor and validated command
[ ] Resource-aware authorization occurs here
[ ] Domain invariants are explicit
[ ] Database and provider operations are not placed in one fake transaction
[ ] Provider calls use stable idempotency keys
[ ] Local operation state exists before irreversible provider work
[ ] Provider mechanics are delegated to an integration adapter
[ ] Atomic database work is delegated to transaction helpers
[ ] Audit/outbox work is persisted with primary state
[ ] Result is framework-neutral
[ ] No Next.js cache/navigation imports exist
```

## Compressed canonical form

```ts
export async function executeUseCase({
  actor,
  input,
}: UseCaseInput): Promise<MutationOutcome<UseCaseDTO>> {
  const prepared = await runSerializableTransaction((tx) =>
    prepareUseCaseTx(tx, { actor, input }),
  );

  const providerResult = await performProviderOperation({
    prepared,
    idempotencyKey: prepared.operation.idempotencyKey,
  });

  const completed = await completeUseCase({
    prepared,
    providerResult,
  });

  return {
    data: mapUseCaseDTO(completed),
    invalidate: buildInvalidationPlan(completed),
  };
}
```

The workflow knows the order of operations. It does not personally become every operation.
