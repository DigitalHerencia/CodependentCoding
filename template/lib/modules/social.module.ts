import type { ModuleDefinition } from "@/types/moduleTypes";

export const socialModule = {
  id: "social",
  nav: {
    label: "Social",
    icon: "megaphone",
    links: [
      { label: "Calendar", href: "/social/calendar" },
      { label: "Compose", href: "/social/compose" },
      { label: "Media", href: "/social/media" },
    ],
  },
  dashboard: [
    {
      id: "social-publishing",
      title: "Publishing",
      description: "Compose, approve and schedule social posts.",
      href: "/social/calendar",
    },
  ],
  permissions: {
    resources: ["social-post"],
    catalog: ["social:read", "social:write"],
    grants: {
      MANAGER: ["social:read", "social:write"],
      MEMBER: ["social:read", "social:write"],
      VIEWER: ["social:read"],
    },
  },
  records: [{ label: "Social posts", model: "socialPost" }],
} satisfies ModuleDefinition;
