import { Prisma } from "../../../generated/prisma/client";

export function applyCurrencyCalculations(
  amounts: { subtotal: string; taxTotal: string; total: string },
  exchangeRate: string,
) {
  const rate = new Prisma.Decimal(exchangeRate);
  if (rate.lessThanOrEqualTo(0)) {
    throw new Error("The currency exchange rate must be positive.");
  }
  return {
    subtotal: new Prisma.Decimal(amounts.subtotal).mul(rate).toDecimalPlaces(4).toString(),
    taxTotal: new Prisma.Decimal(amounts.taxTotal).mul(rate).toDecimalPlaces(4).toString(),
    total: new Prisma.Decimal(amounts.total).mul(rate).toDecimalPlaces(4).toString(),
  };
}

