import { loadCampaignNewWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewCampaignForm } from "./newCampaignForm";

export async function CampaignNewFeature() {
  const { audiences } = await loadCampaignNewWorkflow();
  return <NewCampaignForm audiences={audiences} />;
}
