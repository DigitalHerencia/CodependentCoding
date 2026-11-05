// Why: Route only: resolves params and streams the task detail.
import { Suspense } from "react";

import { TaskFeature } from "@/features/projects/task-feature";
import { TaskSkeleton } from "@/features/projects/task-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  return (
    <Suspense fallback={<TaskSkeleton />}>
      <TaskFeature projectId={projectId} taskId={taskId} />
    </Suspense>
  );
}
