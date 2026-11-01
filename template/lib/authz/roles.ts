// The one lib/authz file without "server-only": role names are vocabulary,
// not secrets, and role pickers and their schemas need them in the browser.
import type { MembershipRole } from "@/generated/prisma/enums";
import type { AppRole } from "@/types/accessTypes";

/**
 * Canonical application roles, highest first (AUTH.md §5): OWNER > ADMIN >
 * MEMBER (staff) > VIEWER (outside people, e.g. clients, who see only records
 * shared with them or their own). The order encodes rank. `satisfies` rejects
 * unknown values; the coverage type below rejects missing ones.
 */
export const appRoles = [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
] as const satisfies readonly MembershipRole[];

type MissingPersistenceRole = Exclude<
  MembershipRole,
  (typeof appRoles)[number]
>;
const membershipRoleCoverage: [MissingPersistenceRole] extends [never]
  ? true
  : never = true;
void membershipRoleCoverage;

type InvitableRole = Exclude<AppRole, "OWNER">;

/** Roles an invitation can grant: every role but OWNER, highest first. */
export const invitableRoles = appRoles.filter(
  (role): role is InvitableRole => role !== "OWNER",
) as [InvitableRole, ...InvitableRole[]];

/** The role an invitation form starts on: staff. */
export const defaultInvitedRole: InvitableRole = "MEMBER";

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
