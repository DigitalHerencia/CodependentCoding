import "server-only";

import { stripeEnv } from "@/lib/integrations/stripe/env";

import { getStripeClient } from "./client";

export function verifyStripeWebhook(payload: string, signature: string | null) {
  const secret = stripeEnv.read().STRIPE_WEBHOOK_SECRET;
  if (!signature) throw new Error("The Stripe-Signature header is required.");
  return getStripeClient().webhooks.constructEvent(payload, signature, secret);
}
