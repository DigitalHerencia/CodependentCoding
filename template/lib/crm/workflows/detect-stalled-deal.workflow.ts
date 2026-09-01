import { detectStalledDeal } from "../../crm/logic/detect-stalled-deal.logic";
import { getCrmDeal } from "../../fetchers/crmFetchers";
export async function detectStalledDealWorkflow(dealId: string, now = new Date()) {
  const deal = await getCrmDeal(dealId);
  if (!deal) throw new Error("CRM deal was not found.");
  return detectStalledDeal({
    stage: deal.stage,
    updatedAt: new Date(deal.updatedAt),
    now,
  });
}
