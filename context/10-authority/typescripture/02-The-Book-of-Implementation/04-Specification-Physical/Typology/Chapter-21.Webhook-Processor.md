---
title: Hipster Stack Golden Webhook Processor Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: webhook-processor
kind: reference
namespace: hipsterstack.patterns.webhook-processor.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/webhooks
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 006: The Golden Webhook Processor

A webhook is an unauthenticated-by-session provider request carrying a signed claim that external state changed.

It is not a trustworthy command to blindly mutate local rows in delivery order.

The canonical processor treats webhooks as **at-least-once, potentially duplicated, potentially concurrent, and potentially out of order**.

## Canonical flow

```text
raw HTTP request
       ↓
verify provider signature
       ↓
parse provider event
       ↓
persist durable inbox record
       ↓
atomically claim processing lease
       ↓
dispatch supported event handler
       ↓
retrieve provider truth when required
       ↓
transactionally reconcile local state
       ↓
enqueue outbox work
       ↓
finalize inbox event
       ↓
acknowledge provider
```

## Responsibilities by layer

### Route Handler

Owns:

- Raw request body
- Provider signature header
- Signature verification
- HTTP status
- Request ID
- Invoking the processor

Does not own:

- Invoice settlement logic
- Email
- Prisma mutations
- Event-type branching across 500 lines

### Webhook inbox

Owns:

- Durable receipt
- Provider event uniqueness
- Processing status
- Lease ownership
- Retry metadata
- Failure details

### Event processor

Owns:

- Event dispatch
- Idempotent reconciliation use case
- Provider-object retrieval
- Finalization

### Transaction helper

Owns:

- Atomic local state update
- Duplicate provider-object protection
- Audit event
- Outbox event

### Outbox worker

Owns:

- Email
- Slack
- Analytics
- Noncritical provider follow-up
- Retries independent of webhook delivery

## Webhook inbox model

```prisma
model WebhookEvent {
  id               String                  @id @default(cuid())
  provider         WebhookProvider
  providerEventId  String
  eventType        String
  providerObjectId String?
  accountId        String?
  livemode         Boolean                 @default(false)

  status           WebhookProcessingStatus @default(received)
  payload          Json

  receivedAt       DateTime                @default(now())
  lockedAt         DateTime?
  lockToken        String?
  leaseExpiresAt   DateTime?
  processedAt      DateTime?
  failedAt         DateTime?
  nextAttemptAt    DateTime?
  attemptCount     Int                     @default(0)

  failureCode      String?
  failureMessage   String?

  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt

  @@unique([provider, providerEventId])
  @@index([status, nextAttemptAt])
  @@index([status, leaseExpiresAt])
  @@index([provider, eventType, receivedAt])
  @@index([providerObjectId, eventType])
}

enum WebhookProvider {
  stripe
  clerk
}

enum WebhookProcessingStatus {
  received
  processing
  processed
  ignored
  failed
}
```

The lease uses `lockedAt` or `leaseExpiresAt`.

Never use the original `receivedAt` as the processing lease timestamp.

## Route Handler

```ts
// app/api/stripe/webhooks/route.ts

import { NextResponse } from "next/server";

import { processStripeWebhook } from "@/lib/webhooks/stripe/process-stripe-webhook";
import { constructStripeEvent } from "@/lib/integrations/stripe/webhook.adapter";
import { createSystemActor } from "@/lib/auth/system-actor";
import { getRequestId } from "@/lib/security/request";

export async function POST(request: Request) {
  const requestId = await getRequestId(request.headers);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = constructStripeEvent({
      rawBody,
      signature,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  const actor = createSystemActor({
    system: "stripe-webhook",
    requestId,
  });

  try {
    const result = await processStripeWebhook({
      actor,
      event,
      rawPayload: rawBody,
    });

    return NextResponse.json(
      {
        ok: true,
        status: result.status,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe webhook processing failed", {
      requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      error,
    });

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
```

Signature verification must use the raw body before parsing or transforming it.

## Durable receipt

```ts
export async function recordStripeWebhookEvent(input: {
  event: Stripe.Event;
  rawPayload: string;
}): Promise<{
  webhookEventId: string;
  duplicate: boolean;
}> {
  try {
    const created = await prisma.webhookEvent.create({
      data: {
        provider: "stripe",
        providerEventId: input.event.id,
        eventType: input.event.type,
        providerObjectId: getStripeObjectId(input.event),
        accountId: input.event.account ?? null,
        livemode: input.event.livemode,
        payload: JSON.parse(input.rawPayload),
        status: "received",
      },
      select: {
        id: true,
      },
    });

    return {
      webhookEventId: created.id,
      duplicate: false,
    };
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existing = await prisma.webhookEvent.findUniqueOrThrow({
      where: {
        provider_providerEventId: {
          provider: "stripe",
          providerEventId: input.event.id,
        },
      },
      select: {
        id: true,
      },
    });

    return {
      webhookEventId: existing.id,
      duplicate: true,
    };
  }
}
```

