import type { ModuleDefinition } from "@/types/moduleTypes";

export const billingModule = {
  id: "billing",
  settings: [{ label: "Billing", href: "/settings/billing" }],
  permissions: {
    resources: [],
    catalog: ["billing:read"],
    grants: { BILLING: ["billing:read"] },
  },
  integration: {
    name: "Stripe",
    purpose: "Billing, checkout, and subscriptions",
    env: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
} satisfies ModuleDefinition;
