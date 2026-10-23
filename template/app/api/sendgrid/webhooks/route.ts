import { recordSendGridWebhookEventsTx } from "@/lib/db/transactions/email-record-sendgrid-webhook.tx";
import { WebhookIdentityConflictError } from "@/lib/db/transactions/webhook-event.tx";
import { parseSendGridWebhookEvents } from "@/lib/integrations/sendgrid/webhooks";

export async function POST(request: Request) {
  const payload = await request.text();
  let events;

  try {
    events = parseSendGridWebhookEvents(
      payload,
      request.headers.get("x-twilio-email-event-webhook-signature"),
      request.headers.get("x-twilio-email-event-webhook-timestamp"),
    );
  } catch {
    return Response.json(
      { error: "Invalid SendGrid webhook." },
      { status: 400 },
    );
  }

  try {
    await recordSendGridWebhookEventsTx(events);
    return Response.json({ received: true });
  } catch (error) {
    if (error instanceof WebhookIdentityConflictError) {
      return Response.json(
        { error: "SendGrid webhook event identity conflict." },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "SendGrid webhook processing failed." },
      { status: 500 },
    );
  }
}
