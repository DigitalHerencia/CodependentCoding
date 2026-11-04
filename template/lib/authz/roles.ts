// The one lib/authz file without "server-only": role names are vocabulary,
// not secrets, and role pickers and their schemas need them in the browser.
import { MembershipRole } from "@/generated/prisma/enums";
import type { AppRole } from "@/types/accessTypes";

const roleRank = {
  [MembershipRole.OWNER]: 0,
  [MembershipRole.ADMIN]: 1,
  [MembershipRole.MEMBER]: 2,
  [MembershipRole.VIEWER]: 3,
} satisfies Record<MembershipRole, number>;

export const appRoles = Object.values(MembershipRole).sort(
  (left, right) => roleRank[left] - roleRank[right],
);

type InvitableRole = Exclude<AppRole, "OWNER">;

/** Roles an invitation can grant: every role but OWNER, highest first. */
export const invitableRoles = appRoles.filter(
  (role): role is InvitableRole => role !== MembershipRole.OWNER,
) as [InvitableRole, ...InvitableRole[]];

/** The role an invitation form starts on: staff. */
export const defaultInvitedRole: InvitableRole = MembershipRole.MEMBER;

const privilegedRoles = new Set<AppRole>([
  MembershipRole.OWNER,
  MembershipRole.ADMIN,
]);

export function isAppRole(value: string): value is AppRole {
  return appRoles.some((role) => role === value);
}

/** OWNER and ADMIN hold every permission and manage any record in their organization. */
export function isPrivilegedRole(role: AppRole): boolean {
  return privilegedRoles.has(role);
}

/** VIEWER is for people outside the organization's staff (clients): policies limit them to shared or their own records. */
export function isOutsideRole(role: AppRole): boolean {
  return role === MembershipRole.VIEWER;
}

/** True when `role` ranks at or above `minimum` (OWNER > ADMIN > MEMBER > VIEWER). */
export function hasRoleAtLeast(role: AppRole, minimum: AppRole): boolean {
  return roleRank[role] <= roleRank[minimum];
}
