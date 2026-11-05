import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { required } from "@/schemas/envSchemas";

export const stripeEnv = defineEnv("billing", {
  STRIPE_SECRET_KEY: required(),
  STRIPE_WEBHOOK_SECRET: required(),
});
