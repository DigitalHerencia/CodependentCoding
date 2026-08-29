import { Prisma } from "../../../generated/prisma/client";

export function calculateSalesVelocity(
  wonDeals: Array<{ value: string; closedAt: Date }>,
  periodStart: Date,
  periodEnd: Date,
) {
  const days = Math.max(
    1,
    (periodEnd.getTime() - periodStart.getTime()) / 86_400_000,
  );
  const value = wonDeals
    .filter(
      (deal) => deal.closedAt >= periodStart && deal.closedAt <= periodEnd,
    )
    .reduce((sum, deal) => sum.add(deal.value), new Prisma.Decimal(0));
  return value.div(days).toDecimalPlaces(4).toString();
}
