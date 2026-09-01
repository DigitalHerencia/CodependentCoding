import {
  createCampaign,
  updateCampaignStatus,
} from "@/lib/actions/marketingActions";
import { getAudiences, getCampaigns } from "@/lib/fetchers/marketingFetchers";

export const createCampaignWorkflow = createCampaign;
export const scheduleCampaignWorkflow = createCampaign;
export const updateCampaignStatusWorkflow = updateCampaignStatus;

export async function getMarketingWorkspaceWorkflow(limit = 50) {
  const [campaigns, audiences] = await Promise.all([
    getCampaigns(limit),
    getAudiences(limit),
  ]);
  return { campaigns, audiences };
}

export async function calculateCampaignMetricsWorkflow(campaignId: string) {
  const campaigns = await getCampaigns(100);
  const campaign = campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign was not found.");
  return campaign;
}
