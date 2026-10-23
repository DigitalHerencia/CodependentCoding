// Why: Server feature: loads the member's tasks and hands them to the shared task list island.
import { TasksFeatureClient } from "./tasksFeature.client";
import { getMyTasks } from "@/lib/fetchers/projectsFetchers";
export async function MyTasksFeature() {
  return (
    <TasksFeatureClient
      personal
      tasks={await getMyTasks()}
      title="My open tasks"
    />
  );
}
