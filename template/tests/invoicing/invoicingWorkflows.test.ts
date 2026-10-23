import assert from "node:assert/strict";
import { test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { calculateInvoiceTotals } from "@/lib/db/transactions/invoicing-create-invoice.tx";
import { expenseFormSchema } from "@/schemas/invoicingSchemas";
import { InvoicingInvoiceDetailTemplate } from "@/components/templates/invoicingInvoiceDetailTemplate";
import type { InvoiceDTO } from "@/types/invoicingTypes";

const id = "00000000-0000-4000-8000-000000000001";

test("expenses reject nonpositive amounts and invalid dates", () => {
  const input = {
    vendor: "Vendor",
    description: "Travel",
    currency: "USD",
    incurredAt: "2026-09-08",
  };
  assert.equal(
    expenseFormSchema.safeParse({ ...input, amount: "0" }).success,
    false,
  );
  assert.equal(
    expenseFormSchema.safeParse({ ...input, amount: "-10" }).success,
    false,
  );
  assert.equal(
    expenseFormSchema.safeParse({
      ...input,
      amount: "10",
      incurredAt: "invalid",
    }).success,
    false,
  );
});

test("invoice totals preserve decimal precision and tax rounding", () => {
  const totals = calculateInvoiceTotals([
    { quantity: "3", unitPrice: "0.1", taxRate: "0.0825" },
    { quantity: "2.5", unitPrice: "12.3456", taxRate: "0" },
  ]);
  assert.equal(totals.subtotal.toString(), "31.164");
  assert.equal(totals.taxTotal.toString(), "0.0248");
  assert.equal(totals.total.toString(), "31.1888");
  assert.throws(
    () =>
      calculateInvoiceTotals([
        { quantity: "0", unitPrice: "10", taxRate: "0" },
      ]),
    /invalid/,
  );
});

test("invoice detail renders persisted line items and calculated total", () => {
  const invoice: InvoiceDTO = {
    id,
    number: 42,
    customerName: "Acme",
    customerEmail: null,
    currency: "USD",
    subtotal: "100",
    taxTotal: "5",
    total: "105",
    status: "DRAFT",
    issuedAt: null,
    dueAt: null,
    paidAt: null,
    approvedAt: null,
    approvedBy: null,
    version: 1,
    createdAt: "2026-09-08",
    updatedAt: "2026-09-08",
    lines: [
      {
        id,
        position: 1,
        description: "Design services",
        quantity: "2",
        unitPrice: "50",
        taxRate: "0.05",
        lineSubtotal: "100",
        lineTax: "5",
        lineTotal: "105",
      },
    ],
  };
  const html = renderToStaticMarkup(
    createElement(InvoicingInvoiceDetailTemplate, { invoice }, null),
  );
  assert.match(html, /Design services/);
  assert.match(html, /Bill to/);
  assert.match(html, /105/);
  assert.doesNotMatch(html, /SERVER|Records/);
});
