import "server-only";

import {
  withProviderOrganizationTransaction,
  withProviderTransaction,
} from "@/lib/db/rls";
import type { getBillingSubscriptionInputFromEvent } from "@/lib/integrations/stripe/subscriptions";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "./webhook-event.tx";

type BillingSubscriptionInput = NonNullable<
  ReturnType<typeof getBillingSubscriptionInputFromEvent>
>;

/** Claims a verified Stripe event once, applies its billing projection, and records the outcome. */
export async function recordStripeWebhookTx(
  event: { id: string; type: string },
  payload: string,
  input: BillingSubscriptionInput | null,
) {
  const webhookEventId = await withProviderTransaction((tx) =>
    claimWebhookEventTx(tx, {
      provider: "stripe",
      eventId: event.id,
      type: event.type,
      payload,
      organizationId: input?.organizationId ?? null,
    }),
  );
  if (!webhookEventId) return false;

  try {
    if (input) {
      await withProviderOrganizationTransaction(
        input.organizationId,
        async (tx) => {
          await tx.billingSubscription.upsert({
            where: { organizationId: input.organizationId },
            create: input,
            update: input,
          });
          await completeWebhookEventTx(tx, webhookEventId);
        },
      );
    } else {
      await withProviderTransaction((tx) =>
        completeWebhookEventTx(tx, webhookEventId),
      );
    }
    return true;
  } catch (error) {
    try {
      await withProviderTransaction((tx) =>
        failWebhookEventTx(tx, webhookEventId, "processing_failed"),
      );
    } catch (recordingError) {
      throw new AggregateError(
        [error, recordingError],
        "Stripe webhook processing and failure recording both failed.",
      );
    }
    throw error;
  }
}