A duplicate receipt is not automatically a duplicate processing attempt. The current status determines what happens next.

## Atomic lease claim

```ts
// lib/db/transactions/claim-webhook-event.tx.ts

import { randomUUID } from "node:crypto";

const WEBHOOK_LEASE_MS = 5 * 60 * 1000;

export async function claimWebhookEventTx(
  tx: Prisma.TransactionClient,
  input: {
    webhookEventId: string;
    now: Date;
  },
): Promise<
  | {
      kind: "claimed";
      lockToken: string;
      leaseExpiresAt: Date;
    }
  | {
      kind: "processed";
    }
  | {
      kind: "busy";
      leaseExpiresAt: Date | null;
    }
> {
  const event = await tx.webhookEvent.findUniqueOrThrow({
    where: {
      id: input.webhookEventId,
    },
    select: {
      status: true,
      leaseExpiresAt: true,
    },
  });

  if (
    event.status === "processed" ||
    event.status === "ignored"
  ) {
    return {
      kind: "processed",
    };
  }

  const lockToken = randomUUID();
  const leaseExpiresAt = new Date(
    input.now.getTime() + WEBHOOK_LEASE_MS,
  );

  const claimed = await tx.webhookEvent.updateMany({
    where: {
      id: input.webhookEventId,
      OR: [
        {
          status: {
            in: ["received", "failed"],
          },
        },
        {
          status: "processing",
          leaseExpiresAt: {
            lte: input.now,
          },
        },
      ],
    },
    data: {
      status: "processing",
      lockedAt: input.now,
      lockToken,
      leaseExpiresAt,
      nextAttemptAt: null,
      failureCode: null,
      failureMessage: null,
      attemptCount: {
        increment: 1,
      },
    },
  });

  if (claimed.count === 1) {
    return {
      kind: "claimed",
      lockToken,
      leaseExpiresAt,
    };
  }

  const refreshed = await tx.webhookEvent.findUniqueOrThrow({
    where: {
      id: input.webhookEventId,
    },
    select: {
      status: true,
      leaseExpiresAt: true,
    },
  });

  if (
    refreshed.status === "processed" ||
    refreshed.status === "ignored"
  ) {
    return {
      kind: "processed",
    };
  }

  return {
    kind: "busy",
    leaseExpiresAt: refreshed.leaseExpiresAt,
  };
}
```

The claim predicate and update occur atomically.

## Processor

```ts
// lib/webhooks/stripe/process-stripe-webhook.ts

import "server-only";

export async function processStripeWebhook(input: {
  actor: Actor;
  event: Stripe.Event;
  rawPayload: string;
}): Promise<{
  status: "processed" | "duplicate" | "busy" | "ignored";
}> {
  requireStripeWebhookActor(input.actor);

  const receipt = await recordStripeWebhookEvent({
    event: input.event,
    rawPayload: input.rawPayload,
  });

  const claim = await runSerializableTransaction((tx) =>
    claimWebhookEventTx(tx, {
      webhookEventId: receipt.webhookEventId,
      now: new Date(),
    }),
  );

  if (claim.kind === "processed") {
    return {
      status: "duplicate",
    };
  }

  if (claim.kind === "busy") {
    return {
      status: "busy",
    };
  }

  try {
    const supported = isSupportedStripeEvent(input.event.type);

    if (!supported) {
      await finalizeWebhookIgnored({
        webhookEventId: receipt.webhookEventId,
        lockToken: claim.lockToken,
      });

      return {
        status: "ignored",
      };
    }

    await dispatchStripeWebhookEvent({
      actor: input.actor,
      webhookEventId: receipt.webhookEventId,
      lockToken: claim.lockToken,
      event: input.event,
    });

    await finalizeWebhookProcessed({
      webhookEventId: receipt.webhookEventId,
      lockToken: claim.lockToken,
    });

    return {
      status: "processed",
    };
  } catch (error) {
    await finalizeWebhookFailed({
      webhookEventId: receipt.webhookEventId,
      lockToken: claim.lockToken,
      error,
    });

    throw error;
  }
}
```

