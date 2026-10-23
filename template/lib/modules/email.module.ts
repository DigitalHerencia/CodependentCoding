import type { ModuleDefinition } from "@/types/moduleTypes";

export const emailModule = {
  id: "email",
  integration: {
    name: "SendGrid",
    purpose: "Transactional email and delivery events",
    env: [
      "SENDGRID_API_KEY",
      "SENDGRID_FROM_EMAIL",
      "SENDGRID_WEBHOOK_VERIFICATION_KEY",
    ],
  },
} satisfies ModuleDefinition;
