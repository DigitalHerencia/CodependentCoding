import { Suspense } from "react";

import { ProjectEditFeature } from "@/features/projects/projectEditFeature";
import { ProjectFormSkeleton } from "@/features/projects/projectFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<ProjectFormSkeleton />}>
      <ProjectEditFeature projectId={projectId} />
    </Suspense>
  );
}
