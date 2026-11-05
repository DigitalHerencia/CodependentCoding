import { projectsPresentationCopy } from "@/content/projects";
// Why: Server feature: loads the member's tasks and hands them to the shared task list island.
import { TasksFeatureClient } from "./tasks-feature.client";
import { getMyTasks } from "@/lib/fetchers/projectsFetchers";
export async function MyTasksFeature() {
  return (
    <TasksFeatureClient
      personal
      tasks={await getMyTasks()}
      title={projectsPresentationCopy.myOpenTasks}
    />
  );
}
