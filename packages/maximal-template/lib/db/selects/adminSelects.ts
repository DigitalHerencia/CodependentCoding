/** Minimal Prisma projections for administration; types live in adminTypes. */
import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Audit reads exclude organization/provider internals. */
export const auditEventSelect = {
  id: true,
  action: true,
  resourceType: true,
  resourceId: true,
  actor: {
    select: {
      id: true,
      displayName: true,
      email: true,
    },
  },
  createdAt: true,
} satisfies Prisma.AuditEventSelect;

/** Member reads include only identity and membership display data. */
export const adminMembershipSelect = {
  id: true,
  role: true,
  status: true,
  user: { select: { id: true, displayName: true, email: true } },
  createdAt: true,
} satisfies Prisma.MembershipSelect;

/** Lock-time target projection for membership invariants. */
export const adminMembershipTargetSelect = {
  id: true,
  userId: true,
  role: true,
  status: true,
} satisfies Prisma.MembershipSelect;
/** Access approval returns only the key used by the appended audit event. */
export const adminApprovalSelect = {
  id: true,
} satisfies Prisma.InvitationSelect;
