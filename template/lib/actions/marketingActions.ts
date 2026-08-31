"use server";

import { createCampaignWorkflow, updateCampaignStatusWorkflow } from "../marketing/workflows/marketingWorkflows";

export async function createCampaign(input: unknown) { return createCampaignWorkflow(input); }
export async function updateCampaignStatus(input: unknown) { return updateCampaignStatusWorkflow(input); }
