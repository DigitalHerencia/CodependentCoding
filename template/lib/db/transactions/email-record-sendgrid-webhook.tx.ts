import "server-only";

import type { z } from "zod";

import {
  withProviderOrganizationTransaction,
  withProviderTransaction,
} from "@/lib/db/rls";
import type { sendGridWebhookEventsSchema } from "@/schemas/integrationSchemas";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "./webhook-event.tx";

/** Claims each verified SendGrid event once, writes its audit event, and records the outcome. */
export async function recordSendGridWebhookEventsTx(
  events: z.infer<typeof sendGridWebhookEventsSchema>,
) {
  for (const event of events) {
    const webhookEventId = await withProviderTransaction((tx) =>
      claimWebhookEventTx(tx, {
        provider: "sendgrid",
        eventId: event.sg_event_id,
        type: event.event,
        payload: JSON.stringify(event),
        organizationId: event.organizationId,
      }),
    );
    if (!webhookEventId) continue;

    try {
      await withProviderOrganizationTransaction(
        event.organizationId,
        async (tx) => {
          await tx.auditEvent.create({
            data: {
              organizationId: event.organizationId,
              action: `email.${event.event}`,
              resourceType: "email",
              resourceId: event.sg_message_id ?? null,
            },
          });
          await completeWebhookEventTx(tx, webhookEventId);
        },
      );
    } catch (error) {
      try {
        await withProviderTransaction((tx) =>
          failWebhookEventTx(tx, webhookEventId, "processing_failed"),
        );
      } catch (recordingError) {
        throw new AggregateError(
          [error, recordingError],
          "SendGrid webhook processing and failure recording both failed.",
        );
      }
      throw error;
    }
  }
}
