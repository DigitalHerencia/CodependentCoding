import { decimalToUnits, unitsToDecimal } from "@/lib/utils/money";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";

/**
 * Calculate the exact probability-weighted open CRM pipeline.
 *
 * @param deals Opportunity value, probability and stage DTO fields.
 * @returns Exact decimal value without floating-point currency loss.
 */
export function calculateCrmPipelineValue(
  deals: ReadonlyArray<Pick<CrmDealSummaryDTO, "value" | "probability" | "stage">>,
): string {
  const precision = 6;
  const units = deals.reduce(
    (sum, deal) => deal.stage === "LOST"
      ? sum
      : sum + decimalToUnits(deal.value, precision) * BigInt(deal.probability) / 100n,
    0n,
  );
  return unitsToDecimal(units, precision);
}
