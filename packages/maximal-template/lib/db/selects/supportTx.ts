import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type {
  SupportCreateTxInput,
  SupportReplyTxInput,
  SupportStatusTxInput,
} from "@/types/supportTypes";
import {
  supportTicketSelect,
  supportTicketSelectForVisibility,
} from "./supportSelects";
import {
  ConcurrencyConflictError,
  InvariantViolationError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";
import { SUPPORT_STATUS_TRANSITIONS } from "@/lib/constants/supportConstants";

/** Serialize allocation per organization until commit, retaining the unique tenant-number constraint. */
export async function createSupportTicketTx(
  tx: Prisma.TransactionClient,
  input: SupportCreateTxInput,
) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${input.organizationId}))`;
  const latest = await tx.supportTicket.aggregate({
    where: { organizationId: input.organizationId },
    _max: { number: true },
  });
  return tx.supportTicket.create({
    data: {
      organizationId: input.organizationId,
      requesterUserId: input.requesterUserId,
      number: (latest._max.number ?? 0) + 1,
      subject: input.subject,
      description: input.description ?? null,
      priority: input.priority,
    },
    select: supportTicketSelect,
  });
}

/** Compare the authorized ticket version before a supported transition and preserve meaningful resolution history. */
export async function updateTicketStatusTx(
  tx: Prisma.TransactionClient,
  input: SupportStatusTxInput,
  customerView = true,
) {
  const select = supportTicketSelectForVisibility(customerView);
  const current = await tx.supportTicket.findFirst({
    where: { id: input.ticketId, organizationId: input.organizationId },
    select,
  });
  if (!current) throw new ResourceNotFoundError("Support ticket");
  if (current.version !== input.expectedVersion)
    throw new ConcurrencyConflictError("Support ticket");
  if (
    !(SUPPORT_STATUS_TRANSITIONS[current.status] as readonly string[]).includes(
      input.status,
    )
  )
    throw new InvariantViolationError("Unsupported ticket transition.");
  const now = new Date();
  const terminal = input.status === "RESOLVED" || input.status === "CLOSED";
  const result = await tx.supportTicket.updateMany({
    where: {
      id: input.ticketId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      status: input.status,
      resolvedAt: terminal ? (current.resolvedAt ?? now) : null,
      closedAt: input.status === "CLOSED" ? (current.closedAt ?? now) : null,
      version: { increment: 1 },
    },
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("Support ticket");
  return tx.supportTicket.findFirstOrThrow({
    where: { id: input.ticketId, organizationId: input.organizationId },
    select,
  });
}

/** Append a public record and update parent activity atomically without changing ticket status. */
export async function appendSupportReplyTx(
  tx: Prisma.TransactionClient,
  input: SupportReplyTxInput,
) {
  await tx.supportMessage.create({ data: { ...input, isInternal: false } });
  const result = await tx.supportTicket.updateMany({
    where: { id: input.ticketId, organizationId: input.organizationId },
    data: { updatedAt: new Date() },
  });
  if (result.count !== 1) throw new ResourceNotFoundError("Support ticket");
  return { saved: true };
}
