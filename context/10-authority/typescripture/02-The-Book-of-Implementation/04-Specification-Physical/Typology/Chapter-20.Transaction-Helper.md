---
title: Hipster Stack Golden Transaction Helper Pattern
type: reference
scope: domain
project:
domain: hipsterstack
artifact: transaction-helper
kind: reference
namespace: hipsterstack.patterns.transaction-helper.reference
status: review
authority: working-note
parent: "[[hipsterstack.patterns.catalog.map]]"
depends_on:
  - "[[hipsterstack.engineering-system.definition.source-document]]"
supersedes: []
tags:
  - tech-stack/hipsterstack
  - architecture/transactions
  - patterns/canonical
  - status/review
created: 2026-08-03
updated: 2026-08-05
---

# Canonical Pattern 004: The Golden Transaction Helper

A transaction helper defines the database changes that must succeed or fail as one unit.

It is not a generic function with `Tx` appended to the name while accepting the root Prisma client, calling Stripe, sending an email, and hoping the suffix creates atomicity through intimidation.

## Canonical flow

```text
validated use-case state
        ↓
transaction runner
        ↓
read rows required for mutation
        ↓
enforce database-adjacent invariant
        ↓
conditional write
        ↓
audit / outbox write
        ↓
commit
```

## Responsibilities

A golden transaction helper owns:

- Atomic PostgreSQL reads and writes
- Conditional mutation predicates
- Optimistic concurrency checks
- Database-adjacent invariants
- Audit or outbox records that must commit with the primary state
- Returning a minimal persistence result

It does not own:

- Clerk session resolution
- React
- Next.js navigation or cache invalidation
- Stripe or any network call
- Email delivery
- Raw `FormData`
- User-facing error formatting
- Broad application workflow sequencing

## Transaction client only

```ts
import type { Prisma } from "@/prisma/generated/prisma/client";

export async function archiveProjectTx(
  tx: Prisma.TransactionClient,
  input: ArchiveProjectTxInput,
): Promise<ArchivedProjectRecord> {
  // ...
}
```

Do not accept:

```ts
type Writer = PrismaClient | Prisma.TransactionClient;
```

That type allows callers to invoke a supposedly transactional helper without a transaction.

If a helper is safe both inside and outside a transaction, it is a command—not a transaction helper.

## Serializable transaction runner

Concurrency-sensitive operations should use a reusable runner that retries PostgreSQL serialization conflicts.

```ts
// lib/db/transactions/run-serializable.ts

import { Prisma } from "@/prisma/generated/prisma/client";

import { prisma } from "@/lib/db/prisma";

const DEFAULT_MAX_ATTEMPTS = 3;

function isRetryableTransactionError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  );
}

function getRetryDelayMs(attempt: number): number {
  const base = 25 * 2 ** (attempt - 1);
  const jitter = Math.floor(Math.random() * 25);
  return base + jitter;
}

export async function runSerializableTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    maxAttempts?: number;
  },
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const mayRetry =
        attempt < maxAttempts && isRetryableTransactionError(error);

      if (!mayRetry) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, getRetryDelayMs(attempt)),
      );
    }
  }

  throw new Error("UNREACHABLE_TRANSACTION_RETRY_STATE");
}
```

Only retry errors known to represent a safe transaction retry.

Do not retry arbitrary programming errors, validation failures, or authorization failures.

## Optimistic concurrency

Add a version column to mutable domain records.

```prisma
model Project {
  id             String        @id @default(cuid())
  organizationId String
  status         ProjectStatus
  version        Int           @default(1)
  archivedAt     DateTime?
  updatedAt      DateTime      @updatedAt
}
```

Then mutate conditionally:

```ts
const updated = await tx.project.updateMany({
  where: {
    id: input.projectId,
    organizationId: input.organizationId,
    version: input.expectedVersion,
    status: {
      not: "archived",
    },
  },
  data: {
    status: "archived",
    archivedAt: input.now,
    version: {
      increment: 1,
    },
  },
});

if (updated.count !== 1) {
  throw new ApplicationError(
    "CONFLICT",
    "The project changed before it could be archived.",
  );
}
```

This prevents stale state from silently overwriting newer state.

## The golden simple transaction helper

```ts
// lib/db/transactions/archive-project.tx.ts

import type { Prisma } from "@/prisma/generated/prisma/client";

import { ApplicationError } from "@/lib/errors/application-error";

const archivedProjectSelect = {
  id: true,
  organizationId: true,
  name: true,
  status: true,
  version: true,
  archivedAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

export type ArchivedProjectRecord = Prisma.ProjectGetPayload<{
  select: typeof archivedProjectSelect;
}>;

export async function archiveProjectTx(
  tx: Prisma.TransactionClient,
  input: {
    projectId: string;
    organizationId: string;
    expectedVersion: number;
    actorUserId: string;
    now: Date;
  },
): Promise<ArchivedProjectRecord> {
  const updated = await tx.project.updateMany({
    where: {
      id: input.projectId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
      status: {
        not: "archived",
      },
    },
    data: {
      status: "archived",
      archivedAt: input.now,
      version: {
        increment: 1,
      },
    },
  });

  if (updated.count !== 1) {
    throw new ApplicationError(
      "CONFLICT",
      "The project could not be archived from its current state.",
    );
  }

  const project = await tx.project.findUniqueOrThrow({
    where: {
      id: input.projectId,
    },
    select: archivedProjectSelect,
  });

  await tx.auditEvent.create({
    data: {
      organizationId: project.organizationId,
      actorUserId: input.actorUserId,
      entityType: "Project",
      entityId: project.id,
      eventName: "project.archived",
      metadata: {
        version: project.version,
      },
      createdAt: input.now,
    },
  });

  return project;
}
```

The audit event commits with the state change.

