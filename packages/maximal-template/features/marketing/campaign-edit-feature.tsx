import { loadCampaignEditWorkflow } from "@/lib/workflows/marketingWorkflows";
import { NewCampaignForm } from "./newCampaignForm";
/** Load current versioned campaign data before rendering the editing form. */
export async function CampaignEditFeature({
  campaignId,
}: {
  campaignId: string;
}) {
  const data = await loadCampaignEditWorkflow({ campaignId });
  return <NewCampaignForm key={data.campaign.version} {...data} />;
}
