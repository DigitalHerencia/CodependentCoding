import type { ModuleDefinition } from "@/types/moduleTypes";

export const billingModule = {
  id: "billing",
  settings: [{ label: "Billing", href: "/settings/billing" }],
} satisfies ModuleDefinition;
