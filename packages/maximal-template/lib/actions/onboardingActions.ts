"use server";

import { revalidatePath } from "next/cache";
import { getVerifiedPrimaryEmail, requireIdentity } from "@/lib/auth/auth";
import { withIdentityTransaction } from "@/lib/db/tenant";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { acceptInvitationTx } from "@/lib/db/transactions/invitationTx";
import { toActionResult } from "@/lib/utils/actionResult";
import { completeOnboardingTx } from "@/lib/db/transactions/onboardingTx";
import { onboardingSchema } from "@/schemas/commonSchemas";

export async function completeOnboarding(rawInput: unknown) {
  return toActionResult(async () => {
    await withIdentityTransaction(async (tx, user) => {
      const { name } = onboardingSchema.parse(rawInput);
      await completeOnboardingTx(tx, user.id, name);
    });
    revalidatePath("/", "layout");
  });
}

export async function claimWorkspaceApproval() {
  return toActionResult(async () => {
    await requireIdentity();
    const email = await getVerifiedPrimaryEmail();
    await withIdentityTransaction(async (tx, user) => {
      if (
        !user.profileCompletedAt ||
        !email ||
        email !== user.email?.toLowerCase()
      ) {
        throw new ResourceNotFoundError("Workspace approval");
      }

      const approval = await tx.invitation.findFirst({
        where: {
          email,
          requiresToken: false,
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: { id: true, organizationId: true, role: true },
      });
      if (!approval) throw new ResourceNotFoundError("Workspace approval");
      await acceptInvitationTx(tx, approval, user.id);
    });
    revalidatePath("/", "layout");
  });
}
