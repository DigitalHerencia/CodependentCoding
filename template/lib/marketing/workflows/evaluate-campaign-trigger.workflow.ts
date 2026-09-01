import type { AudienceRule } from "../../marketing/logic/evaluate-audience-rules.logic";
import { evaluateAudienceRules } from "../../marketing/logic/evaluate-audience-rules.logic";
import { getCampaigns } from "../../fetchers/marketingFetchers";
export async function evaluateCampaignTriggerWorkflow(command: {
  campaignId: string;
  event: Record<string, unknown>;
  rules: AudienceRule[];
}) {
  const campaigns = await getCampaigns(100);
  if (!campaigns.some((campaign) => campaign.id === command.campaignId)) {
    throw new Error("Campaign was not found.");
  }
  return evaluateAudienceRules(command.event, command.rules);
}
