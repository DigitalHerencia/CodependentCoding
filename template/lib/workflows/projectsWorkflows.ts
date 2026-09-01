import {
  createProject,
  createTask,
  updateTaskStatus,
} from "@/lib/actions/projectsActions";
import {
  getProject,
  getProjects,
  getProjectTaskDependencyFacts,
  getProjectTasks,
} from "@/lib/fetchers/projectsFetchers";

export const createProjectWorkflow = createProject;
export const createTaskWorkflow = createTask;
export const updateTaskStatusWorkflow = updateTaskStatus;
export const advanceTaskStateWorkflow = updateTaskStatus;

export async function getProjectWorkspaceWorkflow(projectId: string) {
  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getProjectTasks(projectId),
  ]);
  if (!project) throw new Error("Project was not found.");
  return { project, tasks };
}

export async function calculateMilestoneProgressWorkflow(projectId: string) {
  const tasks = await getProjectTasks(projectId);
  if (tasks.length === 0) return 0;
  return Math.round(
    (tasks.filter((task) => task.status === "DONE").length / tasks.length) *
      100,
  );
}

export async function calculateProjectHealthWorkflow(projectId: string) {
  const { project, tasks } = await getProjectWorkspaceWorkflow(projectId);
  const overdue = tasks.filter(
    (task) =>
      task.dueAt &&
      new Date(task.dueAt) < new Date() &&
      task.status !== "DONE" &&
      task.status !== "CANCELED",
  ).length;
  return {
    projectId: project.id,
    overdueTasks: overdue,
    healthy: overdue === 0,
  };
}

export async function resolveTaskDependenciesWorkflow(projectId: string) {
  const tasks = await getProjectTaskDependencyFacts(projectId);
  const completed = new Set(
    tasks.filter((task) => task.status === "DONE").map((task) => task.id),
  );
  return tasks.map((task) => ({
    taskId: task.id,
    blocked: task.dependencies.some(
      (dependency) => !completed.has(dependency.dependsOnTaskId),
    ),
  }));
}

export async function getProjectsWorkflow(limit = 50) {
  return getProjects(limit);
}
