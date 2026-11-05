import type { ModuleDefinition } from "@/types/moduleTypes";

export const crmModule = {
  id: "crm",
  nav: {
    label: "CRM",
    icon: "users",
    links: [
      { label: "Contacts", href: "/crm/contacts" },
      { label: "Accounts", href: "/crm/accounts" },
      { label: "Leads", href: "/crm/leads" },
      { label: "Pipeline", href: "/crm/pipeline" },
      { label: "Analytics", href: "/crm/analytics" },
    ],
  },
  dashboard: [
    {
      id: "crm-pipeline",
      title: "Customer relationships",
      description: "Qualify opportunities and manage accounts.",
      href: "/crm/pipeline",
    },
  ],
  permissions: {
    resources: ["crm.contact", "crm.account", "crm.deal"],
    grants: { MEMBER: ["read", "create", "update", "delete"] },
  },
  records: [{ label: "CRM contacts", model: "crmContact" }],
} satisfies ModuleDefinition;
