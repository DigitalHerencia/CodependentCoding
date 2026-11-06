import { recordSendGridWebhookEventsTx } from "@/lib/db/transactions/emailRecordSendgridWebhookTx";
import "server-only";

// Trusted provider persistence; deliberately not a browser-callable Server Action.

export { WebhookIdentityConflictError } from "@/lib/db/transactions/webhookEventTx";
export async function recordSendGridWebhookEvents(
  ...args: Parameters<typeof recordSendGridWebhookEventsTx>
) {
  return recordSendGridWebhookEventsTx(...args);
}
