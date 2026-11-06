import {
  getAudience,
  getAudiences,
  getCampaign,
  getCampaigns,
  getCampaignSteps,
} from "@/lib/fetchers/marketingFetchers";
import { describeAudienceWorkflow } from "@/lib/workflows/marketingClientWorkflows";
import { notFound } from "next/navigation";
import "server-only";

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

export async function loadAudienceEditWorkflow({
  audienceId,
}: {
  audienceId: string;
}) {
  const audience = await getAudience(audienceId);
  if (!audience) notFound();
  return { audience };
}

export async function loadAudienceWorkflow({
  audienceId,
}: {
  audienceId: string;
}) {
  const audience = await getAudience(audienceId);
  if (!audience) notFound();
  return { audience: describeAudienceWorkflow(audience) };
}

export async function loadAudiencesWorkflow() {
  const audiences = await getAudiences();
  return { audiences };
}

export async function loadCampaignEditWorkflow({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) notFound();
  const audiences = await getAudiences();
  return { campaign, audiences };
}

export async function loadCampaignWorkflow({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) notFound();
  const steps = await getCampaignSteps(campaignId);
  return { campaign, steps };
}

export async function loadCampaignNewWorkflow() {
  const audiences = await getAudiences();
  return { audiences };
}

export async function loadCampaignsWorkflow() {
  const campaigns = await getCampaigns(100);
  return { campaigns };
}

export async function loadMarketingAnalyticsWorkflow() {
  const campaigns = await getCampaigns(100);
  return { campaigns };
}
