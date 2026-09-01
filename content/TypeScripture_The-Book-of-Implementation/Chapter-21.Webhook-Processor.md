# Chapter 21: Webhook Processor

**The Book of Implementation™**

## Canonical separation

The Next.js route and the provider webhook helper are different concerns.

```text
provider
  -> app/api/<provider>/webhooks/route.ts
  -> lib/integrations/<provider>/webhooks.ts
  -> application/database operations
```

`route.ts` exists because Next.js needs an HTTP endpoint. It owns the request/response boundary: receive the request, preserve the raw body when signature verification requires it, obtain the required headers, call the provider-specific verification/processing helper, and return the appropriate HTTP response.

`lib/integrations/<provider>/webhooks.ts` owns provider-specific webhook mechanics and helpers used by the route. It should not become a second HTTP route.

Clerk is the concern-first exception: Clerk-specific webhook helpers may live under `lib/auth` when they are genuinely authentication/identity helpers rather than generic integration infrastructure.

## Security and reliability

Webhook signatures must be verified according to the provider's requirements before trusting event contents. External events can be duplicated, replayed, delayed, concurrent, or out of order, so consequential processing must be designed for idempotent effects where appropriate. Database facts that must commit together belong in transaction helpers; network calls should not be held open inside a database transaction.

When `(provider, eventId)` is the durable idempotency identity, a previously stored event must retain the same verified event type and payload hash. A different type or payload for the same identity is rejected. Reclaiming a failed or stale event changes processing state; it does not rewrite event identity.

Routes return sanitized, classified HTTP failures. Invalid signature/payload, unauthenticated, unauthorized, conflict/rate-limit, and unexpected processing failures keep distinct semantics. Do not return raw provider/internal exception messages to the caller.

## Golden route shape

```ts
export async function POST(request: Request) {
  const rawBody = await request.text();
  let event;

  try {
    event = verifyProviderWebhook(rawBody, request.headers);
  } catch {
    return Response.json({ error: "Invalid webhook." }, { status: 400 });
  }

  try {
    const processed = await processProviderWebhook(event, rawBody);
    return Response.json({ received: true, duplicate: !processed });
  } catch (error) {
    if (error instanceof WebhookIdentityConflictError) {
      return Response.json(
        { error: "Webhook event identity conflict." },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
```

The exact provider mechanics vary, but the boundary stays the same: thin HTTP route, provider-specific helper, then established application operations.

## Durable processing lifecycle

The claim commits before processing begins so a crash or processing failure remains observable. Provider-derived local effects and completion commit atomically; failure is then recorded in a separate transaction so a later delivery can retry the same immutable event identity.

```ts
const webhookEventId = await withProviderTransaction((tx) =>
  claimWebhookEventTx(tx, identity),
);
if (!webhookEventId) return false;

try {
  await withProviderTransaction(async (tx) => {
    await applyVerifiedEventTx(tx, event);
    await completeWebhookEventTx(tx, webhookEventId);
  });
  return true;
} catch (error) {
  await withProviderTransaction((tx) =>
    failWebhookEventTx(tx, webhookEventId, "processing_failed"),
  );
  throw error;
}
```

If failure recording can also fail, preserve evidence of both failures rather than silently replacing the original processing error.
