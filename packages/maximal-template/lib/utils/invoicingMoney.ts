import { decimalToUnits, unitsToDecimal } from "@/lib/utils/money";

/** Exact shared calculation: round each subtotal to four places, then tax half-up. */
export function calculateInvoiceTotals(
  lines: Array<{ quantity: string; unitPrice: string; taxRate: string }>,
) {
  if (!lines.length || lines.length > 500)
    throw new Error("Invoice lines are invalid.");
  let subtotal = 0n;
  let taxTotal = 0n;
  const maximum = 9999999999999999999n;
  const calculatedLines = lines.map((line) => {
    if (
      !/^\d{1,9}(\.\d{1,3})?$/.test(line.quantity) ||
      !/^\d{1,15}(\.\d{1,4})?$/.test(line.unitPrice) ||
      !/^(0(\.\d{1,6})?|1(\.0{1,6})?)$/.test(line.taxRate)
    )
      throw new Error("Invoice line amounts are invalid.");
    const quantity = decimalToUnits(line.quantity, 3);
    const unitPrice = decimalToUnits(line.unitPrice, 4);
    const taxRate = decimalToUnits(line.taxRate, 6);
    if (quantity <= 0n) throw new Error("Invoice line amounts are invalid.");
    const lineSubtotal = (quantity * unitPrice + 500n) / 1000n;
    const lineTax = (lineSubtotal * taxRate + 500000n) / 1000000n;
    const lineTotal = lineSubtotal + lineTax;
    subtotal += lineSubtotal;
    taxTotal += lineTax;
    if (lineTotal > maximum || subtotal + taxTotal > maximum)
      throw new Error("Invoice totals exceed storage precision.");
    return {
      quantity: unitsToDecimal(quantity, 3),
      unitPrice: unitsToDecimal(unitPrice, 4),
      taxRate: unitsToDecimal(taxRate, 6),
      lineSubtotal: unitsToDecimal(lineSubtotal, 4),
      lineTax: unitsToDecimal(lineTax, 4),
      lineTotal: unitsToDecimal(lineTotal, 4),
    };
  });
  return {
    lines: calculatedLines,
    subtotal: unitsToDecimal(subtotal, 4),
    taxTotal: unitsToDecimal(taxTotal, 4),
    total: unitsToDecimal(subtotal + taxTotal, 4),
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
