import { getCrmDeal, getCrmDeals } from "../../fetchers/crmFetchers";
import { calculateSalesVelocity } from "../../crm/logic/calculate-sales-velocity.logic";
export async function calculateSalesVelocityWorkflow(
  periodStart: Date,
  periodEnd: Date,
) {
  const summaries = await getCrmDeals(100);
  const wonDeals = await Promise.all(
    summaries
      .filter((deal) => deal.stage === "WON")
      .map((deal) => getCrmDeal(deal.id)),
  );
  return calculateSalesVelocity(
    wonDeals.flatMap((deal) =>
      deal?.closedAt ? [{ value: deal.value, closedAt: new Date(deal.closedAt) }] : [],
    ),
    periodStart,
    periodEnd,
  );
}
