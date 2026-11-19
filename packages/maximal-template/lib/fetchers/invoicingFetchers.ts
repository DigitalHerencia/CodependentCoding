import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { persistedRecordIdSchema } from "@/schemas/commonSchemas";
import {
  invoiceListQuerySchema,
  expenseListQuerySchema,
} from "@/schemas/invoicingSchemas";
import { assertPermission, hasPermission } from "@/lib/authz/permissions";
import {
  toExpenseDTO,
  toInvoiceDTO,
  toInvoiceListDTO,
} from "@/lib/db/dtos/invoicingDtos";
import {
  expenseSelect,
  invoiceSelect,
  invoiceListSelect,
} from "@/lib/db/selects/invoicingSelects";
import { withAuthenticatedRead } from "@/lib/db/tenancy";
import type { InvoicingQuery } from "@/types/invoicingTypes";

/** Inclusive calendar bounds; invoices use creation day, expenses use incurred day. */
function range(query: InvoicingQuery) {
  return {
    ...(query.from ? { gte: new Date(`${query.from}T00:00:00.000Z`) } : {}),
    ...(query.to
      ? {
          lt: new Date(
            new Date(`${query.to}T00:00:00.000Z`).getTime() + 86400000,
          ),
        }
      : {}),
  };
}
function pagination(query: InvoicingQuery, total: number) {
  return {
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.ceil(total / query.pageSize),
  };
}
/** Bounded persisted invoice search with full-scope currency/status aggregates. */
export async function getInvoicesPage(rawQuery: unknown = {}) {
  const query = invoiceListQuerySchema.parse(rawQuery);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.invoice:read");
    const where: Prisma.InvoiceWhereInput = {
      organizationId: access.organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.currency ? { currency: query.currency } : {}),
      ...(query.from || query.to ? { createdAt: range(query) } : {}),
      ...(query.search
        ? {
            OR: [
              { customerName: { contains: query.search, mode: "insensitive" } },
              ...(/^\d+$/.test(query.search) &&
              Number(query.search) <= 2147483647
                ? [{ number: Number(query.search) }]
                : []),
            ],
          }
        : {}),
    };
    const orderBy: Prisma.InvoiceOrderByWithRelationInput =
      query.sort.startsWith("amount")
        ? { total: query.sort.endsWith("asc") ? "asc" : "desc" }
        : { createdAt: query.sort.endsWith("asc") ? "asc" : "desc" };
    const [rows, total, groups] = await Promise.all([
      tx.invoice.findMany({
        where,
        select: invoiceListSelect,
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
        orderBy: [
          ...(query.sort.startsWith("amount")
            ? [{ currency: "asc" as const }]
            : []),
          orderBy,
          { id: "asc" },
        ],
      }),
      tx.invoice.count({ where }),
      tx.invoice.groupBy({
        by: ["currency", "status"],
        where,
        _sum: { total: true },
        _count: { _all: true },
        orderBy: [{ currency: "asc" }, { status: "asc" }],
      }),
    ]);
    const invoices = rows.map(toInvoiceListDTO);
    return {
      invoices,
      summary: groups.map((group) => ({
        currency: group.currency,
        status: group.status,
        count: group._count._all,
        total: group._sum.total?.toString() ?? "0",
      })),
      pagination: pagination(query, total),
      query,
      permissions: {
        canCreate: hasPermission(access, "invoicing.invoice:create"),
        canUpdate: hasPermission(access, "invoicing.invoice:update"),
      },
    };
  });
}
/** Bounded persisted expense search; aggregates describe every authorized matching expense. */
export async function getExpensesPage(rawQuery: unknown = {}) {
  const query = expenseListQuerySchema.parse(rawQuery);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.expense:read");
    const where: Prisma.ExpenseWhereInput = {
      organizationId: access.organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.currency ? { currency: query.currency } : {}),
      ...(query.from || query.to ? { incurredAt: range(query) } : {}),
      ...(query.search
        ? {
            OR: [
              { vendor: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy: Prisma.ExpenseOrderByWithRelationInput =
      query.sort.startsWith("amount")
        ? { amount: query.sort.endsWith("asc") ? "asc" : "desc" }
        : { incurredAt: query.sort.endsWith("asc") ? "asc" : "desc" };
    const [rows, total, groups] = await Promise.all([
      tx.expense.findMany({
        where,
        select: expenseSelect,
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
        orderBy: [
          ...(query.sort.startsWith("amount")
            ? [{ currency: "asc" as const }]
            : []),
          orderBy,
          { id: "asc" },
        ],
      }),
      tx.expense.count({ where }),
      tx.expense.groupBy({
        by: ["currency", "status"],
        where,
        _sum: { amount: true },
        _count: { _all: true },
        orderBy: [{ currency: "asc" }, { status: "asc" }],
      }),
    ]);
    return {
      expenses: rows.map(toExpenseDTO),
      summary: groups.map((group) => ({
        currency: group.currency,
        status: group.status,
        count: group._count._all,
        total: group._sum.amount?.toString() ?? "0",
      })),
      pagination: pagination(query, total),
      query,
      permissions: {
        canCreate: hasPermission(access, "invoicing.expense:create"),
        canUpdate: hasPermission(access, "invoicing.expense:update"),
      },
    };
  });
}
/** Direct invoice lookup cannot lose records beyond the first list page. */
export async function getInvoicePage(rawId: unknown) {
  const id = persistedRecordIdSchema.parse(rawId);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.invoice:read");
    const row = await tx.invoice.findFirst({
      where: { id, organizationId: access.organizationId },
      select: invoiceSelect,
    });
    return {
      invoice: row ? toInvoiceDTO(row) : null,
      permissions: {
        canCreate: hasPermission(access, "invoicing.invoice:create"),
        canUpdate: hasPermission(access, "invoicing.invoice:update"),
      },
    };
  });
}
/** Direct tenant-authorized expense lookup with current mutation permissions. */
export async function getExpensePage(rawId: unknown) {
  const id = persistedRecordIdSchema.parse(rawId);
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "invoicing.expense:read");
    const row = await tx.expense.findFirst({
      where: { id, organizationId: access.organizationId },
      select: expenseSelect,
    });
    return {
      expense: row ? toExpenseDTO(row) : null,
      permissions: {
        canCreate: hasPermission(access, "invoicing.expense:create"),
        canUpdate: hasPermission(access, "invoicing.expense:update"),
      },
    };
  });
}
/** Require current create authority before showing a new invoice form. */
export async function getNewInvoiceContext() {
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "invoicing.invoice:create");
    return {
      permissions: {
        canCreate: true,
        canUpdate: hasPermission(access, "invoicing.invoice:update"),
      },
    };
  });
}
/** Require current create authority before showing a new expense form. */
export async function getNewExpenseContext() {
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "invoicing.expense:create");
    return {
      permissions: {
        canCreate: true,
        canUpdate: hasPermission(access, "invoicing.expense:update"),
      },
    };
  });
}
