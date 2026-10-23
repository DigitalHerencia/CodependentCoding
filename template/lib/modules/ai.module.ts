import type { ModuleDefinition } from "@/types/moduleTypes";

export const aiModule = {
  id: "ai",
  nav: {
    label: "AI",
    icon: "brain",
    links: [
      { label: "Overview", href: "/ai" },
      { label: "Playground", href: "/ai/playground" },
      { label: "Usage", href: "/ai/usage" },
    ],
  },
  dashboard: [
    {
      id: "ai-playground",
      title: "AI playground",
      description: "Generate responses using the configured provider.",
      href: "/ai/playground",
    },
  ],
  permissions: {
    resources: ["ai-generation"],
    catalog: ["ai:read", "ai:write"],
    grants: {
      MANAGER: ["ai:read", "ai:write"],
      MEMBER: ["ai:read", "ai:write"],
      VIEWER: ["ai:read"],
    },
  },
} satisfies ModuleDefinition;
