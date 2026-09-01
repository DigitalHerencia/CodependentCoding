"use server";

import {
  changeAdminMembershipSchema,
  reconcileAdminProviderStateSchema,
  updateAdminMembershipStatusSchema,
} from "@/schemas/adminSchemas";
import { requireIdentity } from "@/lib/auth/auth";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dto/admin.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import {
  reconcileAdministrativeProviderStateTx,
  updateMembershipAdministrationTx,
} from "@/lib/db/transactions/admin.tx";
import { InvariantViolationError } from "@/lib/db/transactions/errors";

export async function changeAdminMembership(rawInput: unknown) {
  const input = changeAdminMembershipSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    if (input.membershipId === access.membershipId) {
      throw new InvariantViolationError(
        "An administrator cannot change their own role.",
      );
    }

    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      role: input.role,
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function suspendAdminMembership(rawInput: unknown) {
  const input = updateAdminMembershipStatusSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    if (input.membershipId === access.membershipId) {
      throw new InvariantViolationError(
        "An administrator cannot suspend their own membership.",
      );
    }

    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      status: "SUSPENDED",
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function restoreAdminMembership(rawInput: unknown) {
  const input = updateAdminMembershipStatusSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      status: "ACTIVE",
    });
    return toAdminMembershipDTO(membership);
  });
}

export async function reconcileAdminProviderState(rawInput: unknown) {
  const input = reconcileAdminProviderStateSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:records");
    const subscription = await reconcileAdministrativeProviderStateTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      provider: input.provider,
      providerCustomerId: input.providerCustomerId ?? null,
      providerSubscriptionId: input.providerSubscriptionId ?? null,
      planKey: input.planKey,
      status: input.status,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
    });
    return {
      ...subscription,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
  });
}
