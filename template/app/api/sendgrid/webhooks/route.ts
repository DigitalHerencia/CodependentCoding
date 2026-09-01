import { withProviderTransaction } from "@/lib/db/provider";
import {
  claimWebhookEventTx,
  completeWebhookEventTx,
} from "@/lib/db/transactions/webhook-event.tx";
import { verifySendGridWebhook } from "@/lib/integrations/sendgrid/webhooks";
import { sendGridWebhookEventsSchema } from "@/schemas/integrationSchemas";

export async function POST(request: Request) {
  const payload = await request.text();
  let events;

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
    events = sendGridWebhookEventsSchema.parse(JSON.parse(payload));
  } catch {
    return Response.json(
      { error: "Invalid SendGrid webhook." },
      { status: 400 },
    );
  }

  try {
    for (const event of events) {
      await withProviderTransaction(async (tx) => {
        const webhookEventId = await claimWebhookEventTx(tx, {
          provider: "sendgrid",
          eventId: event.sg_event_id,
          type: event.event,
          payload: JSON.stringify(event),
          organizationId: event.organizationId,
        });
        if (!webhookEventId) return;

        await tx.$executeRaw`SELECT set_config('app.organization_id', ${event.organizationId}, true)`;
        await tx.auditEvent.create({
          data: {
            organizationId: event.organizationId,
            action: `email.${event.event}`,
            resourceType: "email",
            resourceId: event.sg_message_id ?? null,
          },
        });
        await completeWebhookEventTx(tx, webhookEventId);
      });
    }
    return Response.json({ received: true });
  } catch {
    return Response.json(
      { error: "SendGrid webhook processing failed." },
      { status: 500 },
    );
  }
}
