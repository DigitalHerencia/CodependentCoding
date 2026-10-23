import type { Route } from "next";

import type { AppRole } from "@/types/accessTypes";

/** `<module>:<action>`; the catalog is base permissions plus each installed module's. */
export type ModulePermission = `${string}:${string}`;

/** Icon names the tenant shell knows how to draw. */
export type ModuleIcon =
  | "brain"
  | "briefcase"
  | "building"
  | "credit-card"
  | "folder-kanban"
  | "headphones"
  | "megaphone"
  | "users";

export interface ModuleNavLink {
  label: string;
  href: Route;
}

export interface ModuleNav {
  label: string;
  icon: ModuleIcon;
  links: readonly ModuleNavLink[];
}

export interface ModuleDashboardEntry {
  id: string;
  title: string;
  description: string;
  href: Route;
}

export interface ModulePermissions {
  /** Resource kinds the module's policies check (`ResourceAccessDescriptor.kind`). */
  resources: readonly string[];
  /** Every permission the module defines. OWNER and ADMIN hold all of them. */
  catalog: readonly ModulePermission[];
  /** Grants for the remaining roles; a role left out gets none. */
  grants: Partial<Record<AppRole, readonly ModulePermission[]>>;
}

/** Runtime contributions of one module (Architecture.md §5.4). Build-time facts live in hipster.modules.json. */
export interface ModuleDefinition {
  id: string;
  nav?: ModuleNav;
  /** Links added to the base Settings group. */
  settings?: readonly ModuleNavLink[];
  dashboard?: readonly ModuleDashboardEntry[];
  permissions?: ModulePermissions;
}
