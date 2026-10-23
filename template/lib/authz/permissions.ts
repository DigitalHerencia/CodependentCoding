import "server-only";

import type { AccessContext, AppRole, Permission } from "@/types/accessTypes";

import { installedModules } from "@/lib/modules/registry";

export const basePermissions = [
  "organization:read",
  "organization:write",
] as const;

/** Base permissions plus every installed module's catalog. */
export const permissions: readonly Permission[] = [
  ...basePermissions,
  ...installedModules.flatMap((entry) => entry.permissions?.catalog ?? []),
];

const baseGrants: Record<AppRole, readonly Permission[]> = {
  OWNER: basePermissions,
  ADMIN: basePermissions,
  MANAGER: ["organization:read"],
  MEMBER: ["organization:read"],
  BILLING: ["organization:read"],
  SUPPORT: ["organization:read"],
  CLIENT: ["organization:read"],
  VIEWER: ["organization:read"],
};

function grantsFor(role: AppRole): ReadonlySet<Permission> {
  if (role === "OWNER" || role === "ADMIN") return new Set(permissions);
  return new Set([
    ...baseGrants[role],
    ...installedModules.flatMap(
      (entry) => entry.permissions?.grants[role] ?? [],
    ),
  ]);
}

/** OWNER and ADMIN hold the whole catalog; other roles get base grants plus what each module grants them. */
export const grants: Record<AppRole, ReadonlySet<Permission>> = {
  OWNER: grantsFor("OWNER"),
  ADMIN: grantsFor("ADMIN"),
  MANAGER: grantsFor("MANAGER"),
  MEMBER: grantsFor("MEMBER"),
  BILLING: grantsFor("BILLING"),
  SUPPORT: grantsFor("SUPPORT"),
  CLIENT: grantsFor("CLIENT"),
  VIEWER: grantsFor("VIEWER"),
};

export class AuthorizationError extends Error {
  constructor(permission: Permission) {
    super(`Missing required permission: ${permission}`);
    this.name = "AuthorizationError";
  }
}

export function hasPermission(
  context: AccessContext,
  permission: Permission,
): boolean {
  return grants[context.role].has(permission);
}

export function assertPermission(
  context: AccessContext,
  permission: Permission,
): void {
  if (!hasPermission(context, permission)) {
    throw new AuthorizationError(permission);
  }
}
