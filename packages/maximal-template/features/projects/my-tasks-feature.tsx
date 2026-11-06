import { projectsPresentationCopy } from "@/content/projects";
import { loadMyTasksWorkflow } from "@/lib/workflows/projectsWorkflows";
import { TasksFeatureClient } from "./tasks-feature.client";

// Why: Server feature: loads the member's tasks and hands them to the shared task list island.

export async function MyTasksFeature() {
  const { tasks } = await loadMyTasksWorkflow();
  return (
    <TasksFeatureClient
      personal
      tasks={tasks}
      title={projectsPresentationCopy.myOpenTasks}
    />
  );
}
