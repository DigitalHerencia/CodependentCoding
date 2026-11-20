import { MarketingCampaignDetailTemplate } from "@/components/templates/marketing-templates";
import { loadCampaignWorkflow } from "@/lib/workflows/marketingWorkflows";
import { EditCampaignStatusForm } from "./editCampaignStatusForm";
/** Compose the direct campaign read with the independently secured planning command form. */
export async function CampaignFeature({
  campaignId,
  stepPage,
}: {
  campaignId: string;
  stepPage?: unknown;
}) {
  const data = await loadCampaignWorkflow({ campaignId, stepPage });
  return (
    <MarketingCampaignDetailTemplate {...data}>
      {data.capabilities.canUpdateCampaigns ? (
        <EditCampaignStatusForm
          campaign={data.campaign}
          transitions={data.transitions}
        />
      ) : null}
    </MarketingCampaignDetailTemplate>
  );
}
