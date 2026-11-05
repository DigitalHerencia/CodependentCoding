import { CampaignFeatureClient } from "./campaign-feature.client";
import { notFound } from "next/navigation";
import {
  getCampaign,
  getCampaignSteps,
} from "@/lib/fetchers/marketingFetchers";
import { MarketingCampaignDetailTemplate } from "@/components/templates/marketing-templates";
export async function CampaignFeature({ campaignId }: { campaignId: string }) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) notFound();
  return (
    <MarketingCampaignDetailTemplate
      campaign={campaign}
      steps={await getCampaignSteps(campaignId)}
    >
      <CampaignFeatureClient key={campaign.version} campaign={campaign} />
    </MarketingCampaignDetailTemplate>
  );
}
