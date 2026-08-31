# Chapter 21: Webhook Processor

**The Book of Implementation™**

## Canonical boundaries

```text
app/api/.../route.ts          verify raw request + adapt HTTP
lib/webhooks/inbox.*          durable receipt/claim/finalize
lib/webhooks/<provider>/      event dispatch + reconciliation
lib/integrations/<provider>/  provider retrieval/normalization
lib/db/transactions/          atomic local settlement/outbox
```

## Route skeleton

```ts
export async function POST(request: Request) {
  const rawBody = await request.text();
  const event = verifyProviderWebhook(rawBody, request.headers);
  await recordWebhookReceipt(toBoundedWebhookEnvelope(event));
  return new Response(null, { status: 200 });
}
```

## Testing

- Signature failure, duplicate receipt, concurrent claim, active lease, expired lease, stale worker finalization, out-of-order delivery, idempotent reconciliation, provider retrieval, and cross-tenant/provider-account scope.
