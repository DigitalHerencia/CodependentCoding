import type { Prisma } from "../../../generated/prisma/client";

export async function claimIdempotencyTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId?: string | null;
    scope: string;
    key: string;
  },
) {
  return tx.idempotencyRecord.upsert({
    where: {
      scope_key: {
        scope: input.scope,
        key: input.key,
      },
    },
    update: {},
    create: {
      organizationId: input.organizationId ?? null,
      scope: input.scope,
      key: input.key,
      state: "STARTED",
    },
    select: {
      id: true,
      organizationId: true,
      scope: true,
      key: true,
      state: true,
      result: true,
      errorCode: true,
      completedAt: true,
    },
  });
}

export async function completeIdempotencyTx(
  tx: Prisma.TransactionClient,
  input: {
    id: string;
    result?: Prisma.InputJsonValue;
  },
): Promise<void> {
  await tx.idempotencyRecord.update({
    where: {
      id: input.id,
    },
    data: {
      state: "COMPLETED",
      result: input.result,
      completedAt: new Date(),
      errorCode: null,
    },
  });
}
