import { z } from "zod";

import {
  withProviderOrganizationTransaction,
  withProviderTransaction,
} from "@/lib/db/provider";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
  failWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { verifySendGridWebhook } from "@/lib/integrations/sendgrid/webhooks";

const eventSchema = z.array(
  z
    .object({
      event: z.string(),
      sg_event_id: z.string(),
      sg_message_id: z.string().optional(),
      organizationId: z.string().uuid(),
    })
    .passthrough(),
);

export async function POST(request: Request) {
  const payload = await request.text();
  try {
    const verified = verifySendGridWebhook(
      payload,
      request.headers.get("x-twilio-email-event-webhook-signature"),
      request.headers.get("x-twilio-email-event-webhook-timestamp"),
    );
    if (!verified)
      return Response.json(
        { error: "Invalid SendGrid webhook signature." },
        { status: 400 },
      );
    const events = eventSchema.parse(JSON.parse(payload));
    for (const event of events) {
      let webhookEventId: string | null = null;
      try {
        webhookEventId = await withProviderTransaction((tx) =>
          claimWebhookEventTx(tx, {
            provider: "sendgrid",
            eventId: event.sg_event_id,
            type: event.event,
            payload: JSON.stringify(event),
            organizationId: event.organizationId,
          }),
        );
        if (!webhookEventId) continue;
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
          },
        );
        await withProviderTransaction((tx) =>
          completeWebhookEventTx(tx, webhookEventId!),
        );
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "SendGrid event failed.";
        if (webhookEventId)
          await withProviderTransaction((tx) =>
            failWebhookEventTx(tx, webhookEventId!, message),
          );
        throw cause;
      }
    }
    return Response.json({ received: true });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "SendGrid webhook failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
