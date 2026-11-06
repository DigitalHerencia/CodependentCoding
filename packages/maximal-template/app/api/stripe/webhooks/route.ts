import { handleStripeWebhookWorkflow } from "@/lib/workflows/billingWebhookWorkflows";

export async function POST(request: Request) {
  return handleStripeWebhookWorkflow(
    await request.text(),
    request.headers.get("stripe-signature"),
  );
}
