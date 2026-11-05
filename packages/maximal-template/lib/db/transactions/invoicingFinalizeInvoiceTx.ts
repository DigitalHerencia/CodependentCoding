import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { invoiceSelect } from "@/lib/db/selects/invoicingSelects";
import { InvariantViolationError, staleOrMissing } from "./errors";

/** DRAFT → OPEN at the version the caller read, audited. */
export async function finalizeInvoiceTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    actorUserId: string;
    invoiceId: string;
    expectedVersion: number;
  },
) {
  const current = await tx.invoice.findFirst({
    where: { id: input.invoiceId, organizationId: input.organizationId },
    select: { status: true },
  });
  if (current && current.status !== "DRAFT") {
    throw new InvariantViolationError("Only a draft invoice can be finalized.");
  }
  const result = await tx.invoice.updateMany({
    where: {
      id: input.invoiceId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
      status: "DRAFT",
    },
    data: { status: "OPEN", version: { increment: 1 } },
  });
  if (result.count !== 1) throw staleOrMissing("Invoice", current !== null);
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "invoicing.invoice.finalized",
      resourceType: "Invoice",
      resourceId: input.invoiceId,
    },
  });
  return tx.invoice.findFirstOrThrow({
    where: { id: input.invoiceId, organizationId: input.organizationId },
    select: invoiceSelect,
  });
}
