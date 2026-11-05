import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type {
  AccessContext,
  AppRole,
  AuthenticatedIdentity,
} from "@/types/accessTypes";

import { getActiveOrganizationPreference } from "@/lib/auth/active-organization";
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
): Promise<{
  id: string;
  email: string | null;
  displayName: string | null;
  profileCompletedAt: Date | null;
}> {
  await setRlsContext(tx, { clerkUserId: identity.clerkUserId });
  const user = await tx.user.findUnique({
    where: { clerkUserId: identity.clerkUserId },
    select: {
      id: true,
      email: true,
      displayName: true,
      profileCompletedAt: true,
    },
  });
  if (!user) {
    throw new TenantContextError(
      "The authenticated Clerk user is not provisioned in the application database.",
    );
  }
  await setRlsContext(tx, { userId: user.id });
  return user;
}

const membershipSelect = { id: true, organizationId: true, role: true };

/**
 * The membership this request acts through: the active-org cookie's
 * organization when the user still holds an ACTIVE membership there,
 * otherwise the oldest ACTIVE membership.
 */
async function resolveAccessContext(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
  preferredOrganizationId: string | null,
): Promise<AccessContext> {
  const user = await resolveUser(tx, identity);
  if (!user.profileCompletedAt) {
    throw new TenantContextError(
      "Complete onboarding before accessing the workspace.",
    );
  }
  const active = { userId: user.id, status: "ACTIVE" } as const;

  const preferred = preferredOrganizationId
    ? await tx.membership.findFirst({
        where: { ...active, organizationId: preferredOrganizationId },
        select: membershipSelect,
      })
    : null;
  const membership =
    preferred ??
    (await tx.membership.findFirst({
      where: active,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: membershipSelect,
    }));
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
 * active membership (organization and role; the active-org cookie picks
 * among several) inside the transaction, locks
 * RLS to that organization, then runs `work` with the access context that
 * every fetcher and action checks with lib/authz.
 */
export async function withTenantTransaction<T>(
  identity: AuthenticatedIdentity,
  work: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  const preferredOrganizationId = await getActiveOrganizationPreference();
  return prisma.$transaction(
    async (tx) =>
      work(
        tx,
        await resolveAccessContext(tx, identity, preferredOrganizationId),
      ),
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
    user: Awaited<ReturnType<typeof resolveUser>> & { clerkUserId: string },
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
