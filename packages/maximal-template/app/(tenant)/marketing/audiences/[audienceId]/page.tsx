import { Suspense } from "react";

import { AudienceFeature } from "@/features/marketing/audience-feature";
import { AudienceSkeleton } from "@/features/marketing/audience-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ audienceId: string }>;
}) {
  const { audienceId } = await params;
  return (
    <Suspense fallback={<AudienceSkeleton />}>
      <AudienceFeature audienceId={audienceId} />
    </Suspense>
  );
}
