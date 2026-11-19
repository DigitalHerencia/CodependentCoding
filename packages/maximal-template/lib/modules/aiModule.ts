import type { ModuleDefinition } from "@/types/moduleTypes";

/** AI owns tenant navigation, permission resources, dashboard contributions and record registration. */
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
    resources: ["ai.generation"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
  records: [
    {
      label: "Your AI generations",
      model: "aiGeneration",
      permission: "ai.generation:read",
      userScoped: true,
    },
    {
      label: "Your AI usage",
      model: "aiUsageLedger",
      permission: "ai.generation:read",
      userScoped: true,
    },
  ],
} satisfies ModuleDefinition;
