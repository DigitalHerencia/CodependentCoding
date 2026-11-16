"use server";

import { revalidatePath } from "next/cache";
import { getVerifiedPrimaryEmail, requireIdentity } from "@/lib/auth/auth";
import {
  withIdentityTransaction,
  withTenantTransaction,
} from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";
import {
  completeOnboardingTx,
  provisionWorkspaceAccessTx,
  updateOwnOnboardingProfileTx,
} from "@/lib/db/transactions/onboardingTx";
import { onboardingSchema } from "@/schemas/onboardingSchemas";

/** The Clerk-verified email, only when it matches the user record. */
function matchingEmail(email: string | null, user: { email: string | null }) {
  return email && email === user.email?.toLowerCase() ? email : null;
}

export async function completeOnboarding(rawInput: unknown) {
  return toActionResult(async () => {
    const { name } = onboardingSchema.parse(rawInput);
    const email = await getVerifiedPrimaryEmail();
    await withIdentityTransaction(async (tx, user) => {
      await completeOnboardingTx(tx, user.id, name);
      await provisionWorkspaceAccessTx(
        tx,
        { id: user.id, displayName: user.displayName ?? name },
        matchingEmail(email, user),
      );
    });
    revalidatePath("/", "layout");
  });
}

/**
 * Ensures signup access independently of profile completion. Runs
 * while the onboarding page renders, so it does not revalidate; the caller
 * redirects instead.
 */
export async function provisionWorkspaceAccess() {
  return toActionResult(async () => {
    const email = await getVerifiedPrimaryEmail();
    await withIdentityTransaction(async (tx, user) => {
      const granted = await provisionWorkspaceAccessTx(
        tx,
        { id: user.id, displayName: user.displayName },
        matchingEmail(email, user),
      );
      if (!granted) throw new ResourceNotFoundError("Workspace access");
    });
  });
}

/** Updates only the caller's completed profile under the existing active-member gate. */
export async function updateOwnOnboardingProfile(rawInput: unknown) {
  return toActionResult(async () => {
    const { name } = onboardingSchema.parse(rawInput);
    const identity = await requireIdentity();
    await withTenantTransaction(identity, async (tx, access) => {
      const updated = await updateOwnOnboardingProfileTx(
        tx,
        access.userId,
        name,
      );
      if (updated.count !== 1) throw new ResourceNotFoundError("Profile");
    });
    revalidatePath("/onboarding/profile");
    revalidatePath("/settings/profile");
    revalidatePath("/settings/members");
  });
}
