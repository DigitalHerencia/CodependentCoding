/** Atomic organization provisioning and membership allocation. */
import "server-only";

import { randomUUID } from "node:crypto";

import type { Prisma } from "@/generated/prisma/client";
import type { AppRole, ProvisionedUser } from "@/types/authzTypes";
import {
  SINGLE_ORGANIZATION_ID,
  SINGLE_ORGANIZATION_SLUG,
  tenancy,
} from "@/lib/authz/mode";
import { selfSignupRole } from "@/lib/authz/roles";
import {
  authzIdSelect,
  pendingInvitationAccessSelect,
  membershipRoleStatusSelect,
  membershipSuspensionSelect,
} from "@/lib/db/selects/authzSelects";
import { setRlsContext } from "@/lib/db/rls";
import { acceptInvitationTx } from "@/lib/db/transactions/invitationTx";

/** Derive a stable organization slug from the trusted identity. */
function workspaceSlug(name: string | null, userId: string): string {
  const base =
    (name ?? "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "workspace";
  return `${base}-${userId.slice(-8).toLowerCase()}`;
}

async function createMembershipTx(
  tx: Prisma.TransactionClient,
  organizationId: string,
  userId: string,
  role: AppRole,
) {
  const membership = await tx.membership.create({
    data: { organizationId, userId, role, status: "ACTIVE" },
    select: authzIdSelect,
  });
  await tx.auditEvent.create({
    data: {
      organizationId,
      actorUserId: userId,
      action: "membership.provisioned",
      resourceType: "Membership",
      resourceId: membership.id,
      metadata: { role },
    },
  });
}

/** Multi tenancy: a new organization owned by `user`. */
async function createOwnedOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
) {
  const organizationId = randomUUID();
  await setRlsContext(tx, { organizationId });
  await tx.organization.create({
    data: {
      id: organizationId,
      slug: workspaceSlug(user.displayName, user.id),
      name: user.displayName
        ? `${user.displayName}'s Workspace`
        : "My Workspace",
    },
    select: authzIdSelect,
  });
  await tx.organizationSettings.create({ data: { organizationId } });
  await createMembershipTx(tx, organizationId, user.id, "OWNER");
}

/** Single tenancy: creates the shared organization the first time anyone joins. */
async function ensureSingleOrganizationTx(tx: Prisma.TransactionClient) {
  await setRlsContext(tx, { organizationId: SINGLE_ORGANIZATION_ID });
  const created = await tx.$queryRaw<{ id: string }[]>`
    INSERT INTO "Organization" ("id", "slug", "name", "updatedAt")
    VALUES (${SINGLE_ORGANIZATION_ID}::uuid, ${SINGLE_ORGANIZATION_SLUG}, 'Workspace', now())
    ON CONFLICT DO NOTHING
    RETURNING "id"
  `;
  if (created.length > 0) {
    await tx.organizationSettings.create({
      data: { organizationId: SINGLE_ORGANIZATION_ID },
    });
    return;
  }
  const existing = await tx.organization.findUnique({
    where: { id: SINGLE_ORGANIZATION_ID },
    select: authzIdSelect,
  });
  if (!existing)
    throw new Error(
      `Organization slug "${SINGLE_ORGANIZATION_SLUG}" belongs to another organization.`,
    );
}

