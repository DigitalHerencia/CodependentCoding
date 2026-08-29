import "server-only";

import { getStripeClient } from "./client";

export function createCheckoutSession(input: {
  organizationId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
}) {
  return getStripeClient().checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId,
    line_items: [{ price: input.priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.organizationId,
    metadata: { organizationId: input.organizationId },
    subscription_data: { metadata: { organizationId: input.organizationId } },
  });
}
