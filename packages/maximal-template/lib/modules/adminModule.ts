/** Admin owns tenant audit, registered inventory and membership administration. */
import type { ModuleDefinition } from "@/types/moduleTypes";

/** Register privileged-only navigation and permission resources; no default member grants. */
export const adminModule = {
  id: "admin",
  nav: {
    label: "Admin",
    icon: "building",
    links: [
      { label: "Dashboard", href: "/admin" },
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
