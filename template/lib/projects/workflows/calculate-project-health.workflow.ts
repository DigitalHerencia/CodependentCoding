import { getProject, getProjectTasks } from "../../fetchers/projectsFetchers";
import { calculateProjectHealth } from "../../projects/logic/calculate-project-health.logic";
export async function calculateProjectHealthWorkflow(projectId: string) {
  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getProjectTasks(projectId),
  ]);
  if (!project) throw new Error("Project was not found.");
  const completed = tasks.filter((task) => task.status === "DONE").length;
  return calculateProjectHealth({
    overdueTasks: tasks.filter(
      (task) => task.dueAt && new Date(task.dueAt) < new Date() && task.status !== "DONE",
    ).length,
    blockedTasks: tasks.filter((task) => task.status === "BLOCKED").length,
    progress: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
  });
}
