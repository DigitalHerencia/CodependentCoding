import type { ModuleDefinition } from "@/types/moduleTypes";

export const supportModule = {
  id: "support",
  nav: {
    label: "Support",
    icon: "headphones",
    links: [
      { label: "Inbox", href: "/support/inbox" },
      { label: "New ticket", href: "/support/tickets/new" },
      { label: "Knowledge base", href: "/support/knowledge-base" },
      { label: "Analytics", href: "/support/analytics" },
    ],
  },
  dashboard: [
    {
      id: "support-queue",
      title: "Support queue",
      description: "Triage requests and continue conversations.",
      href: "/support/inbox",
    },
  ],
  permissions: {
    resources: ["support-ticket"],
    catalog: ["support:read", "support:write"],
    grants: {
      MANAGER: ["support:read", "support:write"],
      MEMBER: ["support:read", "support:write"],
      SUPPORT: ["support:read", "support:write"],
      CLIENT: ["support:read", "support:write"],
      VIEWER: ["support:read"],
    },
  },
} satisfies ModuleDefinition;
