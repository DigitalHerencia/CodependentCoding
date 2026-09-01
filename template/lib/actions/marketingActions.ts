"use server";

import {
  updateCampaignStatusWorkflow,
} from "../marketing/marketingWorkflows";
import { scheduleCampaignWorkflow } from "../marketing/workflows/schedule-campaign.workflow";

export async function createCampaign(input: unknown) {
  return scheduleCampaignWorkflow(input);
}
export async function updateCampaignStatus(input: unknown) {
  return updateCampaignStatusWorkflow(input);
}
