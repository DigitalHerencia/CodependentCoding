/** Minimal database projections for authenticated authorization reads. */
import "server-only";
import type { Prisma } from "@/generated/prisma/client";

/** Membership fields required to authorize a transaction in one organization. */
export const authorizationMembershipSelect = {
  id: true,
  organizationId: true,
  role: true,
  deniedPermissions: true,
} satisfies Prisma.MembershipSelect;

/** Public organization choices derived from the caller's active memberships. */
export const organizationSwitcherMembershipSelect = {
  organization: { select: { id: true, name: true } },
} satisfies Prisma.MembershipSelect;

/** Destination choices expose only organizations and the caller's authority to manage them. */
export const manageableOrganizationMembershipSelect = {
  ...organizationSwitcherMembershipSelect,
  role: true,
  deniedPermissions: true,
} satisfies Prisma.MembershipSelect;

/** Directory projection without user contact details or identity provider metadata. */
export const organizationMemberSelect = {
  id: true,
  role: true,
  status: true,
  user: { select: { displayName: true } },
} satisfies Prisma.MembershipSelect;

/** Existence projection shared by organization, membership, and audit allocation checks. */
export const authzIdSelect = { id: true } satisfies Prisma.MembershipSelect &
  Prisma.OrganizationSelect &
  Prisma.AuditEventSelect;

/** Approval fields required by the existing invitation acceptance transaction. */
export const pendingInvitationAccessSelect = {
  id: true,
  organizationId: true,
  role: true,
  email: true,
} satisfies Prisma.InvitationSelect;

/** Preserve the existing role and activation status during single-tenant provisioning. */
export const membershipRoleStatusSelect = {
  id: true,
  role: true,
  status: true,
} satisfies Prisma.MembershipSelect;

/** Membership state required for provider identity deactivation and its audit ledger. */
export const membershipSuspensionSelect = {
  id: true,
  organizationId: true,
  status: true,
} satisfies Prisma.MembershipSelect;
