import type { Prisma } from "../../../generated/prisma/client";
import type {
  AccessContext,
  AppRole,
  AuthenticatedIdentity,
} from "../../../types/access";

export class TenantContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantContextError";
  }
}

export async function setClerkIdentityTx(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
): Promise<void> {
  await tx.$queryRaw`
    SELECT set_config(
      'app.clerk_user_id',
      ${identity.clerkUserId},
      true
    )
  `;
}

export async function setOrganizationContextTx(
  tx: Prisma.TransactionClient,
  organizationId: string,
): Promise<void> {
  await tx.$queryRaw`
    SELECT set_config(
      'app.organization_id',
      ${organizationId},
      true
    )
  `;
}

/**
 * Resolve application tenancy from the authenticated Clerk user.
 * Clerk does not provide or own organization context.
 *
 * The template chooses the oldest active membership as its deterministic default.
 * Generated applications can replace this selection policy without changing Clerk.
 */
export async function resolveAccessContextTx(
  tx: Prisma.TransactionClient,
  identity: AuthenticatedIdentity,
): Promise<AccessContext> {
  await setClerkIdentityTx(tx, identity);

  const user = await tx.user.findUnique({
    where: { clerkUserId: identity.clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new TenantContextError(
      "The authenticated Clerk user is not provisioned in the application database.",
    );
  }

  const membership = await tx.membership.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      organizationId: true,
      role: true,
    },
  });

  if (!membership) {
    throw new TenantContextError(
      "The authenticated user does not have an active application membership.",
    );
  }

  await setOrganizationContextTx(tx, membership.organizationId);

  return {
    clerkUserId: identity.clerkUserId,
    organizationId: membership.organizationId,
    membershipId: membership.id,
    userId: user.id,
    role: membership.role as AppRole,
  };
}
