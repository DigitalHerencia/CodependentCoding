import { getCampaigns } from "@/lib/fetchers/marketingFetchers";
import { CampaignsFeatureClient } from "./campaignsFeature.client";
export async function CampaignsFeature() {
  return <CampaignsFeatureClient campaigns={await getCampaigns(100)} />;
}
