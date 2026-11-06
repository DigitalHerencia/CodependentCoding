import {
  recordSendGridWebhookEvents,
  WebhookIdentityConflictError,
} from "@/lib/actions/emailWebhookActions";
import { parseSendGridWebhookEvents } from "@/lib/integrations/sendgrid/webhooks";
import "server-only";

export async function handleSendGridWebhookWorkflow(
  payload: string,
  signature: string | null,
  timestamp: string | null,
) {
  let events;

  try {
    events = parseSendGridWebhookEvents(payload, signature, timestamp);
  } catch {
    return Response.json(
      { error: "Invalid SendGrid webhook." },
      { status: 400 },
    );
  }

  try {
    await recordSendGridWebhookEvents(events);
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
