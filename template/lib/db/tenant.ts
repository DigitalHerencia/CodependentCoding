import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type {
  AccessContext,
  AppRole,
  AuthenticatedIdentity,
} from "@/types/accessTypes";

import { requireIdentity } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/client";
import { setRlsContext } from "@/lib/db/rls";

export class TenantContextError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "TenantContextError";
  }
}

/** The signed-in user's application record, resolved under RLS before any organization is chosen. */
async function resolveUser(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
): Promise<{ id: string; email: string | null }> {
  await setRlsContext(tx, { clerkUserId: identity.clerkUserId });
  const user = await tx.user.findUnique({
    where: { clerkUserId: identity.clerkUserId },
    select: { id: true, email: true },
  });
  if (!user) {
    throw new TenantContextError(
      "The authenticated Clerk user is not provisioned in the application database.",
    );
  }
  return user;
}

async function resolveAccessContext(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
): Promise<AccessContext> {
  const user = await resolveUser(tx, identity);

  const membership = await tx.membership.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: { id: true, organizationId: true, role: true },
  });
  if (!membership) {
    throw new TenantContextError(
      "The authenticated user does not have an active application membership.",
    );
  }

  await setRlsContext(tx, { organizationId: membership.organizationId });

  return {
    clerkUserId: identity.clerkUserId,
    organizationId: membership.organizationId,
    membershipId: membership.id,
    userId: user.id,
    role: membership.role as AppRole,
  };
}

/**
 * Authentication and authorization wrapper: resolves the signed-in user's
 * active membership (organization and role) inside the transaction, locks
 * RLS to that organization, then runs `work` with the access context that
 * every fetcher and action checks with lib/authz.
 */
export async function withTenantTransaction<T>(
  identity: AuthenticatedIdentity,
  work: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(
    async (tx) => work(tx, await resolveAccessContext(tx, identity)),
    { maxWait: 5_000, timeout: 15_000 },
  );
}

export async function withAuthenticatedRead<T>(
  read: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  return withTenantTransaction(await requireIdentity(), read);
}

/**
 * For flows before the user belongs to the organization they act on
 * (accepting an invitation): authenticates and resolves the user, sets only
 * the user's RLS context, and leaves the organization to `work`.
 */
export async function withIdentityTransaction<T>(
  work: (
    tx: Prisma.TransactionClient,
    user: { id: string; email: string | null; clerkUserId: string },
  ) => Promise<T>,
): Promise<T> {
  const identity = await requireIdentity();
  return prisma.$transaction(
    async (tx) => {
      const user = await resolveUser(tx, identity);
      return work(tx, { ...user, clerkUserId: identity.clerkUserId });
    },
    { maxWait: 5_000, timeout: 15_000 },
  );
}
