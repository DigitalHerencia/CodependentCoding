/** Identity-scoped transactions and transaction-local row-level security context. */
import "server-only";

import { connection } from "next/server";
import { authIdentitySelect } from "@/lib/db/selects/authSelects";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import type { AuthenticatedIdentity } from "@/types/authTypes";
import type { Prisma } from "@/generated/prisma/client";

import { prisma } from "./client";

/**
 * Row-level security wrapper (AUTH.md §6). Postgres policies read these
 * transaction-local settings; a transaction that never sets them sees no
 * tenant rows (fail closed).
 */
export async function setRlsContext(
  tx: Prisma.TransactionClient,
  context: { clerkUserId?: string; organizationId?: string; userId?: string },
): Promise<void> {
  if (context.clerkUserId !== undefined)
    await tx.$executeRaw`SELECT set_config('app.clerk_user_id', ${context.clerkUserId}, true)`;
  if (context.userId !== undefined)
    await tx.$executeRaw`SELECT set_config('app.user_id', ${context.userId}, true)`;
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

/** Reject a trusted session whose local identity has not been provisioned. */
export class IdentityContextError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "IdentityContextError";
  }
}

/** The signed-in user's application record, resolved under RLS before any organization is chosen. */
export async function resolveAuthenticatedUser(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
) {
  await setRlsContext(tx, { clerkUserId: identity.clerkUserId });
  const user = await tx.user.findUnique({
    where: { id: identity.clerkUserId },
    select: authIdentitySelect,
  });
  if (!user) {
    throw new IdentityContextError(
      "The authenticated Clerk user is not provisioned in the application database.",
    );
  }
  await setRlsContext(tx, { userId: user.id });
  return user;
}

/**
 * For flows before the user belongs to the organization they act on
 * (accepting an invitation): authenticates and resolves the user, sets only
 * the user's RLS context, and leaves the organization to `work`.
 */
export async function withIdentityTransaction<T>(
  work: (
    tx: Prisma.TransactionClient,
    user: Awaited<ReturnType<typeof resolveAuthenticatedUser>> &
      AuthenticatedIdentity,
  ) => Promise<T>,
): Promise<T> {
  await connection();
  const identity = await requireIdentity();
  return prisma.$transaction(
    async (tx) => {
      const user = await resolveAuthenticatedUser(tx, identity);
      return work(tx, { ...user, clerkUserId: identity.clerkUserId });
    },
    { maxWait: 5_000, timeout: 15_000 },
  );
}
