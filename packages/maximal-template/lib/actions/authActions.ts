"use server";

/** Authenticated identity and profile mutations; no tenant or invitation inputs. */
import { revalidatePath } from "next/cache";
import {
  getIdentity,
  requireIdentity,
  AuthenticationRequiredError,
} from "@/lib/integrations/clerk/server";
import { redirectAfterAuth, redirectToSignIn } from "@/lib/utils/authRedirects";
import { withIdentityTransaction } from "@/lib/db/rls";
import {
  completeOnboardingTx,
  updateOwnOnboardingProfileTx,
} from "@/lib/db/selects/authTx";
import { ResourceNotFoundError } from "@/lib/db/transactions/errors";
import { toActionResult } from "@/lib/utils/actionResult";
import { onboardingSchema } from "@/schemas/authSchemas";

/** Route orchestration remains safe to import through the Server Action boundary. */
export async function guardAuthEntryAction() {
  if (await getIdentity()) redirectAfterAuth();
}

/** Reject anonymous application entry without requiring organization membership. */
export async function requireAuthIdentityAction() {
  if (!(await getIdentity())) redirectToSignIn();
}

/** Complete exactly one local profile, even when every optional field is empty. */
export async function completeOnboarding(rawInput: unknown) {
  return toActionResult(async () => {
    const input = onboardingSchema.parse(rawInput);
    await withIdentityTransaction(async (tx, user) => {
      await completeOnboardingTx(tx, user.id, input);
    });
    revalidatePath("/", "layout");
  });
}

/** Edit only the caller's completed profile using identity-scoped RLS. */
export async function updateOwnOnboardingProfile(rawInput: unknown) {
  return toActionResult(async () => {
    const input = onboardingSchema.parse(rawInput);
    await withIdentityTransaction(async (tx, user) => {
      const result = await updateOwnOnboardingProfileTx(tx, user.id, input);
      if (result.count !== 1) throw new ResourceNotFoundError("Profile");
    });
    revalidatePath("/", "layout");
  });
}

/** Load a local profile, repairing only the legitimate initial webhook delivery race. */
export async function loadOwnAuthProfileAction() {
  const { getOwnOnboardingProfile } =
    await import("@/lib/fetchers/authFetchers");
  try {
    return await getOwnOnboardingProfile();
  } catch (error) {
    const { IdentityContextError } = await import("@/lib/db/rls");
    if (!(error instanceof IdentityContextError)) throw error;
    const identity = await requireIdentity();
    const { getClerkUserProjection } =
      await import("@/lib/integrations/clerk/webhooks");
    const providerUser = await getClerkUserProjection(identity.clerkUserId);
    if (!providerUser) throw new AuthenticationRequiredError();
    const { withProviderTransaction } = await import("@/lib/db/rls");
    const { persistClerkIdentityTx } = await import("@/lib/db/selects/authTx");
    await withProviderTransaction((tx) =>
      persistClerkIdentityTx(tx, providerUser),
    );
    return getOwnOnboardingProfile();
  }
}
