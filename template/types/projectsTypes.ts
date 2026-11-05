import type {
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "@/generated/prisma/enums";
// Why: Types: DTO shapes shared by server and client; no runtime code.
export type ProjectSummaryDTO = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startsAt: string | null;
  dueAt: string | null;
  version: number;
  taskCount: number;
  openTaskCount: number;
};
export type TaskDTO = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  completedAt: string | null;
  version: number;
  assignee: { membershipId: string; displayName: string | null } | null;
};
