import { getProject } from "../../fetchers/projectsFetchers";
import { calculateProjectStatus } from "../../portal/logic/calculate-project-status.logic";
export async function calculateClientProjectStatusWorkflow(projectId: string) {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project was not found.");
  return calculateProjectStatus({
    completedTasks: project.taskCount - project.openTaskCount,
    totalTasks: project.taskCount,
  });
}
