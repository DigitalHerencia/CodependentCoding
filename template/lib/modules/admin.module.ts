import type { ModuleDefinition } from "@/types/moduleTypes";

export const adminModule = {
  id: "admin",
  nav: {
    label: "Admin",
    icon: "building",
    links: [
      { label: "Users", href: "/admin/users" },
      { label: "Records", href: "/admin/records" },
      { label: "Audit", href: "/admin/audit" },
    ],
  },
  permissions: {
    resources: ["admin.audit-event", "admin.record", "admin.membership"],
    grants: {},
  },
} satisfies ModuleDefinition;
