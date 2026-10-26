import type { ModuleDefinition } from "@/types/moduleTypes";

export const invoicingModule = {
  id: "invoicing",
  nav: {
    label: "Invoicing",
    icon: "credit-card",
    links: [
      { label: "Invoices", href: "/invoices" },
      { label: "Expenses", href: "/expenses" },
    ],
  },
  dashboard: [
    {
      id: "invoicing-invoices",
      title: "Invoicing",
      description: "Prepare itemized invoices and review receivables.",
      href: "/invoices",
    },
  ],
  permissions: {
    resources: ["invoicing.invoice", "invoicing.expense"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
  records: [{ label: "Invoices", model: "invoice" }],
} satisfies ModuleDefinition;
