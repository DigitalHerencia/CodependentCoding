import { Suspense } from "react";

import { CampaignFeature } from "@/features/marketing/campaignFeature";
import { CampaignSkeleton } from "@/features/marketing/campaignSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return (
    <Suspense fallback={<CampaignSkeleton />}>
      <CampaignFeature campaignId={campaignId} />
    </Suspense>
  );
}
