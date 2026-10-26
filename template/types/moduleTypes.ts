import type { Route } from "next";

import type { Prisma } from "@/generated/prisma/client";

import type { AppRole } from "@/types/accessTypes";

/** What a permission allows on a resource (AUTH.md §5.2). */
export type PermissionAction =
  "read" | "create" | "update" | "delete" | "manage";

/** `<module>.<resource>:<action>`, e.g. `crm.contact:update`. */
export type ModulePermission = `${string}.${string}:${PermissionAction}`;

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
  /** `<module>.<resource>`; each gets every action. Policies check `ResourceAccessDescriptor.kind` against them. */
  resources: readonly `${string}.${string}`[];
  /**
   * Grants for MEMBER and VIEWER (OWNER and ADMIN hold everything): an action
   * applies to every resource of the module, a full permission to one.
   */
  grants: Partial<
    Record<AppRole, readonly (PermissionAction | ModulePermission)[]>
  >;
}

/** A provider an add-on wraps; Settings > Integrations reports it configured when every `env` name is set. */
export interface ModuleIntegration {
  name: string;
  purpose: string;
  env: readonly string[];
}

/** A tenant table the admin record summary counts; `model` is its Prisma client delegate (e.g. "crmContact"). */
export interface ModuleRecordCount {
  label: string;
  model: Uncapitalize<Prisma.ModelName>;
}

/** Runtime contributions of one module (Architecture.md §5.4). Build-time facts live in hipster.modules.json. */
export interface ModuleDefinition {
  id: string;
  nav?: ModuleNav;
  /** Links added to the base Settings group. */
  settings?: readonly ModuleNavLink[];
  dashboard?: readonly ModuleDashboardEntry[];
  permissions?: ModulePermissions;
  integration?: ModuleIntegration;
  records?: readonly ModuleRecordCount[];
}
