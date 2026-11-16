import "server-only";

import { cache } from "react";
import { activeMembershipScope } from "@/lib/authz/mode";
import {
  TenantContextError,
  withAuthenticatedRead,
  withIdentityTransaction,
} from "@/lib/db/tenant";
import type { OnboardingProfileDTO } from "@/types/onboardingTypes";

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
      return {
        status: membership ? "active" : "pending",
      } as const;
    });
  } catch (error) {
    if (error instanceof TenantContextError)
      return { status: "provisioning" } as const;
    throw error;
  }
});

/** Read only the signed-in profile after the existing ACTIVE membership/completion gate. */
export const getOwnOnboardingProfile = cache(
  async (): Promise<OnboardingProfileDTO> =>
    withAuthenticatedRead(async (tx, access) => {
      const profile = await tx.user.findUniqueOrThrow({
        where: { id: access.userId },
        select: { displayName: true, profileCompletedAt: true },
      });
      return {
        displayName: profile.displayName ?? "",
        profileCompletedAt: profile.profileCompletedAt?.toISOString() ?? null,
      };
    }),
);
