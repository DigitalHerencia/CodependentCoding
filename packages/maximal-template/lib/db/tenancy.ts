/** Authenticated organization membership and tenant transaction boundaries. */
import type { AuthenticatedIdentity } from "@/types/authTypes";
import "server-only";

import { connection } from "next/server";

import type { Prisma } from "@/generated/prisma/client";
import type { AccessContext, AppRole } from "@/types/authzTypes";

import { getActiveOrganizationPreference } from "@/lib/authz/tenancy";
import { requireIdentity } from "@/lib/integrations/clerk/server";
import { activeMembershipScope } from "@/lib/authz/mode";
import { prisma } from "@/lib/db/client";
import { authorizationMembershipSelect } from "@/lib/db/selects/authzSelects";
import { resolveAuthenticatedUser, setRlsContext } from "@/lib/db/rls";

/** Reject a request that cannot resolve a valid authenticated tenant context. */
export class TenantContextError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "TenantContextError";
  }
}

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
  const user = await resolveAuthenticatedUser(tx, identity);
  if (!user.profileCompletedAt) {
    throw new TenantContextError(
      "Complete onboarding before accessing the workspace.",
    );
  }
  const active = activeMembershipScope(user.id);

  const preferred = preferredOrganizationId
    ? await tx.membership.findFirst({
        // `active` comes last so single tenancy keeps its one organization.
        where: { organizationId: preferredOrganizationId, ...active },
        select: authorizationMembershipSelect,
      })
    : null;
  const membership =
    preferred ??
    (await tx.membership.findFirst({
      where: active,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: authorizationMembershipSelect,
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
    deniedPermissions: membership.deniedPermissions,
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
  await connection();
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

/** Run an authenticated read inside the active organization transaction boundary. */
export async function withAuthenticatedRead<T>(
  read: (tx: Prisma.TransactionClient, access: AccessContext) => Promise<T>,
): Promise<T> {
  return withTenantTransaction(await requireIdentity(), read);
}
