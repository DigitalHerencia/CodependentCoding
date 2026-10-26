import type { ModuleDefinition } from "@/types/moduleTypes";

export const portalModule = {
  id: "portal",
  nav: {
    label: "Portal",
    icon: "briefcase",
    links: [
      { label: "Overview", href: "/portal" },
      { label: "Documents", href: "/portal/documents" },
      { label: "Billing", href: "/portal/billing" },
    ],
  },
  dashboard: [
    {
      id: "portal-documents",
      title: "Client documents",
      description: "Manage shared document versions.",
      href: "/portal/documents",
    },
  ],
  permissions: {
    resources: ["portal.document", "portal.billing"],
    grants: {
      MEMBER: ["read", "create", "update"],
      VIEWER: ["portal.document:read"],
    },
  },
  records: [{ label: "Portal documents", model: "portalDocument" }],
} satisfies ModuleDefinition;
