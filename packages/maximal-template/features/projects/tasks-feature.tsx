import { projectsRemainingCopy } from "@/content/projects";
import { loadTasksWorkflow } from "@/lib/workflows/projectsWorkflows";
import { TasksFeatureClient } from "./tasks-feature.client";

// Why: Server feature: loads the project workspace (null means 404) for the task board.

export async function TasksFeature({ projectId }: { projectId: string }) {
  const { project, tasks } = await loadTasksWorkflow({ projectId });
  return (
    <TasksFeatureClient
      tasks={tasks}
      projectId={projectId}
      title={projectsRemainingCopy.taskBoardTitle(project.name)}
    />
  );
}
