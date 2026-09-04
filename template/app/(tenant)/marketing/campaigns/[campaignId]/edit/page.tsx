import { CampaignEditForm } from "@/features/marketing/campaignEditForm";

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return <CampaignEditForm campaignId={campaignId} />;
}
