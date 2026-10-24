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
    resources: ["portal-document"],
    catalog: ["portal:read", "portal:write", "portal:billing"],
    grants: {
      MANAGER: ["portal:read", "portal:write"],
      MEMBER: ["portal:read"],
      BILLING: ["portal:read", "portal:billing"],
      SUPPORT: ["portal:read"],
      CLIENT: ["portal:read"],
      VIEWER: ["portal:read"],
    },
  },
  records: [{ label: "Portal documents", model: "portalDocument" }],
} satisfies ModuleDefinition;
