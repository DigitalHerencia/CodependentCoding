import "server-only";

import type { MembershipRole } from "@/generated/prisma/enums";
import { appRoles } from "@/lib/constants/roles";
import type { AppRole } from "@/types/access";

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

export function isPrivilegedRole(role: AppRole): boolean {
  return privilegedRoles.has(role);
}
