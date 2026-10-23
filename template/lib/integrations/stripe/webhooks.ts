import "server-only";

import { billingEnv } from "@/lib/env/billing";

import { getStripeClient } from "./client";

export function verifyStripeWebhook(payload: string, signature: string | null) {
  const secret = billingEnv.read().STRIPE_WEBHOOK_SECRET;
  if (!signature) throw new Error("The Stripe-Signature header is required.");
  return getStripeClient().webhooks.constructEvent(payload, signature, secret);
}
