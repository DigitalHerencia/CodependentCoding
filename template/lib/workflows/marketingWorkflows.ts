import { getAudiences, getCampaigns } from "@/lib/fetchers/marketingFetchers";

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

export async function getMarketingRecordWorkflow(
  kind: "campaign" | "audience",
  id: string,
) {
  const workspace = await getMarketingWorkspaceWorkflow(100);
  const records =
    kind === "campaign" ? workspace.campaigns : workspace.audiences;
  return records.find((record) => record.id === id) ?? null;
}
