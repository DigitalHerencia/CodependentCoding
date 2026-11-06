import { loadTaskEditWorkflow } from "@/lib/workflows/projectsWorkflows";
import { NewTaskForm } from "./newTaskForm";

// Why: Server feature: loads the task (null means 404) and reuses the task form.

export async function TaskEditFeature({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const { task } = await loadTaskEditWorkflow({ projectId, taskId });
  return <NewTaskForm projectId={projectId} task={task} />;
}
