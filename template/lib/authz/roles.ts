import "server-only";

import type { MembershipRole } from "@/generated/prisma/enums";
import { appRoles } from "@/lib/constants/roles";
import type { AppRole } from "@/types/accessTypes";

export { appRoles };

type MissingPersistenceRole = Exclude<
  MembershipRole,
  (typeof appRoles)[number]
>;
const membershipRoleCoverage: MissingPersistenceRole extends never
  ? true
  : never = true;
void membershipRoleCoverage;

const privilegedRoles = new Set<AppRole>(["OWNER", "ADMIN"]);

export function isAppRole(value: string): value is AppRole {
  return appRoles.some((role) => role === value);
}

/** OWNER and ADMIN hold every permission and manage any record in their organization. */
export function isPrivilegedRole(role: AppRole): boolean {
  return privilegedRoles.has(role);
}

/** VIEWER is for people outside the organization's staff (clients): policies limit them to shared or their own records. */
export function isOutsideRole(role: AppRole): boolean {
  return role === "VIEWER";
}

/** True when `role` ranks at or above `minimum` (OWNER > ADMIN > MEMBER > VIEWER). */
export function hasRoleAtLeast(role: AppRole, minimum: AppRole): boolean {
  return appRoles.indexOf(role) <= appRoles.indexOf(minimum);
}
