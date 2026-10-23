// Why: Route only: resolves params and streams the task edit form.
import { Suspense } from "react";

import { TaskEditFeature } from "@/features/projects/taskEditFeature";
import { TaskFormSkeleton } from "@/features/projects/taskFormSkeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  return (
    <Suspense fallback={<TaskFormSkeleton />}>
      <TaskEditFeature projectId={projectId} taskId={taskId} />
    </Suspense>
  );
}
