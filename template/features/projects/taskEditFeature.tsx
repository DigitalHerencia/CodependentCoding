// Why: Server feature: loads the task (null means 404) and reuses the task form.
import { notFound } from "next/navigation";
import { getTaskWorkflow } from "@/lib/workflows/projectsWorkflows";
import { TaskNewForm } from "./taskNewForm";
export async function TaskEditFeature({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const task = await getTaskWorkflow(projectId, taskId);
  if (!task) notFound();
  return <TaskNewForm projectId={projectId} task={task} />;
}
