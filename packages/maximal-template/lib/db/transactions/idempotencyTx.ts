import "server-only";

import type { Prisma } from "@/generated/prisma/client";

const idempotencySelect = {
  id: true,
  organizationId: true,
  scope: true,
  key: true,
  state: true,
  result: true,
  errorCode: true,
  completedAt: true,
} as const;

/** Claim without a uniqueness exception that would abort the caller's PostgreSQL transaction. */
export async function claimIdempotencyTx(
  tx: Prisma.TransactionClient,
  input: {
    organizationId?: string | null;
    scope: string;
    key: string;
  },
) {
  const scope = input.organizationId
    ? `${input.organizationId}:${input.scope}`
    : input.scope;

  const inserted = await tx.idempotencyRecord.createMany({
    data: {
      organizationId: input.organizationId ?? null,
      scope,
      key: input.key,
      state: "STARTED",
    },
    skipDuplicates: true,
  });
  const record = await tx.idempotencyRecord.findUniqueOrThrow({
    where: { scope_key: { scope, key: input.key } },
    select: idempotencySelect,
  });
  return { ...record, claimed: inserted.count === 1 };
}

/** Store a successful replay result within the same transaction as its audit event. */
export async function completeIdempotencyTx(
  tx: Prisma.TransactionClient,
  input: {
    id: string;
    result?: Prisma.InputJsonValue;
  },
): Promise<void> {
  await tx.idempotencyRecord.update({
    where: { id: input.id },
    data: {
      state: "COMPLETED",
      ...(input.result === undefined ? {} : { result: input.result }),
      completedAt: new Date(),
      errorCode: null,
    },
  });
}
