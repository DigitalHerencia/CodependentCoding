import { Prisma } from "../../../generated/prisma/client";

export function calculateTaxes(
  subtotal: string | Prisma.Decimal,
  taxRate: string | Prisma.Decimal,
) {
  const amount = new Prisma.Decimal(subtotal);
  const rate = new Prisma.Decimal(taxRate);
  if (amount.isNegative() || rate.isNegative() || rate.greaterThan(1))
    throw new Error("Invoice tax inputs are invalid.");
  return amount.mul(rate).toDecimalPlaces(4);
}

