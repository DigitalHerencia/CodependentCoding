// Why: Server feature: loads the task (null means 404) and reuses the task form.
import { notFound } from "next/navigation";
import { getProjectTask } from "@/lib/fetchers/projectsFetchers";
import { TaskNewForm } from "./task-new-form";
export async function TaskEditFeature({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const task = await getProjectTask(projectId, taskId);
  if (!task) notFound();
  return <TaskNewForm projectId={projectId} task={task} />;
}
