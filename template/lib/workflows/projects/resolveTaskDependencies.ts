export function resolveTaskDependencies(
  tasks: Array<{ id: string; status: string; dependsOnTaskIds: string[] }>,
) {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string) => {
    if (visiting.has(id)) throw new Error("Task dependencies contain a cycle.");
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependencyId of byId.get(id)?.dependsOnTaskIds ?? []) {
      if (!byId.has(dependencyId))
        throw new Error(`Task dependency ${dependencyId} does not exist.`);
      visit(dependencyId);
    }
    visiting.delete(id);
    visited.add(id);
  };
  for (const task of tasks) visit(task.id);
  return tasks
    .filter((task) =>
      task.dependsOnTaskIds.some((id) => byId.get(id)?.status !== "DONE"),
    )
    .map((task) => task.id);
}
