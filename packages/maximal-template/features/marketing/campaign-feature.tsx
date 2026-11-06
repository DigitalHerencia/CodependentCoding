import { MarketingCampaignDetailTemplate } from "@/components/templates/marketing-templates";
import { loadCampaignWorkflow } from "@/lib/workflows/marketingWorkflows";
import { EditCampaignStatusForm } from "./editCampaignStatusForm";

export async function CampaignFeature({ campaignId }: { campaignId: string }) {
  const { campaign, steps } = await loadCampaignWorkflow({ campaignId });
  return (
    <MarketingCampaignDetailTemplate campaign={campaign} steps={steps}>
      <EditCampaignStatusForm key={campaign.version} campaign={campaign} />
    </MarketingCampaignDetailTemplate>
  );
}
