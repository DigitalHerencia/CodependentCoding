import type { ModuleDefinition } from "@/types/moduleTypes";

export const billingModule = {
  id: "billing",
  settings: [{ label: "Billing", href: "/settings/billing" }],
  permissions: {
    resources: ["billing.subscription"],
    grants: { MEMBER: ["read"] },
  },
  integration: {
    name: "Stripe",
    purpose: "Billing, checkout, and subscriptions",
    env: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
} satisfies ModuleDefinition;
