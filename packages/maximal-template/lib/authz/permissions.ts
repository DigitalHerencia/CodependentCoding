/** Role permissions assembled from installed domain modules. */
import "server-only";

import type { AccessContext, AppRole, Permission } from "@/types/authzTypes";
import type { ModulePermissions, PermissionAction } from "@/types/moduleTypes";

import { installedModules } from "@/lib/modules/registry";

import { appRoles, isPrivilegedRole } from "./roles";
import { baseResources, permissionActions, resourceKinds } from "./resources";

/** Every `<module>.<resource>:<action>`: each known resource with each action. */
export const permissions: readonly Permission[] = resourceKinds.flatMap(
  (resource) =>
    permissionActions.map((action) => `${resource}:${action}` as Permission),
);

/** Base grants below ADMIN: staff and outside viewers can read the organization. */
const baseGrants: ModulePermissions = {
  resources: baseResources,
  grants: {
    MEMBER: ["read", "base.dashboard:update"],
    VIEWER: ["read", "base.dashboard:update"],
  },
};

function expand(
  { resources, grants }: ModulePermissions,
  role: AppRole,
): Permission[] {
  return (grants[role] ?? []).flatMap((grant) =>
    permissionActions.includes(grant as PermissionAction)
      ? resources.map((resource) => `${resource}:${grant}` as Permission)
      : [grant as Permission],
  );
}

function grantsFor(role: AppRole): ReadonlySet<Permission> {
  if (isPrivilegedRole(role)) return new Set(permissions);
  return new Set([
    ...expand(baseGrants, role),
    ...installedModules.flatMap((entry) =>
      entry.permissions ? expand(entry.permissions, role) : [],
    ),
  ]);
}

/** OWNER and ADMIN hold every permission; MEMBER and VIEWER get base grants plus each module's. */
export const grants = Object.fromEntries(
  appRoles.map((role) => [role, grantsFor(role)]),
) as Record<AppRole, ReadonlySet<Permission>>;

/** Reject a permission that the current membership has not been granted. */
export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN";

  constructor(permission: Permission) {
    super(`Missing required permission: ${permission}`);
    this.name = "AuthorizationError";
  }
}

/** RBAC: does the caller's role allow this action on this kind of resource? */
export function hasPermission(
  context: AccessContext,
  permission: Permission,
): boolean {
  return grants[context.role].has(permission);
}

/** Reject access unless the membership role grants the required permission. */
export function assertPermission(
  context: AccessContext,
  permission: Permission,
): void {
  if (!hasPermission(context, permission)) {
    throw new AuthorizationError(permission);
  }
}
