import { handleSendGridWebhookWorkflow } from "@/lib/workflows/emailWebhookWorkflows";

export async function POST(request: Request) {
  return handleSendGridWebhookWorkflow(
    await request.text(),
    request.headers.get("x-twilio-email-event-webhook-signature"),
    request.headers.get("x-twilio-email-event-webhook-timestamp"),
  );
}
