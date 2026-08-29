import type { AppRole } from "../../types/access";

export const appRoles = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "MEMBER",
  "BILLING",
  "SUPPORT",
  "CLIENT",
  "VIEWER",
] as const satisfies readonly AppRole[];

const privilegedRoles = new Set<AppRole>(["OWNER", "ADMIN"]);

export function isAppRole(value: string): value is AppRole {
  return appRoles.some((role) => role === value);
}

export function isPrivilegedRole(role: AppRole): boolean {
  return privilegedRoles.has(role);
}
