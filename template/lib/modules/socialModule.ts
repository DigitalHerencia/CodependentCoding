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
    resources: ["social.post", "social.account", "social.media"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
  records: [{ label: "Social posts", model: "socialPost" }],
} satisfies ModuleDefinition;
