import { NewTaskForm } from "@/features/projects/newTaskForm";

// Why: Route only: renders the new-task form for one project; no data to load.

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <NewTaskForm projectId={projectId} />;
}
