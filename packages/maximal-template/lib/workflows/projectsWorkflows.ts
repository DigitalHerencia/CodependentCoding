import { getOrganizationMembers } from "@/lib/fetchers/organizationFetchers";
import {
  getMyTasks,
  getProject,
  getProjects,
  getProjectTask,
  getProjectTaskDependencyFacts,
  getProjectTasks,
} from "@/lib/fetchers/projectsFetchers";
import { notFound } from "next/navigation";
import "server-only";

// Why: Workflows: compose fetchers and derive read models (health, progress, blockers) for features.

export async function getProjectsDashboardWorkflow(limit = 100) {
  const [projects, myTasks] = await Promise.all([
    getProjects(limit),
    getMyTasks(limit),
  ]);
  return { projects, myTasks };
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

export async function loadMyTasksWorkflow() {
  const tasks = await getMyTasks();
  return { tasks };
}

export async function loadProjectEditWorkflow({
  projectId,
}: {
  projectId: string;
}) {
  const project = await getProject(projectId);
  if (!project) notFound();
  return { project };
}

export async function loadProjectWorkflow({
  projectId,
}: {
  projectId: string;
}) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) notFound();
  const { project, tasks } = workspace;
  const open = tasks
    .filter((task) => !["DONE", "CANCELED"].includes(task.status))
    .sort((left, right) =>
      (left.dueAt ?? "9999").localeCompare(right.dueAt ?? "9999"),
    );
  return {
    project,
    tasks,
    open: open.slice(0, 8),
    blockedTaskCount: tasks.filter((task) => task.status === "BLOCKED").length,
  };
}

export async function loadProjectsWorkflow() {
  const projects = await getProjects(100);
  return { projects };
}

export async function loadTaskEditWorkflow({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const task = await getProjectTask(projectId, taskId);
  if (!task) notFound();
  return { task };
}

export async function loadTaskWorkflow({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  const task = await getProjectTask(projectId, taskId);
  if (!task) notFound();
  const members = await getOrganizationMembers();
  return { task, members };
}

export async function loadTasksWorkflow({ projectId }: { projectId: string }) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) notFound();
  const { project, tasks } = workspace;
  return { project, tasks };
}

export async function loadTimelineWorkflow({
  projectId,
}: {
  projectId: string;
}) {
  const workspace = await getProjectWorkspaceWorkflow(projectId);
  if (!workspace) notFound();
  const { project, tasks } = workspace;
  const dates = [
    ...new Set(
      tasks.flatMap((task) => (task.dueAt ? [task.dueAt.slice(0, 10)] : [])),
    ),
  ].sort();
  return {
    workspace: {
      project,
      groups: dates.map((date) => ({
        date,
        items: tasks.filter((task) => task.dueAt?.startsWith(date)),
      })),
      unscheduled: tasks.filter((task) => !task.dueAt),
    },
  };
}
