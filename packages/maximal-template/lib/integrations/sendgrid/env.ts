import "server-only";

import { defineEnv } from "@/lib/utils/env";
import { optional, required } from "@/schemas/envSchemas";

export const sendGridEnv = defineEnv("email", {
  SENDGRID_API_KEY: required(),
  SENDGRID_FROM_EMAIL: required(),
  SENDGRID_WEBHOOK_VERIFICATION_KEY: optional(),
});
