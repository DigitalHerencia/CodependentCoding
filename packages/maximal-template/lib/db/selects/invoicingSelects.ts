import "server-only";

import type { Prisma } from "@/generated/prisma/client";

/** Invoice detail projection includes persisted lines, totals and approval presentation only. */
export const invoiceSelect = {
  id: true,
  number: true,
  customerName: true,
  customerEmail: true,
  currency: true,
  subtotal: true,
  taxTotal: true,
  total: true,
  status: true,
  issuedAt: true,
  dueAt: true,
  paidAt: true,
  approvedAt: true,
  approvedBy: {
    select: {
      user: { select: { displayName: true } },
    },
  },
  version: true,
  lines: {
    orderBy: {
      position: "asc",
    },
    select: {
      id: true,
      position: true,
      description: true,
      quantity: true,
      unitPrice: true,
      taxRate: true,
      lineSubtotal: true,
      lineTax: true,
      lineTotal: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InvoiceSelect;

/** Database detail record corresponding exactly to the approved invoice projection. */
export type InvoiceRecord = Prisma.InvoiceGetPayload<{
  select: typeof invoiceSelect;
}>;

/** Expense projection omits receipt storage details and internal membership identifiers. */
export const expenseSelect = {
  updatedAt: true,
  id: true,
  vendor: true,
  description: true,
  amount: true,
  currency: true,
  incurredAt: true,
  status: true,
  submittedBy: { select: { user: { select: { displayName: true } } } },
} satisfies Prisma.ExpenseSelect;

/** Database expense record for explicit transport mapping. */
export type ExpenseRecord = Prisma.ExpenseGetPayload<{
  select: typeof expenseSelect;
}>;

/** Invoice list projection excludes contacts, authorization identities and line items. */
export const invoiceListSelect = {
  id: true,
  number: true,
  customerName: true,
  currency: true,
  total: true,
  status: true,
  issuedAt: true,
  dueAt: true,
  paidAt: true,
  approvedAt: true,
  version: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InvoiceSelect;

/** Database list row containing only invoice table presentation fields. */
export type InvoiceListRecord = Prisma.InvoiceGetPayload<{
  select: typeof invoiceListSelect;
}>;
