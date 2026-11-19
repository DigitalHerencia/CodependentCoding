import "server-only";

import type {
  ExpenseDTO,
  InvoiceDTO,
  InvoiceListDTO,
} from "@/types/invoicingTypes";
import type {
  ExpenseRecord,
  InvoiceRecord,
  InvoiceListRecord,
} from "@/lib/db/selects/invoicingSelects";

/** Serialize expense decimals explicitly and preserve its incurred calendar day. */
export function toExpenseDTO(record: ExpenseRecord): ExpenseDTO {
  return {
    updatedAt: record.updatedAt.toISOString(),
    id: record.id,
    vendor: record.vendor,
    description: record.description,
    amount: record.amount.toString(),
    currency: record.currency,
    incurredAt: record.incurredAt.toISOString().slice(0, 10),
    status: record.status,
    submitter: record.submittedBy?.user.displayName ?? null,
  };
}

/** Serialize persisted invoice details without exposing internal authority identifiers. */
export function toInvoiceDTO(record: InvoiceRecord): InvoiceDTO {
  return {
    id: record.id,
    number: record.number,
    customerName: record.customerName,
    customerEmail: record.customerEmail,
    currency: record.currency,
    subtotal: record.subtotal.toString(),
    taxTotal: record.taxTotal.toString(),
    total: record.total.toString(),
    status: record.status,
    issuedAt: record.issuedAt?.toISOString().slice(0, 10) ?? null,
    dueAt: record.dueAt?.toISOString().slice(0, 10) ?? null,
    paidAt: record.paidAt?.toISOString() ?? null,
    approvedAt: record.approvedAt?.toISOString() ?? null,
    approvedBy: record.approvedBy
      ? {
          displayName: record.approvedBy.user.displayName,
        }
      : null,
    version: record.version,
    lines: record.lines.map((line) => ({
      id: line.id,
      position: line.position,
      description: line.description,
      quantity: line.quantity.toString(),
      unitPrice: line.unitPrice.toString(),
      taxRate: line.taxRate.toString(),
      lineSubtotal: line.lineSubtotal.toString(),
      lineTax: line.lineTax.toString(),
      lineTotal: line.lineTotal.toString(),
    })),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

/** Map a minimal invoice list row into transport-safe decimal and date text. */
export function toInvoiceListDTO(record: InvoiceListRecord): InvoiceListDTO {
  return {
    id: record.id,
    number: record.number,
    customerName: record.customerName,
    currency: record.currency,
    total: record.total.toString(),
    status: record.status,
    issuedAt: record.issuedAt?.toISOString().slice(0, 10) ?? null,
    dueAt: record.dueAt?.toISOString().slice(0, 10) ?? null,
    paidAt: record.paidAt?.toISOString() ?? null,
    approvedAt: record.approvedAt?.toISOString() ?? null,
    version: record.version,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
