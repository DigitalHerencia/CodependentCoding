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
    resources: ["support.ticket", "support.article"],
    grants: {
      MEMBER: ["read", "create", "update"],
      VIEWER: ["read", "support.ticket:create", "support.ticket:update"],
    },
  },
  records: [{ label: "Support tickets", model: "supportTicket" }],
} satisfies ModuleDefinition;
