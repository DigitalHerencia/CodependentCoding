import "server-only";

import { defineEnv, required } from "@/lib/env/base";

export const billingEnv = defineEnv("billing", {
  STRIPE_SECRET_KEY: required(),
  STRIPE_WEBHOOK_SECRET: required(),
});
