---
title: Integrations, Webhooks and Background Work
slug: integrations
order: 8
summary: Provider boundaries, provider truth versus application truth, the two webhook tiers, cron, after(), durable workflows, and idempotency everywhere.
rules:
  [
    CC-CRON-001,
    CC-CRON-002,
    CC-HOOK-001,
    CC-HOOK-002,
    CC-HOOK-003,
    CC-HOOK-004,
    CC-HOOK-005,
    CC-INT-001,
    CC-INT-002,
    CC-INT-003,
    CC-INT-004,
    CC-JOB-001,
    CC-JOB-002,
    CC-JOB-003,
    CC-JOB-004,
  ]
---

# Integrations, Webhooks and Background Work

## Provider boundary

```text
lib/integrations/
├── status.ts                 configured | missing-secret, live | demo — names only, admin-only
├── stripe/      client.ts checkout.ts portal.ts subscriptions.ts webhooks.ts
├── sendgrid/    client.ts email.ts webhooks.ts
├── cloudinary/  client.ts transformations.ts upload.ts
├── hugging-face/ client.ts embeddings.ts inference.ts
├── upstash/     ratelimit.ts
└── vercel-blob/ upload.ts download.ts delete.ts
```

Only the providers chosen at generation exist. Each has its folder, its `lib/env/<owner>.ts`, and its module registry entry.

> **CC-INT-001** · `now` · `codependent/layer-boundaries`
> Integrations never persist. They build requests, call the provider, verify signatures, normalize responses, and return plain data.

> **CC-INT-002** · `now` · `codependent/sdk-boundary`
> A provider SDK is imported only inside its `lib/integrations/<provider>/` folder. Clerk is imported only in `lib/auth`; Prisma and Neon only in `lib/db` and `prisma/`.
> Classification follows what the technology does in this architecture, not who sells it.

> **CC-INT-003** · `now` · review
> Every provider write carries a stable idempotency key derived from our record (`invoice:<id>:send`), so a retry cannot double-charge, double-send or double-upload.

> **CC-INT-004** · `now` · review
> `status.ts` reports names and states, never values, and is reachable only from an admin route.

**Provider truth versus application truth.** Stripe owns whether money moved and what a subscription's state is. Clerk owns verified identity and session. The application owns the **consequence**: entitlements, memberships, roles, tenant relationships, lifecycle states. Provider mechanics are adapted at the boundary and never leak into features, actions or UI.

## Webhooks

The route handler at `app/api/<provider>/webhooks/route.ts` owns the HTTP request lifecycle. Integrations verify and fetch; transaction helpers persist; neither is "the webhook".

Provider events are notifications, not commands. Assume duplicates, retries, concurrent delivery, delay, and out-of-order arrival.

> **CC-HOOK-001** · `now` · `codependent/layer-boundaries`
> Route handlers import no Prisma client, no provider SDK, no Clerk server API, and no presentation.

> **CC-HOOK-002** · `now` · review
> Verification uses the **raw** body (`await request.text()`), before any parsing, and rejects unsigned or invalid requests with `400`.

> **CC-HOOK-003** · `now` · `unique(provider, eventId)`
> Every delivery is recorded in the inbox (`WebhookEvent`) with a unique `(provider, eventId)` before processing. A duplicate is acknowledged with `200` and not reprocessed.

> **CC-HOOK-004** · `now` · review
> A failure returns `5xx` so the provider retries. Error bodies are generic.

> **CC-HOOK-005** · `now` · review
> Webhook endpoints are never rate-limited.

### Two tiers

| Tier         | Use for                                                   | Path                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Simple**   | low-consequence sync (Clerk user created/updated/deleted) | verify → parse → inbox insert (dedupe) → apply in the same transaction → mark processed → `200`                                                                                                                                                                                                                                                                                                    |
| **Hardened** | anything touching money or entitlements (Stripe)          | verify → parse → inbox receipt → **lease** (`UPDATE … SET leaseToken, leasedUntil WHERE status IN (RECEIVED, FAILED) AND (leasedUntil IS NULL OR leasedUntil < now())`) → classify supported events → for consequential events **re-fetch current provider truth** (outside any transaction) → reconcile local state + audit/outbox row in one transaction → finalize with the lease token → `200` |

Re-fetching is the answer to out-of-order delivery: a `customer.subscription.updated` that arrives after a later `deleted` cannot resurrect a subscription, because the reconciler writes what Stripe says **now**, not what the event said then.

```ts
// app/api/stripe/webhooks/route.ts
import {
  verifyStripeEvent,
  isConsequential,
  fetchSubscriptionTruth,
} from "@/lib/integrations/stripe/webhooks";
import {
  receiveWebhookTx,
  leaseWebhookTx,
  finalizeWebhookTx,
  failWebhookTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { reconcileSubscriptionTx } from "@/lib/db/transactions/billing-reconcile-subscription.tx";
import { withSystemTransaction } from "@/lib/db/system";
import { reportError } from "@/lib/observability/report";

export async function POST(request: Request) {
  const body = await request.text();
  const event = verifyStripeEvent(
    body,
    request.headers.get("stripe-signature"),
  );
  if (!event)
    return Response.json({ error: "invalid signature" }, { status: 400 });

  const receipt = await withSystemTransaction((tx) =>
    receiveWebhookTx(tx, {
      provider: "stripe",
      eventId: event.id,
      type: event.type,
      objectId: event.objectId,
    }),
  );
  if (receipt.duplicate) return Response.json({ received: true });

  const lease = await withSystemTransaction((tx) =>
    leaseWebhookTx(tx, receipt.id),
  );
  if (!lease) return Response.json({ received: true }); // another delivery holds it

  try {
    if (isConsequential(event.type)) {
      const truth = await fetchSubscriptionTruth(event.objectId); // provider call, no transaction open
      await withSystemTransaction((tx) => reconcileSubscriptionTx(tx, truth));
    }
    await withSystemTransaction((tx) =>
      finalizeWebhookTx(tx, receipt.id, lease.token),
    );
    return Response.json({ received: true });
  } catch (cause) {
    reportError(cause, {
      boundary: "webhook",
      provider: "stripe",
      eventId: event.id,
    });
    await withSystemTransaction((tx) =>
      failWebhookTx(tx, receipt.id, lease.token),
    );
    return Response.json({ error: "processing failed" }, { status: 500 });
  }
}
```

