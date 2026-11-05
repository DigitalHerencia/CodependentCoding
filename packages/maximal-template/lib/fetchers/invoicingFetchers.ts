import {
  persistedReadLimitSchema,
  persistedRecordIdSchema,
} from "@/schema/commonSchemas";
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { toExpenseDTO, toInvoiceDTO } from "@/lib/db/dtos/invoicingDtos";
import {
  expenseSelect,
  invoiceSelect,
} from "@/lib/db/selects/invoicingSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getInvoices(rawLimit: unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.invoice:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.invoice.findMany({
      where: {
        organizationId: access.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(Math.max(limit, 1), 100),
      select: invoiceSelect,
    });

    return rows.map(toInvoiceDTO);
  });
}

export async function getInvoice(rawInvoiceId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.invoice:read");
    const invoiceId = persistedRecordIdSchema.parse(rawInvoiceId);

    const record = await tx.invoice.findFirst({
      where: {
        id: invoiceId,
        organizationId: access.organizationId,
      },
      select: invoiceSelect,
    });

    return record ? toInvoiceDTO(record) : null;
  });
}

export async function getExpenses(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.expense:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);
    const rows = await tx.expense.findMany({
      where: { organizationId: access.organizationId },
      orderBy: { incurredAt: "desc" },
      take: Math.min(Math.max(limit, 1), 200),
      select: expenseSelect,
    });
    return rows.map(toExpenseDTO);
  });
}

export async function getExpense(rawExpenseId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.expense:read");
    const expenseId = persistedRecordIdSchema.parse(rawExpenseId);
    const row = await tx.expense.findFirst({
      where: { id: expenseId, organizationId: access.organizationId },
      select: expenseSelect,
    });
    return row ? toExpenseDTO(row) : null;
  });
}
