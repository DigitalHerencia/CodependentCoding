import { Suspense } from "react";

import { CampaignEditFeature } from "@/features/marketing/campaign-edit-feature";
import { CampaignFormSkeleton } from "@/features/marketing/campaign-form-skeleton";

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