```ts
// lib/integrations/stripe/webhooks.ts
import "server-only";
import type Stripe from "stripe";
import { stripe } from "./client";
import { billingEnv } from "@/lib/env/billing";

/** Verifies the raw body; returns a minimized envelope or null. */
export function verifyStripeEvent(body: string, signature: string | null) {
  if (!signature) return null;
  try {
    const event = stripe().webhooks.constructEvent(
      body,
      signature,
      billingEnv().STRIPE_WEBHOOK_SECRET,
    );
    const object = event.data.object as { id?: string };
    return { id: event.id, type: event.type, objectId: object.id ?? "" };
  } catch {
    return null;
  }
}
```

### Signature schemes by provider

| Provider     | Verification                                                                                                                                                                                                              | Raw input                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Clerk (Svix) | `verifyWebhook(request, { signingSecret })` from `@clerk/nextjs/webhooks`                                                                                                                                                 | the `Request` itself (reads the raw body) |
| Stripe       | `stripe.webhooks.constructEvent(body, signature, secret)`; return `400` on failure                                                                                                                                        | `await request.text()`                    |
| SendGrid     | Signed Event Webhook: ECDSA public key, `X-Twilio-Email-Event-Webhook-Signature` + `…-Timestamp` headers, verified with `@sendgrid/eventwebhook` (`EventWebhook.verifySignature`); reject timestamps older than 5 minutes | `await request.text()`                    |
| Hugging Face | shared secret in the `X-Webhook-Secret` header, compared with `timingSafeEqual`                                                                                                                                           | header only; body parsed after            |

The inbox stores the event ID, type, object ID, status, lease columns, error code and a payload **hash** — never the payload. It is the same table the Layer 3 webhook log describes; one table, not two. It is separate from the audit log. Rows older than 30 days are compacted by cron.

`withSystemTransaction` connects as `app_system`, which has grants on the inbox and on exactly the tables reconcilers write; RLS policies admit it by role name.

## Background work

Pick the lowest tier that fits.

| Tier | Mechanism                                                       | Use for                                                                      | Guarantee                                                                                                                                                         |
| ---- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `after()` from `next/server`                                    | logging, analytics, non-critical notifications tied to a request             | best effort; shares the function's timeout and is cancelled with it                                                                                               |
| 2    | Vercel Cron → `app/api/cron/<job>/route.ts`                     | scheduled maintenance (inbox compaction, reminder sweeps)                    | **best effort**: a run can be missed, can fire twice, can overlap the previous run; Vercel does not retry a failed run; invoked against the production deployment |
| 3    | Vercel Workflow (`"use workflow"` / `"use step"`, Workflow SDK) | anything longer than a request, needing retries, waits, or human-in-the-loop | durable, event-sourced steps with automatic retries; no run-duration or sleep limit; Hobby includes 50,000 events and 1 GB written per month                      |

> **CC-JOB-001** · `now` · review
> Nothing that must not be lost runs in `after()`.

> **CC-JOB-002** · `now` · review
> All background work is idempotent (delivery is at-least-once): dedupe with idempotency keys and unique constraints.

> **CC-JOB-003** · `now` · review
> A queued or scheduled payload carries IDs only, and is parsed with Zod when the job starts. Authorization is re-checked when the job runs, through the same wrappers, with an explicit actor and organization; privileged work writes an audit row naming that actor.

> **CC-JOB-004** · `users` · review
> Long jobs write a status row the user can see (`QUEUED | RUNNING | DONE | FAILED` + safe message). Failures retry with backoff to a cap, then land in `FAILED` and report to observability.

> **CC-CRON-002** · `now` · review
> Every cron job is a reconciler, not an event: it processes "all outstanding work since the last successful run" (stored in a `JobRun` row), so a missed run is caught up by the next and a duplicate run finds nothing left to do. Jobs that can outlast their interval take an Upstash lock (`SET key NX PX`) before starting.

> **CC-CRON-001** · `now` · `codependent/cron-auth`
> A cron handler compares `Authorization` to `Bearer ${CRON_SECRET}` with `timingSafeEqual` and returns `new Response(null, { status: 401 })` on mismatch. `CRON_SECRET` exists in Production only.

```ts
// app/api/cron/compact-webhooks/route.ts
import { timingSafeEqual } from "node:crypto";
import { cronEnv } from "@/lib/env/cron";
import { compactWebhookInboxTx } from "@/lib/db/transactions/webhook-event.tx";
import { withSystemTransaction } from "@/lib/db/system";

function authorized(header: string | null) {
  const expected = Buffer.from(`Bearer ${cronEnv().CRON_SECRET}`);
  const actual = Buffer.from(header ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  if (!authorized(request.headers.get("authorization")))
    return new Response(null, { status: 401 });
  const removed = await withSystemTransaction((tx) =>
    compactWebhookInboxTx(tx, { olderThanDays: 30 }),
  );
  return Response.json({ removed });
}
```

Hobby cron jobs run at most once a day, at any minute within the scheduled hour; paid plans run within the scheduled minute. Moving to a paid plan is a `users`-tier item (Chapter 13), not a design change.
