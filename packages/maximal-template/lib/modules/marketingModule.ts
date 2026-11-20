import type { ModuleDefinition } from "@/types/moduleTypes";

/** Own marketing navigation, planning dashboard contributions, permissions and records. */
export const marketingModule = {
  id: "marketing",
  nav: {
    label: "Marketing",
    icon: "megaphone",
    links: [
      { label: "Campaigns", href: "/marketing/campaigns" },
      { label: "Audiences", href: "/marketing/audiences" },
      { label: "Analytics", href: "/marketing/analytics" },
    ],
  },
  dashboard: [
    {
      id: "marketing-campaigns",
      title: "Campaign planning",
      description: "Define audiences and plan campaigns.",
      href: "/marketing/campaigns",
    },
  ],
  permissions: {
    resources: ["marketing.campaign", "marketing.audience"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
  records: [
    {
      label: "Campaigns",
      model: "campaign",
      permission: "marketing.campaign:read",
    },
    {
      label: "Audiences",
      model: "audience",
      permission: "marketing.audience:read",
    },
  ],
} satisfies ModuleDefinition;
