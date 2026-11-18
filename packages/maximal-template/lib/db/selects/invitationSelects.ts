import "server-only";
import type { Prisma } from "@/generated/prisma/client";

/** Public invitation fields shared by authenticated reads and mutations. */
export const invitationSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  expiresAt: true,
  createdAt: true,
} satisfies Prisma.InvitationSelect;

/** Recipient and lifecycle snapshot required for secure token acceptance. */
export const invitationAcceptanceSelect = {
  id: true,
  email: true,
  organizationId: true,
  role: true,
  status: true,
  expiresAt: true,
  createdAt: true,
} satisfies Prisma.InvitationSelect;

/** Existing membership fields used to preserve activation and role during acceptance. */
export const invitationMembershipSelect = {
  id: true,
  status: true,
  role: true,
  createdAt: true,
} satisfies Prisma.MembershipSelect;

/** Identifier returned when acceptance creates a new membership. */
export const invitationMembershipIdentifierSelect = {
  id: true,
} satisfies Prisma.MembershipSelect;
