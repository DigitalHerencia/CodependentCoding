import { loadCampaignsWorkflow } from "@/lib/workflows/marketingWorkflows";
import { CampaignsFeatureClient } from "./campaigns-feature.client";

export async function CampaignsFeature() {
  const { campaigns } = await loadCampaignsWorkflow();
  return <CampaignsFeatureClient campaigns={campaigns} />;
}
