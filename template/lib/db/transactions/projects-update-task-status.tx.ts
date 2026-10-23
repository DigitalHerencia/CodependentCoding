// Why: Transaction helper: versioned status change; zero rows means CONFLICT or NOT_FOUND.
import "server-only";

import type { Prisma, TaskStatus } from "@/generated/prisma/client";

import { taskSelect } from "@/lib/db/selects/projects.selects";
import { staleOrMissing } from "./errors";

export async function updateTaskStatusTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    taskId: string;
    status: TaskStatus;
    expectedVersion: number;
  },
) {
  const result = await tx.task.updateMany({
    where: {
      id: input.taskId,
      organizationId: input.organizationId,
      version: input.expectedVersion,
    },
    data: {
      status: input.status,
      completedAt: input.status === "DONE" ? new Date() : null,
      version: {
        increment: 1,
      },
    },
  });

  if (result.count !== 1) {
    const exists = await tx.task.count({
      where: { id: input.taskId, organizationId: input.organizationId },
    });
    throw staleOrMissing("Task", exists > 0);
  }

  return tx.task.findFirstOrThrow({
    where: {
      id: input.taskId,
      organizationId: input.organizationId,
    },
    select: taskSelect,
  });
}
