// Why: Workflows: compose fetchers and derive read models (health, progress, blockers) for features.
import "server-only";

import {
  getProjectTask,
  getProject,
  getProjects,
  getProjectTaskDependencyFacts,
  getProjectTasks,
  getMyTasks,
} from "@/lib/fetchers/projectsFetchers";

export async function getProjectsDashboardWorkflow(limit = 100) {
  const [projects, myTasks] = await Promise.all([
    getProjects(limit),
    getMyTasks(limit),
  ]);
  return { projects, myTasks };
}

export async function getTaskWorkflow(projectId: string, taskId: string) {
  return getProjectTask(projectId, taskId);
}

export async function getProjectWorkspaceWorkflow(projectId: string) {
  const [project, tasks] = await Promise.all([
    getProject(projectId),
    getProjectTasks(projectId),
  ]);
  return project ? { project, tasks } : null;
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
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) return null;
  const { project, tasks } = workspace;
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
