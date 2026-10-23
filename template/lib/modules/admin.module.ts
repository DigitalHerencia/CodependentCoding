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
    resources: ["audit-event"],
    catalog: ["admin:audit", "admin:records", "admin:users", "admin:bulk"],
    grants: {},
  },
} satisfies ModuleDefinition;