Finalization must match the current `lockToken`. A stale worker must not overwrite the result of a newer lease owner.

## Finalization

```ts
export async function finalizeWebhookProcessed(input: {
  webhookEventId: string;
  lockToken: string;
}): Promise<void> {
  const finalized = await prisma.webhookEvent.updateMany({
    where: {
      id: input.webhookEventId,
      status: "processing",
      lockToken: input.lockToken,
    },
    data: {
      status: "processed",
      processedAt: new Date(),
      lockedAt: null,
      lockToken: null,
      leaseExpiresAt: null,
      failureCode: null,
      failureMessage: null,
    },
  });

  if (finalized.count !== 1) {
    throw new Error("WEBHOOK_LEASE_LOST");
  }
}
```

## Event dispatch

```ts
export async function dispatchStripeWebhookEvent(input: {
  actor: Actor;
  webhookEventId: string;
  lockToken: string;
  event: Stripe.Event;
}): Promise<void> {
  switch (input.event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed":
      await reconcileCheckoutSessionEvent(input);
      return;

    case "payment_intent.succeeded":
    case "payment_intent.payment_failed":
    case "payment_intent.canceled":
      await reconcilePaymentIntentEvent(input);
      return;

    case "charge.refunded":
    case "refund.updated":
      await reconcileRefundEvent(input);
      return;

    default:
      assertNeverSupportedStripeEvent(input.event.type);
  }
}
```

One handler per provider-object family is easier to reason about than one giant event switch containing every persistence detail.

## Event as notification, not command

Do not blindly apply transition intent from event delivery order.

For important state, retrieve current provider truth:

```ts
const paymentIntent = await retrievePaymentIntent({
  paymentIntentId,
  stripeAccountId: event.account ?? undefined,
});
```

Then reconcile:

```text
provider object current status
  → provider mirror upsert
  → domain transition eligibility
  → conditional local update
```

This makes handlers resilient to out-of-order delivery.

## Connect account scope

For connected-account objects, preserve `event.account`.

Every subsequent provider read must use the same connected-account scope.

Store:

```text
stripeAccountId
providerObjectId
livemode
```

Do not retrieve a connected-account PaymentIntent using the platform account by accident.

## Settlement transaction

```ts
export async function settleInvoicePaymentTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    invoiceId: string;
    paymentAttemptId: string;
    stripePaymentIntentId: string;
    amountCents: number;
    currency: string;
    stripeEventId: string;
    now: Date;
  },
): Promise<SettledPaymentRecord> {
  const attempt = await tx.paymentAttempt.findFirst({
    where: {
      id: input.paymentAttemptId,
      organizationId: input.organizationId,
      invoiceId: input.invoiceId,
      expectedAmountCents: input.amountCents,
      currency: input.currency,
    },
    select: {
      id: true,
      invoiceVersion: true,
      status: true,
    },
  });

  if (!attempt) {
    throw new ApplicationError(
      "CONFLICT",
      "Payment attempt does not match the invoice.",
    );
  }

  const payment = await tx.payment.upsert({
    where: {
      stripePaymentIntentId: input.stripePaymentIntentId,
    },
    create: {
      organizationId: input.organizationId,
      invoiceId: input.invoiceId,
      paymentAttemptId: attempt.id,
      stripePaymentIntentId: input.stripePaymentIntentId,
      amountCents: input.amountCents,
      currency: input.currency,
      status: "succeeded",
      lastStripeEventId: input.stripeEventId,
      succeededAt: input.now,
    },
    update: {
      status: "succeeded",
      lastStripeEventId: input.stripeEventId,
      succeededAt: input.now,
    },
    select: paymentSelect,
  });

  const invoiceUpdated = await tx.invoice.updateMany({
    where: {
      id: input.invoiceId,
      organizationId: input.organizationId,
      version: attempt.invoiceVersion,
      status: {
        in: ["issued", "payment_pending"],
      },
    },
    data: {
      status: "paid",
      paidAt: input.now,
      version: {
        increment: 1,
      },
    },
  });

  if (invoiceUpdated.count !== 1) {
    throw new ApplicationError(
      "CONFLICT",
      "Invoice state does not match the payment attempt.",
    );
  }

  await tx.paymentAttempt.update({
    where: {
      id: attempt.id,
    },
    data: {
      status: "succeeded",
      stripePaymentIntentId: input.stripePaymentIntentId,
    },
  });

  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorType: "system",
      entityType: "Payment",
      entityId: payment.id,
      eventName: "payment.succeeded",
      metadata: {
        stripeEventId: input.stripeEventId,
      },
    },
  });

  await tx.outboxEvent.create({
    data: {
      organizationId: input.organizationId,
      topic: "invoice.payment-received",
      aggregateType: "Invoice",
      aggregateId: input.invoiceId,
      payload: {
        invoiceId: input.invoiceId,
        paymentId: payment.id,
      },
      availableAt: input.now,
    },
  });

  return payment;
}
```

