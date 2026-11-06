import {
  projectClerkUser,
  type verifyClerkWebhook,
} from "@/lib/auth/clerkWebhooks";
import { withProviderTransaction } from "@/lib/db/rls";
import {
  anonymizeClerkUserTx,
  syncClerkUserTx,
} from "@/lib/db/transactions/clerkUserTx";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "@/lib/db/transactions/webhookEventTx";
import "server-only";

// Trusted provider persistence; deliberately not a browser-callable Server Action.

export { WebhookIdentityConflictError } from "@/lib/db/transactions/webhookEventTx";
export async function processClerkWebhook(
  event: Awaited<ReturnType<typeof verifyClerkWebhook>>,
  eventId: string,
  payload: string,
) {
  const webhookEventId = await withProviderTransaction((tx) =>
    claimWebhookEventTx(tx, {
      provider: "clerk",
      eventId,
      type: event.type,
      payload,
    }),
  );
  if (!webhookEventId) return false;

  try {
    await withProviderTransaction(async (tx) => {
      if (event.type === "user.created" || event.type === "user.updated") {
        await syncClerkUserTx(tx, projectClerkUser(event.data));
      } else if (event.type === "user.deleted" && event.data.id) {
        await anonymizeClerkUserTx(tx, event.data.id);
      }

      await completeWebhookEventTx(tx, webhookEventId);
    });
    return true;
  } catch (error) {
    try {
      await withProviderTransaction((tx) =>
        failWebhookEventTx(tx, webhookEventId, "processing_failed"),
      );
    } catch (recordingError) {
      throw new AggregateError(
        [error, recordingError],
        "Clerk webhook processing and failure recording both failed.",
      );
    }
    throw error;
  }
}
