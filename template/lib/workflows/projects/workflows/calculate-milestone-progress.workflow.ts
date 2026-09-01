import { getProjectTasks } from "../../fetchers/projectsFetchers";
import { calculateMilestoneProgress } from "../../projects/logic/calculate-milestone-progress.logic";
export async function calculateMilestoneProgressWorkflow(projectId: string) {
  const tasks = await getProjectTasks(projectId);
  return calculateMilestoneProgress(
    tasks.filter((task) => task.status === "DONE").length,
    tasks.length,
  );
}
