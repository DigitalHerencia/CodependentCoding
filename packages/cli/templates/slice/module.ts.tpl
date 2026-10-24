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
    resources: ["{{entity}}"],
    catalog: ["{{module}}:read", "{{module}}:write"],
    grants: {
      MANAGER: ["{{module}}:read", "{{module}}:write"],
      MEMBER: ["{{module}}:read", "{{module}}:write"],
      VIEWER: ["{{module}}:read"],
    },
  },
} satisfies ModuleDefinition;
