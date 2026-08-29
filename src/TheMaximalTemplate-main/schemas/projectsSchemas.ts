import { z } from "zod";

const uuid = z.string().uuid();

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
});

export const createTaskSchema = z.object({
  projectId: uuid,
  milestoneId: uuid.nullable().optional(),
  parentTaskId: uuid.nullable().optional(),
  assigneeMembershipId: uuid.nullable().optional(),
  title: z.string().trim().min(1).max(300),
  description: z.string().max(20_000).nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueAt: z.coerce.date().nullable().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: uuid,
  status: z.enum([
    "BACKLOG",
    "TODO",
    "IN_PROGRESS",
    "BLOCKED",
    "DONE",
    "CANCELED",
  ]),
  expectedVersion: z.number().int().positive(),
});
