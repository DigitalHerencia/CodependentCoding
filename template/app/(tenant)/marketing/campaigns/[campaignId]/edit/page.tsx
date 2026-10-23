import { Suspense } from "react";

import { CampaignEditFeature } from "@/features/marketing/campaignEditFeature";
import { CampaignFormSkeleton } from "@/features/marketing/campaignFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return (
    <Suspense fallback={<CampaignFormSkeleton />}>
      <CampaignEditFeature campaignId={campaignId} />
    </Suspense>
  );
}
