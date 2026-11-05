import "server-only";

import {
  getClosedWonCrmValue,
  getContactById,
  getCrmDeal,
  getCrmDeals,
  getCrmAccount,
  getContacts,
} from "@/lib/fetchers/crmFetchers";

import { decimalToUnits, unitsToDecimal } from "@/lib/utils/money";
import type { CrmDealSummaryDTO } from "@/types/crmTypes";

// Decimal(19, 4) deal values weighted by whole percentages need six places.
const PIPELINE_SCALE = 6;

export async function getCrmWorkspaceWorkflow(limit = 100) {
  const [deals, contacts] = await Promise.all([
    getCrmDeals(limit),
    getContacts({ limit, sort: "name-asc" }),
  ]);
  return { deals, contacts };
}

export async function getCrmRecordWorkflow(
  kind: "deal" | "contact" | "account",
  id: string,
) {
  if (kind === "deal") return getCrmDeal(id);
  if (kind === "account") return getCrmAccount(id);
  return getContactById(id);
}
export async function detectStalledDealWorkflow(
  dealId: string,
  now = new Date(),
  staleAfterDays = 14,
) {
  const deal = await getCrmDeal(dealId);
  if (!deal) throw new Error("CRM deal was not found.");
  if (deal.stage === "WON" || deal.stage === "LOST") return false;
  return (
    now.getTime() - new Date(deal.updatedAt).getTime() >=
    staleAfterDays * 86_400_000
  );
}

export async function calculatePipelineValueWorkflow(limit = 100) {
  return calculatePipelineValue(await getCrmDeals(limit));
}

export async function calculateSalesVelocityWorkflow(
  periodStart: Date,
  periodEnd: Date,
) {
  if (periodEnd < periodStart) {
    throw new Error("The sales velocity period end must follow its start.");
  }
  const closedWonValue = await getClosedWonCrmValue(periodStart, periodEnd);
  const days = Math.max(
    1,
    (periodEnd.getTime() - periodStart.getTime()) / 86_400_000,
  );
  return (Number(closedWonValue) / days).toFixed(4);
}

export function calculatePipelineValue(
  deals: ReadonlyArray<
    Pick<CrmDealSummaryDTO, "value" | "probability" | "stage">
  >,
) {
  const total = deals.reduce(
    (sum, deal) =>
      deal.stage === "LOST"
        ? sum
        : sum +
          (decimalToUnits(deal.value, PIPELINE_SCALE) *
            BigInt(deal.probability)) /
            100n,
    0n,
  );
  return unitsToDecimal(total, PIPELINE_SCALE);
}
