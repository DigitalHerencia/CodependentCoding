import { Prisma } from "@/generated/prisma/browser";

/**
 * Canonical browser/server calculation using the original Prisma Decimal sequence.
 * Multiplication retains Decimal's working precision before four-place rounding;
 * replacing it with a single fixed-point rounding would alter large amounts.
 */
export function calculateInvoiceTotals(
  lines: Array<{ quantity: string; unitPrice: string; taxRate: string }>,
) {
  if (!lines.length || lines.length > 500)
    throw new Error("Invoice lines are invalid.");
  let subtotal = new Prisma.Decimal(0);
  let taxTotal = new Prisma.Decimal(0);
  const maximum = new Prisma.Decimal("999999999999999.9999");
  const calculatedLines = lines.map((line) => {
    if (
      !/^\d{1,9}(\.\d{1,3})?$/.test(line.quantity) ||
      !/^\d{1,15}(\.\d{1,4})?$/.test(line.unitPrice) ||
      !/^(0(\.\d{1,6})?|1(\.0{1,6})?)$/.test(line.taxRate)
    )
      throw new Error("Invoice line amounts are invalid.");
    const quantity = new Prisma.Decimal(line.quantity);
    const unitPrice = new Prisma.Decimal(line.unitPrice);
    const taxRate = new Prisma.Decimal(line.taxRate);
    if (quantity.lessThanOrEqualTo(0))
      throw new Error("Invoice line amounts are invalid.");
    const lineSubtotal = quantity.mul(unitPrice).toDecimalPlaces(4);
    const lineTax = lineSubtotal.mul(taxRate).toDecimalPlaces(4);
    const lineTotal = lineSubtotal.add(lineTax);
    subtotal = subtotal.add(lineSubtotal);
    taxTotal = taxTotal.add(lineTax);
    if (
      lineTotal.greaterThan(maximum) ||
      subtotal.add(taxTotal).greaterThan(maximum)
    )
      throw new Error("Invoice totals exceed storage precision.");
    return {
      quantity: quantity.toString(),
      unitPrice: unitPrice.toString(),
      taxRate: taxRate.toString(),
      lineSubtotal: lineSubtotal.toString(),
      lineTax: lineTax.toString(),
      lineTotal: lineTotal.toString(),
    };
  });
  return {
    lines: calculatedLines,
    subtotal: subtotal.toString(),
    taxTotal: taxTotal.toString(),
    total: subtotal.add(taxTotal).toString(),
  };
}

/** UTC calendar comparison only; presentation never mutates persisted lifecycle history. */
export function isInvoiceOverdue(
  invoice: { status: string; dueAt: string | null },
  today = new Date().toISOString().slice(0, 10),
) {
  return (
    (invoice.status === "OPEN" || invoice.status === "OVERDUE") &&
    invoice.dueAt !== null &&
    invoice.dueAt.slice(0, 10) < today
  );
}
