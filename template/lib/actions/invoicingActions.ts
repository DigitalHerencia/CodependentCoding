"use server";

import {
  updateInvoiceSchema,
  expenseFormSchema,
  updateExpenseSchema,
  createInvoiceSchema,
  updateInvoiceStatusSchema,
} from "@/schema/invoicingSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toExpenseDTO, toInvoiceDTO } from "@/lib/db/dtos/invoicingDtos";
import { withTenantTransaction } from "@/lib/db/tenant";
import {
  calculateInvoiceTotals,
  createInvoiceTx,
} from "@/lib/db/transactions/invoicingCreateInvoiceTx";
import {
  expenseSelect,
  invoiceSelect,
} from "@/lib/db/selects/invoicingSelects";
import {
  approveInvoiceTx,
  submitExpenseTx,
} from "@/lib/db/transactions/invoicingTx";
import { updateInvoiceStatusTx } from "@/lib/db/transactions/invoicingUpdateInvoiceStatusTx";

export async function createInvoice(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:create");
    const input = createInvoiceSchema.parse(rawInput);
    const record = await createInvoiceTx(tx, {
      organizationId: access.organizationId,
      createdByMembershipId: access.membershipId,
      customerName: input.customerName,
      customerEmail: input.customerEmail ?? null,
      currency: input.currency,
      issuedAt: input.issuedAt ?? null,
      dueAt: input.dueAt ?? null,
      lines: input.lines,
    });
    await tx.auditEvent.create({
      data: {
        organizationId: access.organizationId,
        actorUserId: access.userId,
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
    return toInvoiceDTO(record);
  });
}

export async function updateInvoiceStatus(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    const input = updateInvoiceStatusSchema.parse(rawInput);
    const record = await updateInvoiceStatusTx(tx, {
      organizationId: access.organizationId,
      invoiceId: input.invoiceId,
      status: input.status,
      expectedVersion: input.expectedVersion,
    });
    return toInvoiceDTO(record);
  });
}

export async function updateInvoice(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    const input = updateInvoiceSchema.parse(rawInput);
    const calculated = calculateInvoiceTotals(input.lines);
    const result = await tx.invoice.updateMany({
      where: {
        id: input.invoiceId,
        organizationId: access.organizationId,
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
    if (result.count !== 1)
      throw new Error("Only the current unapproved draft can be edited.");
    await tx.invoiceLine.deleteMany({
      where: {
        invoiceId: input.invoiceId,
        organizationId: access.organizationId,
      },
    });
    await tx.invoiceLine.createMany({
      data: input.lines.map((line, index) => {
        const totals = calculated.lines[index];
        if (!totals) throw new Error("Invoice line totals are missing.");
        return {
          organizationId: access.organizationId,
          invoiceId: input.invoiceId,
          position: index + 1,
          description: line.description,
          ...totals,
        };
      }),
    });
    return toInvoiceDTO(
      await tx.invoice.findFirstOrThrow({
        where: { id: input.invoiceId, organizationId: access.organizationId },
        select: invoiceSelect,
      }),
    );
  });
}
export async function createExpense(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.expense:create");
    const input = expenseFormSchema.parse(rawInput);
    return toExpenseDTO(
      await submitExpenseTx(tx, {
        ...input,
        organizationId: access.organizationId,
        submittedByMembershipId: access.membershipId,
      }),
    );
  });
}
export async function updateExpense(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.expense:update");
    const input = updateExpenseSchema.parse(rawInput);
    const result = await tx.expense.updateMany({
      where: {
        id: input.expenseId,
        organizationId: access.organizationId,
        updatedAt: input.expectedUpdatedAt,
        status: { in: ["DRAFT", "SUBMITTED"] },
      },
      data: {
        vendor: input.vendor,
        description: input.description,
        amount: input.amount,
        currency: input.currency,
        incurredAt: input.incurredAt,
      },
    });
    if (result.count !== 1)
      throw new Error("Expense changed or has already been reviewed.");
    return toExpenseDTO(
      await tx.expense.findFirstOrThrow({
        where: { id: input.expenseId, organizationId: access.organizationId },
        select: expenseSelect,
      }),
    );
  });
}

export async function approveInvoice(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    const input = updateInvoiceStatusSchema
      .pick({ invoiceId: true, expectedVersion: true })
      .parse(rawInput);
    return toInvoiceDTO(
      await approveInvoiceTx(tx, {
        ...input,
        organizationId: access.organizationId,
        approverMembershipId: access.membershipId,
      }),
    );
  });
}
export async function issueApprovedInvoice(rawInput: unknown) {
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "invoicing.invoice:update");
    const input = updateInvoiceStatusSchema
      .pick({ invoiceId: true, expectedVersion: true })
      .parse(rawInput);
    const result = await tx.invoice.updateMany({
      where: {
        id: input.invoiceId,
        organizationId: access.organizationId,
        version: input.expectedVersion,
        status: "DRAFT",
        approvedAt: { not: null },
      },
      data: { status: "OPEN", version: { increment: 1 } },
    });
    if (result.count !== 1)
      throw new Error("Only the current approved draft can be issued.");
    return toInvoiceDTO(
      await tx.invoice.findFirstOrThrow({
        where: { id: input.invoiceId, organizationId: access.organizationId },
        select: invoiceSelect,
      }),
    );
  });
}
