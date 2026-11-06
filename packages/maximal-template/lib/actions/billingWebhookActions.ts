import { recordStripeWebhookTx } from "@/lib/db/transactions/billingRecordStripeWebhookTx";
import "server-only";

// Trusted provider persistence; deliberately not a browser-callable Server Action.

export { WebhookIdentityConflictError } from "@/lib/db/transactions/webhookEventTx";
export async function recordStripeWebhook(
  ...args: Parameters<typeof recordStripeWebhookTx>
) {
  return recordStripeWebhookTx(...args);
}
