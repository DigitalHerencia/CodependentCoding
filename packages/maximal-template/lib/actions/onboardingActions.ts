"use server";

import { revalidatePath } from "next/cache";
import { getVerifiedPrimaryEmail } from "@/lib/auth/auth";
import { withIdentityTransaction } from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";
import { baseEnv } from "@/lib/utils/env";
import {
  completeOnboardingTx,
  provisionWorkspaceAccessTx,
} from "@/lib/db/transactions/onboardingTx";
import { onboardingSchema } from "@/schemas/commonSchemas";

/** The Clerk-verified email, only when it matches the user record. */
function matchingEmail(email: string | null, user: { email: string | null }) {
  return email && email === user.email?.toLowerCase() ? email : null;
}

function isBootstrapOwner(clerkUserId: string) {
  return baseEnv.value("BOOTSTRAP_OWNER_CLERK_USER_ID") === clerkUserId;
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
        isBootstrapOwner(user.clerkUserId),
      );
    });
    revalidatePath("/", "layout");
  });
}

/** Retries access for a user who finished onboarding but has no workspace yet. */
export async function provisionWorkspaceAccess() {
  return toActionResult(async () => {
    const email = await getVerifiedPrimaryEmail();
    await withIdentityTransaction(async (tx, user) => {
      if (!user.profileCompletedAt)
        throw new ResourceNotFoundError("Workspace approval");
      const granted = await provisionWorkspaceAccessTx(
        tx,
        { id: user.id, displayName: user.displayName },
        matchingEmail(email, user),
        isBootstrapOwner(user.clerkUserId),
      );
      if (!granted) throw new ResourceNotFoundError("Workspace approval");
    });
    revalidatePath("/", "layout");
  });
}
