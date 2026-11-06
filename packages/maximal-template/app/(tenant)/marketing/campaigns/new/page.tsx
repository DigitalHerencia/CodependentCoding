import { CampaignFormSkeleton } from "@/features/marketing/campaign-form-skeleton";
import { CampaignNewFeature } from "@/features/marketing/campaign-new-feature";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<CampaignFormSkeleton />}>
      <CampaignNewFeature />
    </Suspense>
  );
}
