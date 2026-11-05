// Why: Route only: resolves params and streams the project task board.
import { Suspense } from "react";

import { TasksFeature } from "@/features/projects/tasks-feature";
import { TasksSkeleton } from "@/features/projects/tasks-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksFeature projectId={projectId} />
    </Suspense>
  );
}
