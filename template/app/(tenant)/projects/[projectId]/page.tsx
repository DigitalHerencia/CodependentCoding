// Why: Route only: resolves params and streams the project overview.
import { Suspense } from "react";

import { ProjectFeature } from "@/features/projects/projectFeature";
import { ProjectSkeleton } from "@/features/projects/projectSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectFeature projectId={projectId} />
    </Suspense>
  );
}
