import { withProviderTransaction } from "@/lib/db/provider";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { getBillingSubscriptionInputFromEvent } from "@/lib/integrations/stripe/subscriptions";
import { verifyStripeWebhook } from "@/lib/integrations/stripe/webhooks";

export async function POST(request: Request) {
  const payload = await request.text();
  let event;

  try {
    event = verifyStripeWebhook(
      payload,
      request.headers.get("stripe-signature"),
    );
  } catch {
    return Response.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }

  try {
    const input = getBillingSubscriptionInputFromEvent(event);
    const organizationId = input?.organizationId ?? null;
    const processed = await withProviderTransaction(async (tx) => {
      const webhookEventId = await claimWebhookEventTx(tx, {
        provider: "stripe",
        eventId: event.id,
        type: event.type,
        payload,
        organizationId,
      });
      if (!webhookEventId) return false;

      if (input) {
        await tx.$executeRaw`SELECT set_config('app.organization_id', ${input.organizationId}, true)`;
        await tx.billingSubscription.upsert({
          where: { organizationId: input.organizationId },
          create: input,
          update: input,
        });
      }
      await completeWebhookEventTx(tx, webhookEventId);
      return true;
    });

    return Response.json({ received: true, duplicate: !processed });
  } catch {
    return Response.json(
      { error: "Stripe webhook processing failed." },
      { status: 500 },
    );
  }
}
