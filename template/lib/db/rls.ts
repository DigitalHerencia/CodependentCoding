import "server-only";

import type { Prisma } from "@/generated/prisma/client";

import { prisma } from "./client";

/**
 * Row-level security wrapper (AUTH.md §6). Postgres policies read these
 * transaction-local settings; a transaction that never sets them sees no
 * tenant rows (fail closed).
 */
export async function setRlsContext(
  tx: Prisma.TransactionClient,
  context: { clerkUserId?: string; organizationId?: string },
): Promise<void> {
  if (context.clerkUserId !== undefined)
    await tx.$executeRaw`SELECT set_config('app.clerk_user_id', ${context.clerkUserId}, true)`;
  if (context.organizationId !== undefined)
    await tx.$executeRaw`SELECT set_config('app.organization_id', ${context.organizationId}, true)`;
}

/** A transaction with no tenant context: provider webhooks' idempotency records. */
export function withProviderTransaction<T>(
  work: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(work, { maxWait: 5_000, timeout: 15_000 });
}

/** A transaction scoped to one organization without a signed-in user (provider webhooks). */
export function withProviderOrganizationTransaction<T>(
  organizationId: string,
  work: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return withProviderTransaction(async (tx) => {
    await setRlsContext(tx, { organizationId });
    return work(tx);
  });
}
