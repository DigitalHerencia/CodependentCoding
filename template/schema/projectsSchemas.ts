// Why: Schemas: one Zod contract per write, shared by client forms and server actions.
import { z } from "zod";
import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

const uuid = z.string().uuid();

const projectFields = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
});

const datesInOrder = (input: {
  startsAt?: Date | null | undefined;
  dueAt?: Date | null | undefined;
}) => !input.startsAt || !input.dueAt || input.startsAt <= input.dueAt;
const dueAfterStart = {
  message: "Due date must follow start date.",
  path: ["dueAt"],
};

export const createProjectSchema = projectFields.refine(
  datesInOrder,
  dueAfterStart,
);

export const createTaskSchema = z.object({
  projectId: uuid,
  milestoneId: uuid.nullable().optional(),
  parentTaskId: uuid.nullable().optional(),
  assigneeMembershipId: uuid.nullable().optional(),
  title: z.string().trim().min(1).max(300),
  description: z.string().max(20_000).nullable().optional(),
  priority: z.enum(TaskPriority).default("MEDIUM"),
  dueAt: z.coerce.date().nullable().optional(),
});

export const updateTaskStatusSchema = z.object({
  taskId: uuid,
  status: z.enum(TaskStatus),
  expectedVersion: z.number().int().positive(),
});

export const updateProjectSchema = projectFields
  .extend({
    projectId: uuid,
    expectedVersion: z.number().int().positive(),
  })
  .refine(datesInOrder, dueAfterStart);

export const updateTaskSchema = createTaskSchema
  .pick({
    projectId: true,
    title: true,
    description: true,
    priority: true,
    dueAt: true,
  })
  .extend({ taskId: uuid, expectedVersion: z.number().int().positive() });

export const assignTaskSchema = z.object({
  taskId: uuid,
  assigneeMembershipId: uuid.nullable(),
  expectedVersion: z.number().int().positive(),
});

export { TaskStatus, TaskPriority } from "@/generated/prisma/enums";
