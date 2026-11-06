import { TaskStatus } from "@/schemas/projectsSchemas";
import type { ProjectSummaryDTO, TaskDTO } from "@/types/projectsTypes";

export function selectProjectsWorkflow(
  projects: ProjectSummaryDTO[],
  query: string,
  status: string,
) {
  return projects.filter(
    (project) =>
      (!status || project.status === status) &&
      `${project.name} ${project.description ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
}

export function selectTasksWorkflow(tasks: TaskDTO[], query: string) {
  const visible = tasks.filter((task) =>
    `${task.title} ${task.assignee?.displayName ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return {
    tasks: visible,
    statusGroups: Object.values(TaskStatus).map((status) => ({
      status,
      items: visible.filter((task) => task.status === status),
    })),
    priorityGroups: ["URGENT", "HIGH", "MEDIUM", "LOW"].map((priority) => ({
      priority,
      items: visible.filter((task) => task.priority === priority),
    })),
  };
}
