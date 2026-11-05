import "server-only";

import { defineEnv, optional, required } from "@/lib/env/base";

export const emailEnv = defineEnv("email", {
  SENDGRID_API_KEY: required(),
  SENDGRID_FROM_EMAIL: required(),
  SENDGRID_WEBHOOK_VERIFICATION_KEY: optional(),
});
