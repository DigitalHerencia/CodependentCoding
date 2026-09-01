import { getProjectTaskDependencyFacts } from "../../fetchers/projectsFetchers";
import { resolveTaskDependencies } from "../../projects/logic/resolve-task-dependencies.logic";

export async function resolveTaskDependenciesWorkflow(projectId: string) {
  const tasks = await getProjectTaskDependencyFacts(projectId);
  return resolveTaskDependencies(
    tasks.map((task) => ({
      id: task.id,
      status: task.status,
      dependsOnTaskIds: task.dependencies.map(
        (dependency) => dependency.dependsOnTaskId,
      ),
    })),
  );
}
