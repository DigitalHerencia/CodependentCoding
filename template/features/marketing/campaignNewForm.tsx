import { getAudiences } from "@/lib/fetchers/marketingFetchers";
import { CampaignForm } from "./campaignForm.client";
export async function CampaignNewForm() {
  return <CampaignForm audiences={await getAudiences()} />;
}
