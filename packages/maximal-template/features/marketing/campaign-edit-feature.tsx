import { loadCampaignEditWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewCampaignForm } from "./newCampaignForm";

export async function CampaignEditFeature({
  campaignId,
}: {
  campaignId: string;
}) {
  const { campaign, audiences } = await loadCampaignEditWorkflow({
    campaignId,
  });
  return <NewCampaignForm campaign={campaign} audiences={audiences} />;
}
