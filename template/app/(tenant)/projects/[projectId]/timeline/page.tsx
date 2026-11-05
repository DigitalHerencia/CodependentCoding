// Why: Route only: resolves params and streams the project timeline.
import { Suspense } from "react";

import { TimelineFeature } from "@/features/projects/timeline-feature";
import { TimelineSkeleton } from "@/features/projects/timeline-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelineFeature projectId={projectId} />
    </Suspense>
  );
}
