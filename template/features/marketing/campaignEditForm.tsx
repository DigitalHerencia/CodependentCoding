import { notFound } from "next/navigation";
import { getCampaign, getAudiences } from "@/lib/fetchers/marketingFetchers";
import { CampaignForm } from "./campaignForm.client";
export async function CampaignEditForm({ campaignId }: { campaignId: string }) {
  const campaign = await getCampaign(campaignId);
  if (!campaign) notFound();
  return <CampaignForm campaign={campaign} audiences={await getAudiences()} />;
}
