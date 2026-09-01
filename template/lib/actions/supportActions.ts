"use server";

import {
  createSupportTicketSchema,
  updateSupportTicketStatusSchema,
} from "@/schemas/supportSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { authorizeOwnedOrAssignedWrite } from "@/lib/authz/policies";
import { toSupportTicketDTO } from "@/lib/db/dto/support.dto";
import { supportTicketSelect } from "@/lib/db/selects/support.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { updateTicketStatusTx } from "@/lib/db/transactions/update-ticket-status.tx";

export async function createSupportTicket(rawInput: unknown) {
  const input = createSupportTicketSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${access.organizationId}))`;
    const latest = await tx.supportTicket.aggregate({
      where: { organizationId: access.organizationId },
      _max: { number: true },
    });
    const record = await tx.supportTicket.create({
      data: {
        organizationId: access.organizationId,
        requesterUserId: access.userId,
        number: (latest._max.number ?? 0) + 1,
        subject: input.subject,
        description: input.description ?? null,
        priority: input.priority,
      },
      select: supportTicketSelect,
    });
    return toSupportTicketDTO(record);
  });
}

export async function updateSupportTicketStatus(rawInput: unknown) {
  const input = updateSupportTicketStatusSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    const target = await tx.supportTicket.findFirst({
      where: { id: input.ticketId, organizationId: access.organizationId },
      select: {
        organizationId: true,
        requesterUserId: true,
        assignedMembershipId: true,
      },
    });
    if (!target) throw new Error("Support ticket was not found.");

    authorizeOwnedOrAssignedWrite(access, "support:write", {
      kind: "support-ticket",
      organizationId: target.organizationId,
      requesterUserId: target.requesterUserId,
      assigneeMembershipId: target.assignedMembershipId,
    });

    const record = await updateTicketStatusTx(tx, {
      organizationId: access.organizationId,
      ticketId: input.ticketId,
      status: input.status,
      expectedVersion: input.expectedVersion,
    });
    return toSupportTicketDTO(record);
  });
}
