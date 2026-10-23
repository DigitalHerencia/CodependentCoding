import type { ModuleDefinition } from "@/types/moduleTypes";

export const billingModule = {
  id: "billing",
  settings: [{ label: "Billing", href: "/settings/billing" }],
  permissions: {
    resources: [],
    catalog: ["billing:read"],
    grants: { BILLING: ["billing:read"] },
  },
} satisfies ModuleDefinition;
