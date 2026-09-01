"use server";

import {
  createProjectSchema,
  createTaskSchema,
  updateTaskStatusSchema,
} from "@/schemas/projectsSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toProjectSummaryDTO, toTaskDTO } from "@/lib/db/dto/projects.dto";
import {
  projectSummarySelect,
  taskSelect,
} from "@/lib/db/selects/projects.selects";
import { withTenantTransaction } from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { updateTaskStatusTx } from "@/lib/db/transactions/update-task-status.tx";

export async function createProject(rawInput: unknown) {
  const input = createProjectSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
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
}

export async function createTask(rawInput: unknown) {
  const input = createTaskSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    const project = await tx.project.findFirst({
      where: {
        id: input.projectId,
        organizationId: access.organizationId,
        archivedAt: null,
      },
      select: { id: true },
    });
    if (!project) throw new ResourceNotFoundError("Project");
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
}

export async function updateTaskStatus(rawInput: unknown) {
  const input = updateTaskStatusSchema.parse(rawInput);
  const identity = await requireIdentity();
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    const record = await updateTaskStatusTx(tx, {
      organizationId: access.organizationId,
      taskId: input.taskId,
      status: input.status,
      expectedVersion: input.expectedVersion,
    });
    return toTaskDTO(record);
  });
}
