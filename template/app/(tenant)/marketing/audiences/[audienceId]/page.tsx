import { Suspense } from "react";

import { AudienceFeature } from "@/features/marketing/audienceFeature";
import { AudienceSkeleton } from "@/features/marketing/audienceSkeleton";

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
