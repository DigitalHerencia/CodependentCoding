import {
  recordStripeWebhook,
  WebhookIdentityConflictError,
} from "@/lib/actions/billingWebhookActions";
import { getBillingSubscriptionInputFromEvent } from "@/lib/integrations/stripe/subscriptions";
import { verifyStripeWebhook } from "@/lib/integrations/stripe/webhooks";
import "server-only";

export async function handleStripeWebhookWorkflow(
  payload: string,
  signature: string | null,
) {
  let event;

  try {
    event = verifyStripeWebhook(payload, signature);
  } catch {
    return Response.json(
      { error: "Invalid Stripe webhook signature." },
      { status: 400 },
    );
  }

  try {
    const processed = await recordStripeWebhook(
      event,
      payload,
      getBillingSubscriptionInputFromEvent(event),
    );

    return Response.json({ received: true, duplicate: !processed });
  } catch (error) {
    if (error instanceof WebhookIdentityConflictError) {
      return Response.json(
        { error: "Stripe webhook event identity conflict." },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Stripe webhook processing failed." },
      { status: 500 },
    );
  }
}
