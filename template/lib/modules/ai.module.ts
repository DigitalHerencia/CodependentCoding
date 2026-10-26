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
    resources: ["ai.generation"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
  records: [{ label: "AI generations", model: "aiGeneration" }],
} satisfies ModuleDefinition;
