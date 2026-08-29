import type { Prisma, TicketStatus } from "../../../generated/prisma/client";

import { supportTicketSelect } from "../selects/support.selects";
import { ConcurrencyConflictError } from "./errors";

export async function updateTicketStatusTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    ticketId: string;
    status: TicketStatus;
    expectedVersion: number;
  },
) {
  const now = new Date();

  const result = await tx.supportTicket.updateMany({
    where: {
      id: input.ticketId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      status: input.status,
      resolvedAt:
        input.status === "RESOLVED" || input.status === "CLOSED" ? now : null,
      closedAt: input.status === "CLOSED" ? now : null,
      version: {
        increment: 1,
      },
    },
  });

  if (result.count !== 1) {
    throw new ConcurrencyConflictError("Support ticket");
  }

  return tx.supportTicket.findFirstOrThrow({
    where: {
      id: input.ticketId,
      organizationId: input.organizationId,
    },
    select: supportTicketSelect,
  });
}
