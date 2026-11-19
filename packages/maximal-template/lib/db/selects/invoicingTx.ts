import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import {
  invoiceSelect,
  expenseSelect,
} from "@/lib/db/selects/invoicingSelects";
import { calculateInvoiceTotals } from "@/lib/utils/invoicingMoney";
import {
  InvariantViolationError,
  ConcurrencyConflictError,
  ResourceNotFoundError,
} from "@/lib/db/transactions/errors";

/** Allocate tenant-owned numbering under the transaction-scoped advisory lock. */
export async function createInvoiceTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    createdByMembershipId: string;
    actorUserId: string;
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

  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${input.organizationId}))`;
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
    const totals = calculated.lines[index];
    if (!totals) throw new Error("Invoice line totals are invalid.");
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

  const record = await tx.invoice.create({
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
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "invoice.created",
      resourceType: "Invoice",
      resourceId: record.id,
      metadata: {
        number: record.number,
        total: record.total.toString(),
        currency: record.currency,
      },
    },
  });
  return record;
}

/** Optimistic protected transition: a repeated or stale request creates no audit or side effects. */
export async function transitionInvoiceTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    invoiceId: string;
    expectedVersion: number;
    command: "approve" | "issue";
    actorUserId: string;
    membershipId: string;
  },
) {
  if (input.command !== "approve" && input.command !== "issue")
    throw new InvariantViolationError("Invoice transition is invalid.");
  const current = await tx.invoice.findFirst({
    where: { id: input.invoiceId, organizationId: input.organizationId },
    select: {
      status: true,
      version: true,
      approvedAt: true,
      approvedByMembershipId: true,
    },
  });
  if (!current) throw new ResourceNotFoundError("Invoice");
  if (current.version !== input.expectedVersion)
    throw new ConcurrencyConflictError("Invoice");
  const draft = current.status === "DRAFT";
  if (
    input.command === "approve"
      ? !draft || current.approvedAt !== null
      : !draft || current.approvedAt === null
  )
    throw new InvariantViolationError("Invoice transition is invalid.");
  const data: Prisma.InvoiceUncheckedUpdateManyInput = {
    version: { increment: 1 },
  };
  if (input.command === "approve") {
    data.approvedAt = new Date();
    data.approvedByMembershipId = input.membershipId;
  } else data.status = "OPEN";
  const result = await tx.invoice.updateMany({
    where: {
      id: input.invoiceId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
      status: current.status,
      approvedAt: current.approvedAt,
      approvedByMembershipId: current.approvedByMembershipId,
    },
    data,
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("Invoice");
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action:
        input.command === "approve" ? "invoice.approved" : "invoice.issued",
      resourceType: "Invoice",
      resourceId: input.invoiceId,
      metadata: { previousStatus: current.status, command: input.command },
    },
  });
  return tx.invoice.findFirstOrThrow({
    where: { id: input.invoiceId, organizationId: input.organizationId },
    select: invoiceSelect,
  });
}

/** Submit only supported expenses; any receipt must already be independently authorized. */
export async function submitExpenseTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    submittedByMembershipId: string;
    actorUserId: string;
    vendor: string;
    description?: string | null;
    amount: string;
    currency: string;
    incurredAt: Date;
  },
) {
  const record = await tx.expense.create({
    data: {
      organizationId: input.organizationId,
      submittedByMembershipId: input.submittedByMembershipId,
      vendor: input.vendor,
      description: input.description ?? null,
      amount: input.amount,
      currency: input.currency,
      incurredAt: input.incurredAt,
      status: "SUBMITTED",
    },
    select: expenseSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "expense.submitted",
      resourceType: "Expense",
      resourceId: record.id,
    },
  });
  return record;
}

/** Replace a current unapproved draft's header, lines, and audit atomically. */
export async function updateInvoiceTx(
  tx: Prisma.TransactionClient,
  input: Omit<
    Parameters<typeof createInvoiceTx>[1],
    "createdByMembershipId"
  > & { invoiceId: string; expectedVersion: number },
) {
  const calculated = calculateInvoiceTotals(input.lines);
  const result = await tx.invoice.updateMany({
    where: {
      id: input.invoiceId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
      status: "DRAFT",
      approvedAt: null,
    },
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail ?? null,
      currency: input.currency,
      issuedAt: input.issuedAt ?? null,
      dueAt: input.dueAt ?? null,
      subtotal: calculated.subtotal,
      taxTotal: calculated.taxTotal,
      total: calculated.total,
      version: { increment: 1 },
    },
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("Invoice");
  await tx.invoiceLine.deleteMany({
    where: { invoiceId: input.invoiceId, organizationId: input.organizationId },
  });
  await tx.invoiceLine.createMany({
    data: input.lines.map((line, index) => {
      const totals = calculated.lines[index];
      if (!totals)
        throw new InvariantViolationError("Invoice line totals are invalid.");
      return {
        organizationId: input.organizationId,
        invoiceId: input.invoiceId,
        position: index + 1,
        description: line.description,
        ...totals,
      };
    }),
  });
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "invoice.updated",
      resourceType: "Invoice",
      resourceId: input.invoiceId,
    },
  });
  return tx.invoice.findFirstOrThrow({
    where: { id: input.invoiceId, organizationId: input.organizationId },
    select: invoiceSelect,
  });
}
/** Update only the expected unreviewed expense, preserving reviewed financial history. */
export async function updateExpenseTx(
  tx: Prisma.TransactionClient,
  input: Omit<
    Parameters<typeof submitExpenseTx>[1],
    "submittedByMembershipId"
  > & { expenseId: string; expectedUpdatedAt: Date },
) {
  const result = await tx.expense.updateMany({
    where: {
      id: input.expenseId,
      organizationId: input.organizationId,
      updatedAt: input.expectedUpdatedAt,
      status: { in: ["DRAFT", "SUBMITTED"] },
    },
    data: {
      vendor: input.vendor,
      description: input.description ?? null,
      amount: input.amount,
      currency: input.currency,
      incurredAt: input.incurredAt,
    },
  });
  if (result.count !== 1) throw new ConcurrencyConflictError("Expense");
  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "expense.updated",
      resourceType: "Expense",
      resourceId: input.expenseId,
    },
  });
  return tx.expense.findFirstOrThrow({
    where: { id: input.expenseId, organizationId: input.organizationId },
    select: expenseSelect,
  });
}
