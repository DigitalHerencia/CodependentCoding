import { updateCampaignStatusWorkflow } from "../../marketing/marketingWorkflows";
export async function advanceCampaignSequenceWorkflow(input: {
  campaignId: string;
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELED";
  expectedVersion: number;
}) {
  return updateCampaignStatusWorkflow(input);
}
