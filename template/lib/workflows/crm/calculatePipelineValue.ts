import { Prisma } from "../../../generated/prisma/client";

export function calculatePipelineValue(
  deals: Array<{ value: string; probability: number; stage: string }>,
) {
  return deals
    .reduce(
      (total, deal) =>
        deal.stage === "LOST"
          ? total
          : total.add(
              new Prisma.Decimal(deal.value).mul(deal.probability).div(100),
            ),
      new Prisma.Decimal(0),
    )
    .toString();
}
