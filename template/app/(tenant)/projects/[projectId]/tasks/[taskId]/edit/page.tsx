import { TaskEditFeature } from "@/features/projects/taskEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  return <TaskEditFeature projectId={projectId} taskId={taskId} />;
}
