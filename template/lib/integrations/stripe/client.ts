import "server-only";

import Stripe from "stripe";

import { billingEnv } from "@/lib/env/billing";

let client: Stripe | undefined;

export function getStripeClient() {
  client ??= new Stripe(billingEnv.read().STRIPE_SECRET_KEY);
  return client;
}
