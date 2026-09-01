import "server-only";

import { getStripeClient } from "./client";

export function verifyStripeWebhook(payload: string, signature: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret)
    throw new Error(
      "Stripe webhooks are not configured. Add STRIPE_WEBHOOK_SECRET to .env.local.",
    );
  if (!signature) throw new Error("The Stripe-Signature header is required.");
  return getStripeClient().webhooks.constructEvent(payload, signature, secret);
}
