// Why: Route only: renders the new-task form for one project; no data to load.
import { TaskNewForm } from "@/features/projects/taskNewForm";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <TaskNewForm projectId={projectId} />;
}
