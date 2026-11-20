import { loadCampaignNewWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewCampaignForm } from "./newCampaignForm";
/** Prepare authorized audience options before rendering the creation form. */
export async function CampaignNewFeature() {
  return <NewCampaignForm {...await loadCampaignNewWorkflow()} />;
}

