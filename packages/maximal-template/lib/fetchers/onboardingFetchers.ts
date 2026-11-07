import "server-only";

import { cache } from "react";
import { activeMembershipScope } from "@/lib/authz/mode";
import { TenantContextError, withIdentityTransaction } from "@/lib/db/tenant";

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
        select: { id: true },
      });
      return { status: membership ? "active" : "pending" } as const;
    });
  } catch (error) {
    if (error instanceof TenantContextError)
      return { status: "provisioning" } as const;
    throw error;
  }
});
