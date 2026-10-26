// Why: Module definition: navigation, resources and permission grants the registry reads.
import type { ModuleDefinition } from "@/types/moduleTypes";

export const {{module}}Module = {
  id: "{{module}}",
  nav: {
    label: "{{ModuleLabel}}",
    icon: "{{icon}}",
    links: [{ label: "{{labelPlural}}", href: "/{{route}}" }],
  },
  permissions: {
    resources: ["{{resource}}"],
    grants: { MEMBER: ["read", "create", "update"] },
  },
} satisfies ModuleDefinition;
