import { Suspense } from "react";

import { CampaignsFeature } from "@/features/marketing/campaignsFeature";
import { CampaignsSkeleton } from "@/features/marketing/campaignsSkeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CampaignsSkeleton />}>
      <CampaignsFeature />
    </Suspense>
  );
}
