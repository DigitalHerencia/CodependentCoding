import { Suspense } from "react";

import { CampaignFeature } from "@/features/marketing/campaign-feature";
import { CampaignSkeleton } from "@/features/marketing/campaign-skeleton";

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
