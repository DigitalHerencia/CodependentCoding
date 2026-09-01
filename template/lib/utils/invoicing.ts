import { Prisma } from "@/generated/prisma/client";

export function calculateTaxes(
  subtotal: string | Prisma.Decimal,
  taxRate: string | Prisma.Decimal,
) {
  const amount = new Prisma.Decimal(subtotal);
  const rate = new Prisma.Decimal(taxRate);
  if (amount.isNegative() || rate.isNegative() || rate.greaterThan(1)) {
    throw new Error("Invoice tax inputs are invalid.");
  }
  return amount.mul(rate).toDecimalPlaces(4);
}

export function calculateInvoiceTotals(
  lines: Array<{ quantity: string; unitPrice: string; taxRate: string }>,
) {
  let subtotal = new Prisma.Decimal(0);
  let taxTotal = new Prisma.Decimal(0);
  const calculatedLines = lines.map((line) => {
    const quantity = new Prisma.Decimal(line.quantity);
    const unitPrice = new Prisma.Decimal(line.unitPrice);
    if (quantity.lessThanOrEqualTo(0) || unitPrice.isNegative()) {
      throw new Error("Invoice line amounts are invalid.");
    }
    const lineSubtotal = quantity.mul(unitPrice).toDecimalPlaces(4);
    const lineTax = calculateTaxes(lineSubtotal, line.taxRate);
    const lineTotal = lineSubtotal.add(lineTax);
    subtotal = subtotal.add(lineSubtotal);
    taxTotal = taxTotal.add(lineTax);
    return {
      quantity,
      unitPrice,
      taxRate: new Prisma.Decimal(line.taxRate),
      lineSubtotal,
      lineTax,
      lineTotal,
    };
  });
  return {
    lines: calculatedLines,
    subtotal,
    taxTotal,
    total: subtotal.add(taxTotal),
  };
}
