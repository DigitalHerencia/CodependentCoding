import { getAudiences } from "@/lib/fetchers/marketingFetchers";
import { CampaignForm } from "./campaign-form.client";
export async function CampaignNewFeature() {
  return <CampaignForm audiences={await getAudiences()} />;
}