## The golden reservation transaction

Capacity is a concurrency invariant.

Two users can both read one remaining slot and then both insert. A transaction must make one of them lose.

```ts
// lib/db/transactions/reserve-booking-slot.tx.ts

import type { Prisma } from "@/prisma/generated/prisma/client";

export async function reserveBookingSlotTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    customerUserId: string;
    serviceId: string;
    startsAt: Date;
    endsAt: Date;
    now: Date;
  },
): Promise<ReservedBookingRecord> {
  const rule = await tx.availabilityRule.findFirst({
    where: {
      organizationId: input.organizationId,
      deletedAt: null,
      dayOfWeek: getLocalDayOfWeek(input.startsAt),
    },
    select: {
      id: true,
      capacity: true,
    },
  });

  if (!rule) {
    throw new ApplicationError(
      "CONFLICT",
      "No availability exists for this time.",
    );
  }

  const activeOverlapCount = await tx.booking.count({
    where: {
      organizationId: input.organizationId,
      deletedAt: null,
      startsAt: {
        lt: input.endsAt,
      },
      endsAt: {
        gt: input.startsAt,
      },
      OR: [
        {
          status: {
            in: ["confirmed", "completed"],
          },
        },
        {
          status: "reserved",
          reservationExpiresAt: {
            gt: input.now,
          },
        },
      ],
    },
  });

  if (activeOverlapCount >= rule.capacity) {
    throw new ApplicationError(
      "CONFLICT",
      "The selected time is no longer available.",
    );
  }

  const existingCustomerConflict = await tx.booking.findFirst({
    where: {
      organizationId: input.organizationId,
      customerUserId: input.customerUserId,
      deletedAt: null,
      startsAt: {
        lt: input.endsAt,
      },
      endsAt: {
        gt: input.startsAt,
      },
      status: {
        in: ["reserved", "confirmed", "completed"],
      },
    },
    select: {
      id: true,
    },
  });

  if (existingCustomerConflict) {
    throw new ApplicationError(
      "CONFLICT",
      "You already have a booking during this time.",
    );
  }

  return tx.booking.create({
    data: {
      organizationId: input.organizationId,
      customerUserId: input.customerUserId,
      serviceId: input.serviceId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      status: "reserved",
      reservationExpiresAt: addMinutes(input.now, 15),
    },
    select: bookingReservationSelect,
  });
}
```

Run this helper through `runSerializableTransaction()`.

The isolation level and retry behavior belong to the runner, not duplicated across every booking function.

## Outbox inside the transaction

Secondary effects that must eventually happen should be recorded atomically.

```ts
await tx.outboxEvent.create({
  data: {
    organizationId: booking.organizationId,
    topic: "booking.reserved",
    aggregateType: "Booking",
    aggregateId: booking.id,
    payload: {
      bookingId: booking.id,
      customerUserId: booking.customerUserId,
    },
    availableAt: input.now,
  },
});
```

The worker sends email or publishes events after the transaction commits.

Do not send email from inside the database transaction. A slow email request lengthens locks and can cause the entire transaction to roll back for an unrelated provider failure.

## Domain invariant versus database invariant

Use a transaction helper for invariants involving concurrent persisted state:

```text
slot capacity
unique claim
state transition from expected version
balance update
membership uniqueness
idempotency record
```

Use a pure domain policy for decisions that do not require persistence:

```text
is this transition allowed?
is this amount valid?
does this role imply this capability?
is this date within the configured window?
```

The workflow composes both.

## Naming

Use names that reveal atomic intent:

```text
archiveProjectTx
reserveBookingSlotTx
claimWebhookEventTx
settleInvoicePaymentTx
changeMembershipRoleTx
```

Avoid:

```text
updateStuffTx
saveProjectTx
transactionHelper
dbUtils
```

## Tests

Transaction helpers require real PostgreSQL integration tests.

Mock-based tests cannot prove:

- Isolation behavior
- Unique constraints
- Foreign keys
- Check constraints
- RLS behavior
- Concurrent update conflicts
- Serialization retries
- Atomic rollback

Critical tests:

```text
two concurrent reservations for the final slot
two concurrent customer claims for one resource
stale version update loses
audit event rolls back when primary write fails
primary write rolls back when audit insert fails
P2034 retry succeeds
maximum retry exhaustion propagates
tenant A cannot mutate tenant B
```

## Golden transaction checklist

```text
[ ] Function accepts Prisma.TransactionClient only
[ ] No network or provider imports exist
[ ] No Clerk or Next.js imports exist
[ ] Atomic invariant is stated explicitly
[ ] Conditional mutation detects stale or illegal state
[ ] Multi-record writes commit or roll back together
[ ] Audit/outbox records commit with primary state
[ ] Serializable operations use the shared retry runner
[ ] Return shape is minimal
[ ] Real PostgreSQL integration tests cover concurrency
```

## Compressed canonical form

```ts
export async function mutateThingTx(
  tx: Prisma.TransactionClient,
  input: MutateThingTxInput,
): Promise<ThingRecord> {
  const changed = await tx.thing.updateMany({
    where: {
      id: input.id,
      organizationId: input.organizationId,
      version: input.expectedVersion,
      status: input.expectedStatus,
    },
    data: {
      status: input.nextStatus,
      version: {
        increment: 1,
      },
    },
  });

  if (changed.count !== 1) {
    throw new ApplicationError("CONFLICT", "Thing changed.");
  }

  const thing = await tx.thing.findUniqueOrThrow({
    where: {
      id: input.id,
    },
    select: thingMutationSelect,
  });

  await tx.auditEvent.create({
    data: buildThingAuditEvent(thing, input),
  });

  return thing;
}
```

A transaction helper protects an atomic database fact. It does not tour the entire application while the transaction waits with the doors locked.