/** The newest pending invitation for the verified email: an approval (no link) or a link. */
function findPendingInvitationTx(
  tx: Prisma.TransactionClient,
  email: string | null,
  requiresToken: boolean,
) {
  if (!email) return null;
  return tx.invitation.findFirst({
    where: {
      email,
      requiresToken,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: pendingInvitationAccessSelect,
  });
}

/** The ledger is insert-only and survives deletion of the original owner's User. */
async function joinSingleOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
): Promise<boolean> {
  // Every allocation path holds this transaction lock before reading the ledger.
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended('single-tenancy:initial-owner', 0))`;
  await ensureSingleOrganizationTx(tx);
  const existing = await tx.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: SINGLE_ORGANIZATION_ID,
        userId: user.id,
      },
    },
    select: membershipRoleStatusSelect,
  });

  // Seed fixtures never participate in the live allocation.
  if (user.id === "user_seed_owner" || user.id === "user_seed_agent")
    return existing?.status === "ACTIVE";

  const allocation = await tx.auditEvent.findFirst({
    where: {
      organizationId: SINGLE_ORGANIZATION_ID,
      action: "tenancy.initial_owner_allocated",
    },
    select: authzIdSelect,
  });
  let role: AppRole = selfSignupRole;
  if (!allocation) {
    // Preserve pre-existing real ownership, including inactive owners and deleted
    // owners with a provisioning audit event. Seed OWNER is explicitly excluded.
    const previousOwner = await tx.membership.findFirst({
      where: {
        organizationId: SINGLE_ORGANIZATION_ID,
        role: "OWNER",
        userId: { not: "user_seed_owner" },
      },
      select: authzIdSelect,
    });
    const previousAllocation = await tx.auditEvent.findFirst({
      where: {
        organizationId: SINGLE_ORGANIZATION_ID,
        OR: [
          { action: "membership.bootstrap_owner" },
          {
            action: "membership.provisioned",
            metadata: { path: ["role"], equals: "OWNER" },
          },
        ],
      },
      select: authzIdSelect,
    });
    // Existing customers are never promoted by a repeated provisioning request.
    if (!previousOwner && !previousAllocation && !existing) role = "OWNER";
    if (previousOwner || previousAllocation || role === "OWNER") {
      await tx.auditEvent.create({
        data: {
          organizationId: SINGLE_ORGANIZATION_ID,
          actorUserId: user.id,
          action: "tenancy.initial_owner_allocated",
          resourceType: "Organization",
          resourceId: SINGLE_ORGANIZATION_ID,
          metadata: {
            source:
              previousOwner || previousAllocation
                ? "existing-allocation"
                : "signup",
            initialOwnerUserId: role === "OWNER" ? user.id : null,
          },
        },
      });
    }
  }
  // Suspended and revoked memberships are never reactivated by signup.
  if (existing) return existing.status === "ACTIVE";
  await createMembershipTx(tx, SINGLE_ORGANIZATION_ID, user.id, role);
  return true;
}

async function joinOrCreateOrganizationTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
  email: string | null,
): Promise<boolean> {
  // Approvals target their own organization, even if this identity is already
  // active elsewhere. Acceptance preserves active roles and rejects inactive
  // target memberships; only the verified email can select an approval.
  const approval = await findPendingInvitationTx(tx, email, false);
  if (approval) {
    await acceptInvitationTx(tx, approval, user.id);
    return true;
  }

  const active = await tx.membership.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    select: authzIdSelect,
  });
  if (active) return true;

  // Without verified email we cannot distinguish an invitee from an
  // unaffiliated signup. Defer creation until a later verified event/request.
  if (!email) return false;

  // Revoked/suspended users cannot escape administration by creating a workspace.
  if (
    await tx.membership.findFirst({
      where: { userId: user.id },
      select: authzIdSelect,
    })
  )
    return false;

  // An invitation link is waiting: join through it instead of a new organization.
  if (await findPendingInvitationTx(tx, email, true)) return false;

  await createOwnedOrganizationTx(tx, user);
  return true;
}

/** Provision from trusted identity, independently of profile completion. */
export async function provisionWorkspaceAccessTx(
  tx: Prisma.TransactionClient,
  user: ProvisionedUser,
  email: string | null,
): Promise<boolean> {
  const lockKey = `workspace-provision:${user.id}`;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`;
  return tenancy === "single"
    ? joinSingleOrganizationTx(tx, user)
    : joinOrCreateOrganizationTx(tx, user, email);
}

/** Suspend application memberships after provider identity deactivation and append audit events atomically. */
export async function suspendAuthzMembershipsTx(
  tx: Prisma.TransactionClient,
  userId: string,
): Promise<void> {
  const memberships = await tx.membership.findMany({
    where: { userId: userId },
    select: membershipSuspensionSelect,
  });
  for (const membership of memberships) {
    if (membership.status === "SUSPENDED" || membership.status === "REVOKED")
      continue;
    await setRlsContext(tx, { organizationId: membership.organizationId });
    await tx.membership.updateMany({
      where: {
        id: membership.id,
        userId: userId,
        organizationId: membership.organizationId,
      },
      data: { status: "SUSPENDED" },
    });
    await tx.auditEvent.create({
      data: {
        organizationId: membership.organizationId,
        actorUserId: userId,
        action: "identity.deactivated",
        resourceType: "Membership",
        resourceId: membership.id,
        metadata: {
          source: "clerk-webhook",
          previousStatus: membership.status,
          status: "SUSPENDED",
        },
      },
    });
  }
}
