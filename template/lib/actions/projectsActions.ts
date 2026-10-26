"use server";

/**
 * Why: the only write path for projects. Each action authenticates,
 * authorizes, validates, writes inside the tenant transaction (RLS context
 * set), invalidates the affected routes and returns an ActionResult.
 */

import {
  createProjectSchema,
  createTaskSchema,
  updateTaskStatusSchema,
  assignTaskSchema,
  updateProjectSchema,
  updateTaskSchema,
} from "@/schemas/projectsSchemas";
import type { ActionResult } from "@/types/actionTypes";
import type { ProjectSummaryDTO, TaskDTO } from "@/types/projectsTypes";
import { toActionResult } from "@/lib/utils/actionResult";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toProjectSummaryDTO, toTaskDTO } from "@/lib/db/dto/projects.dto";
import {
  projectSummarySelect,
  taskSelect,
} from "@/lib/db/selects/projects.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { invalidatePaths } from "@/lib/cache/invalidate";
import {
  ResourceNotFoundError,
  staleOrMissing,
} from "@/lib/db/transactions/errors";
import { assignTaskTx } from "@/lib/db/transactions/projects.tx";
import { updateTaskStatusTx } from "@/lib/db/transactions/projects-update-task-status.tx";

export async function createProject(
  rawInput: unknown,
): Promise<ActionResult<ProjectSummaryDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.project:create");
      const input = createProjectSchema.parse(rawInput);
      const record = await tx.project.create({
        data: {
          organizationId: access.organizationId,
          ownerMembershipId: access.membershipId,
          name: input.name,
          description: input.description ?? null,
          startsAt: input.startsAt ?? null,
          dueAt: input.dueAt ?? null,
          status: "PLANNED",
          members: {
            create: {
              organizationId: access.organizationId,
              membershipId: access.membershipId,
              role: "OWNER",
            },
          },
        },
        select: projectSummarySelect,
      });
      await tx.auditEvent.create({
        data: {
          organizationId: access.organizationId,
          actorUserId: access.userId,
          action: "project.created",
          resourceType: "Project",
          resourceId: record.id,
        },
      });
      return toProjectSummaryDTO(record);
    });
    invalidatePaths(["/projects"]);
    return saved;
  });
}

export async function createTask(
  rawInput: unknown,
): Promise<ActionResult<TaskDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.task:create");
      const input = createTaskSchema.parse(rawInput);
      const project = await tx.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: access.organizationId,
          archivedAt: null,
        },
        select: { id: true },
      });
      if (!project) throw new ResourceNotFoundError("Project");
      if (
        input.assigneeMembershipId &&
        !(await tx.membership.findFirst({
          where: {
            id: input.assigneeMembershipId,
            organizationId: access.organizationId,
            status: "ACTIVE",
          },
          select: { id: true },
        }))
      )
        throw new ResourceNotFoundError("Assignee");
      if (
        input.milestoneId &&
        !(await tx.milestone.findFirst({
          where: {
            id: input.milestoneId,
            projectId: input.projectId,
            organizationId: access.organizationId,
          },
          select: { id: true },
        }))
      )
        throw new ResourceNotFoundError("Milestone");
      if (
        input.parentTaskId &&
        !(await tx.task.findFirst({
          where: {
            id: input.parentTaskId,
            projectId: input.projectId,
            organizationId: access.organizationId,
          },
          select: { id: true },
        }))
      )
        throw new ResourceNotFoundError("Parent task");
      const record = await tx.task.create({
        data: {
          organizationId: access.organizationId,
          projectId: input.projectId,
          milestoneId: input.milestoneId ?? null,
          parentTaskId: input.parentTaskId ?? null,
          assigneeMembershipId: input.assigneeMembershipId ?? null,
          title: input.title,
          description: input.description ?? null,
          priority: input.priority,
          dueAt: input.dueAt ?? null,
        },
        select: taskSelect,
      });
      return toTaskDTO(record);
    });
    invalidatePaths(projectPaths(saved.projectId));
    return saved;
  });
}

export async function updateTaskStatus(
  rawInput: unknown,
): Promise<ActionResult<TaskDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.task:update");
      const input = updateTaskStatusSchema.parse(rawInput);
      const record = await updateTaskStatusTx(tx, {
        organizationId: access.organizationId,
        taskId: input.taskId,
        status: input.status,
        expectedVersion: input.expectedVersion,
      });
      return toTaskDTO(record);
    });
    invalidatePaths(projectPaths(saved.projectId));
    return saved;
  });
}

export async function updateProject(
  rawInput: unknown,
): Promise<ActionResult<ProjectSummaryDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.project:update");
      const input = updateProjectSchema.parse(rawInput);
      const result = await tx.project.updateMany({
        where: {
          id: input.projectId,
          organizationId: access.organizationId,
          archivedAt: null,
          version: input.expectedVersion,
        },
        data: {
          name: input.name,
          description: input.description ?? null,
          startsAt: input.startsAt ?? null,
          dueAt: input.dueAt ?? null,
          version: { increment: 1 },
        },
      });
      if (result.count !== 1) {
        const exists = await tx.project.count({
          where: {
            id: input.projectId,
            organizationId: access.organizationId,
            archivedAt: null,
          },
        });
        throw staleOrMissing("Project", exists > 0);
      }
      return toProjectSummaryDTO(
        await tx.project.findFirstOrThrow({
          where: { id: input.projectId, organizationId: access.organizationId },
          select: projectSummarySelect,
        }),
      );
    });
    invalidatePaths(projectPaths(saved.id));
    return saved;
  });
}

export async function updateTask(
  rawInput: unknown,
): Promise<ActionResult<TaskDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.task:update");
      const input = updateTaskSchema.parse(rawInput);
      const result = await tx.task.updateMany({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          organizationId: access.organizationId,
          version: input.expectedVersion,
        },
        data: {
          title: input.title,
          description: input.description ?? null,
          priority: input.priority,
          dueAt: input.dueAt ?? null,
          version: { increment: 1 },
        },
      });
      if (result.count !== 1) {
        const exists = await tx.task.count({
          where: {
            id: input.taskId,
            projectId: input.projectId,
            organizationId: access.organizationId,
          },
        });
        throw staleOrMissing("Task", exists > 0);
      }
      return toTaskDTO(
        await tx.task.findFirstOrThrow({
          where: { id: input.taskId, organizationId: access.organizationId },
          select: taskSelect,
        }),
      );
    });
    invalidatePaths(projectPaths(saved.projectId));
    return saved;
  });
}

export async function assignProjectTask(
  rawInput: unknown,
): Promise<ActionResult<TaskDTO>> {
  return toActionResult(async () => {
    const identity = await requireIdentity();
    const saved = await withTenantTransaction(identity, async (tx, access) => {
      assertPermission(access, "projects.task:update");
      const input = assignTaskSchema.parse(rawInput);
      return toTaskDTO(
        await assignTaskTx(tx, {
          ...input,
          organizationId: access.organizationId,
        }),
      );
    });
    invalidatePaths(projectPaths(saved.projectId));
    return saved;
  });
}

/** Routes that show a project and its tasks. */
function projectPaths(projectId: string) {
  return ["/projects", `/projects/${projectId}`, "/my-tasks"];
}
