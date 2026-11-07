import "server-only";

import { cache } from "react";
import { activeMembershipScope, tenancy } from "@/lib/authz/mode";
import { TenantContextError, withIdentityTransaction } from "@/lib/db/tenant";
import { baseEnv } from "@/lib/utils/env";

export const getOnboardingState = cache(async () => {
  try {
    return await withIdentityTransaction(async (tx, user) => {
      if (!user.profileCompletedAt) {
        return {
          status: "profile",
          displayName: user.displayName ?? "",
        } as const;
      }
      const membership = await tx.membership.findFirst({
        where: activeMembershipScope(user.id),
        select: { role: true },
      });
      // The single organization's bootstrap owner is promoted from the
      // onboarding page (provisionWorkspaceAccess) until it holds OWNER.
      const awaitingOwnerPromotion =
        tenancy === "single" &&
        membership?.role !== "OWNER" &&
        baseEnv.value("BOOTSTRAP_OWNER_CLERK_USER_ID") === user.clerkUserId;
      return {
        status: membership && !awaitingOwnerPromotion ? "active" : "pending",
      } as const;
    });
  } catch (error) {
    if (error instanceof TenantContextError)
      return { status: "provisioning" } as const;
    throw error;
  }
});
