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

## Golden route shape

```ts
export async function POST(request: Request) {
  const rawBody = await request.text();
  const event = verifyProviderWebhook(rawBody, request.headers);
  await processProviderWebhook(event);
  return new Response(null, { status: 200 });
}
```

The exact provider mechanics vary, but the boundary stays the same: thin HTTP route, provider-specific helper, then established application operations.
