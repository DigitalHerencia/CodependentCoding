import { Prisma } from "../../../generated/prisma/client";

import { invoiceSelect } from "../selects/invoicing.selects";
import { InvariantViolationError } from "./errors";
import { calculateInvoiceTotals } from "../../workflows/invoicing/calculateInvoiceTotals";

export async function createInvoiceTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    createdByMembershipId: string;
    customerName: string;
    customerEmail?: string | null;
    currency: string;
    issuedAt?: Date | null;
    dueAt?: Date | null;
    lines: Array<{
      description: string;
      quantity: string;
      unitPrice: string;
      taxRate: string;
    }>;
  },
) {
  if (input.lines.length === 0) {
    throw new InvariantViolationError(
      "An invoice must contain at least one line.",
    );
  }

  const latest = await tx.invoice.aggregate({
    where: {
      organizationId: input.organizationId,
    },
    _max: {
      number: true,
    },
  });

  const number = (latest._max.number ?? 0) + 1;

  const calculated = calculateInvoiceTotals(input.lines);
  const lines = input.lines.map((line, index) => {
    const totals = calculated.lines[index]!;
    return {
      organizationId: input.organizationId,
      position: index + 1,
      description: line.description,
      quantity: totals.quantity,
      unitPrice: totals.unitPrice,
      taxRate: totals.taxRate,
      lineSubtotal: totals.lineSubtotal,
      lineTax: totals.lineTax,
      lineTotal: totals.lineTotal,
    };
  });

  return tx.invoice.create({
    data: {
      organizationId: input.organizationId,
      createdByMembershipId: input.createdByMembershipId,
      number,
      customerName: input.customerName,
      customerEmail: input.customerEmail ?? null,
      currency: input.currency,
      issuedAt: input.issuedAt ?? null,
      dueAt: input.dueAt ?? null,
      subtotal: calculated.subtotal,
      taxTotal: calculated.taxTotal,
      total: calculated.total,
      lines: {
        create: lines,
      },
    },
    select: invoiceSelect,
  });
}
