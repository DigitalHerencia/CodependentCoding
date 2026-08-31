import {
  withProviderOrganizationTransaction,
  withProviderTransaction,
} from "@/lib/db/provider";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { getBillingSubscriptionInputFromEvent } from "@/lib/integrations/stripe/subscriptions";
import { verifyStripeWebhook } from "@/lib/integrations/stripe/webhooks";

export async function POST(request: Request) {
  let webhookEventId: string | null = null;
  try {
    const payload = await request.text();
    const event = verifyStripeWebhook(
      payload,
      request.headers.get("stripe-signature"),
    );
    const input = getBillingSubscriptionInputFromEvent(event);
    const organizationId = input?.organizationId ?? null;
    webhookEventId = await withProviderTransaction((tx) =>
      claimWebhookEventTx(tx, {
        provider: "stripe",
        eventId: event.id,
        type: event.type,
        payload,
        organizationId,
      }),
    );
    if (!webhookEventId)
      return Response.json({ received: true, duplicate: true });

    if (input) {
      await withProviderOrganizationTransaction(input.organizationId, (tx) =>
        tx.billingSubscription.upsert({
          where: { organizationId: input.organizationId },
          create: input,
          update: input,
        }),
      );
    }
    await withProviderTransaction((tx) =>
      completeWebhookEventTx(tx, webhookEventId!),
    );
    return Response.json({ received: true });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Stripe webhook failed.";
    if (webhookEventId)
      await withProviderTransaction((tx) =>
        failWebhookEventTx(tx, webhookEventId!, message),
      );
    return Response.json(
      { error: message },
      { status: webhookEventId ? 500 : 400 },
    );
  }
}
