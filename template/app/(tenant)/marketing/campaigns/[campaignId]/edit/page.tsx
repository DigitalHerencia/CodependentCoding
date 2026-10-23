import { CampaignEditFeature } from "@/features/marketing/campaignEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return <CampaignEditFeature campaignId={campaignId} />;
}
