import "server-only";

import type {
  MembershipRole,
  MembershipStatus,
  Prisma,
} from "@/generated/prisma/client";

import { adminMembershipSelect } from "@/lib/db/selects/admin.selects";
import { ResourceNotFoundError } from "./errors";

export async function updateMembershipAdministrationTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    membershipId: string;
    role?: MembershipRole;
    status?: MembershipStatus;
  },
) {
  const membership = await tx.membership.findFirst({
    where: {
      id: input.membershipId,
      organizationId: input.organizationId,
    },
    select: { id: true },
  });
  if (!membership) throw new ResourceNotFoundError("Membership");

  const updated = await tx.membership.update({
    where: { id: membership.id },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    select: adminMembershipSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "admin.membership.updated",
      resourceType: "Membership",
      resourceId: updated.id,
      metadata: { role: updated.role, status: updated.status },
    },
  });
  return updated;
}