The transaction is idempotent through unique provider IDs and upserts.

## Outbox worker

Email is not part of payment settlement truth.

```text
payment transaction:
  payment succeeded
  invoice paid
  audit event
  outbox event
  commit

outbox worker:
  claim message
  send email
  mark delivered
  retry independently
```

A failed email must not make the payment webhook appear unprocessed.

## Recovery job

A scheduled recovery worker should scan:

```text
processing events with expired leases
failed events whose nextAttemptAt <= now
received events never processed
```

It reclaims them using the same lease mechanism.

A 200 response for an already-busy event is safe only because the event is durably recorded and stale leases are recoverable. Without recovery, return a retriable non-2xx response instead of pretending the event is handled.

## Retry policy

Persist:

```text
attemptCount
nextAttemptAt
failureCode
failureMessage
```

Classify failures:

```text
retryable:
  provider timeout
  temporary database outage
  serialization conflict
  rate limit

terminal:
  malformed metadata
  impossible tenant mapping
  unsupported currency
  invariant contradiction requiring operator review
```

Terminal events should remain visible in an operational console rather than retry forever.

## Exactly-once language

Do not claim exactly-once webhook processing.

The correct contract is:

> Webhook delivery and processing are at least once. Handlers are idempotent, leases prevent concurrent ownership, and reconciliation repairs partial failure.

The inbox coordinates execution. It cannot create a distributed transaction across Stripe, PostgreSQL, email, and every other service.

## Tests

### Signature tests

- Missing signature returns 400
- Invalid signature returns 400
- Raw body reaches provider verification unchanged

### Inbox tests

- Duplicate provider event creates one row
- Processed duplicate returns success without side effects
- Failed event can be reclaimed
- Active lease cannot be concurrently claimed
- Expired lease can be reclaimed
- Stale worker cannot finalize after losing lock token

### Reconciliation tests

- Duplicate event does not duplicate payment
- Separate events for the same PaymentIntent do not duplicate payment
- Out-of-order event retrieves current provider truth
- Amount mismatch refuses settlement
- Currency mismatch refuses settlement
- Invoice version mismatch enters reconciliation review
- Connected-account event uses correct account scope
- Transaction rollback does not emit outbox work
- Outbox delivery failure does not roll back payment
- Crash after payment commit remains recoverable

Use real PostgreSQL for lease and concurrency tests.

## Golden webhook checklist

```text
[ ] Raw body signature is verified before parsing
[ ] Provider event ID is durably unique
[ ] Receipt is persisted before processing
[ ] Processing uses lockedAt/leaseExpiresAt, not receivedAt
[ ] Claim is atomic
[ ] Finalization requires the current lock token
[ ] Duplicate and concurrent delivery are safe
[ ] Handlers are idempotent by provider object ID
[ ] Important state is reconciled from provider truth
[ ] Connected-account scope is preserved
[ ] Primary state, audit, and outbox commit together
[ ] Email and other secondary effects run from outbox
[ ] Recovery job reclaims stale and failed events
[ ] Integration tests inject crashes and concurrency
```

## Compressed canonical form

```ts
export async function processProviderWebhook(
  input: VerifiedProviderEvent,
): Promise<WebhookProcessResult> {
  const receipt = await recordWebhookEvent(input);

  const lease = await claimWebhookLease(receipt.id);

  if (lease.kind !== "claimed") {
    return mapExistingLeaseResult(lease);
  }

  try {
    await reconcileProviderEvent({
      event: input.event,
      webhookEventId: receipt.id,
    });

    await finalizeWebhookProcessed({
      webhookEventId: receipt.id,
      lockToken: lease.lockToken,
    });

    return {
      status: "processed",
    };
  } catch (error) {
    await finalizeWebhookFailed({
      webhookEventId: receipt.id,
      lockToken: lease.lockToken,
      error,
    });

    throw error;
  }
}
```

Verify it, record it, lease it, reconcile it, commit durable consequences, and then acknowledge it. Do not let a random provider retry become the most powerful action in your application.
