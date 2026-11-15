import type { ModuleDefinition } from "@/types/moduleTypes";

/** Register CRM navigation, authorization resources and module contributions. */
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
  records: [
    { label: "CRM contacts", model: "crmContact" },
    { label: "CRM accounts", model: "crmAccount" },
    { label: "CRM opportunities", model: "crmDeal" },
    { label: "CRM activities", model: "crmActivity" },
  ],
} satisfies ModuleDefinition;
