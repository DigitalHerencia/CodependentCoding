import { TasksFeature } from "@/features/projects/tasksFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <TasksFeature projectId={projectId} />;
}
