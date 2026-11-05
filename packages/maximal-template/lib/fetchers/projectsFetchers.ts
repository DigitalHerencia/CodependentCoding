import {
  persistedReadLimitSchema,
  persistedRecordIdSchema,
} from "@/schema/commonSchemas";
// Why: Fetchers: tenant-scoped reads (RLS context set, organizationId in every predicate); null when absent.
import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { toProjectSummaryDTO, toTaskDTO } from "@/lib/db/dtos/projectsDtos";
import {
  projectSummarySelect,
  taskSelect,
} from "@/lib/db/selects/projectsSelects";
import { withAuthenticatedRead } from "@/lib/db/tenant";

export async function getProjects(rawLimit: unknown = 50) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.project:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.project.findMany({
      where: {
        organizationId: access.organizationId,
        archivedAt: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: Math.min(Math.max(limit, 1), 100),
      select: projectSummarySelect,
    });

    return rows.map(toProjectSummaryDTO);
  });
}

export async function getProject(rawProjectId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.project:read");
    const projectId = persistedRecordIdSchema.parse(rawProjectId);
    const row = await tx.project.findFirst({
      where: {
        id: projectId,
        organizationId: access.organizationId,
        archivedAt: null,
      },
      select: projectSummarySelect,
    });
    return row ? toProjectSummaryDTO(row) : null;
  });
}

export async function getProjectTasks(
  rawProjectId: unknown,
  rawLimit: unknown = 100,
) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.task:read");
    const projectId = persistedRecordIdSchema.parse(rawProjectId);
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.task.findMany({
      where: {
        organizationId: access.organizationId,
        projectId,
      },
      orderBy: [
        {
          position: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      take: Math.min(Math.max(limit, 1), 200),
      select: taskSelect,
    });

    return rows.map(toTaskDTO);
  });
}

export async function getMyTasks(rawLimit: unknown = 100) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.task:read");
    const limit = persistedReadLimitSchema.parse(rawLimit);

    const rows = await tx.task.findMany({
      where: {
        organizationId: access.organizationId,
        assigneeMembershipId: access.membershipId,
        status: {
          notIn: ["DONE", "CANCELED"],
        },
      },
      orderBy: [
        {
          dueAt: "asc",
        },
        {
          priority: "desc",
        },
      ],
      take: Math.min(Math.max(limit, 1), 200),
      select: taskSelect,
    });

    return rows.map(toTaskDTO);
  });
}

export async function getProjectTaskDependencyFacts(rawProjectId: unknown) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.task:read");
    const projectId = persistedRecordIdSchema.parse(rawProjectId);
    return tx.task.findMany({
      where: { organizationId: access.organizationId, projectId },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        status: true,
        dependencies: { select: { dependsOnTaskId: true } },
      },
    });
  });
}

export async function getProjectTask(
  rawProjectId: unknown,
  rawTaskId: unknown,
) {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "projects.task:read");
    const projectId = persistedRecordIdSchema.parse(rawProjectId);
    const taskId = persistedRecordIdSchema.parse(rawTaskId);
    const row = await tx.task.findFirst({
      where: { id: taskId, projectId, organizationId: access.organizationId },
      select: taskSelect,
    });
    return row ? toTaskDTO(row) : null;
  });
}
