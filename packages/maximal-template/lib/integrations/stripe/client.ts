import "server-only";

import Stripe from "stripe";

import { stripeEnv } from "@/lib/integrations/stripe/env";

let client: Stripe | undefined;

export function getStripeClient() {
  client ??= new Stripe(stripeEnv.read().STRIPE_SECRET_KEY);
  return client;
}
