/** Profile onboarding orchestration, independent of tenancy and provider metadata. */
import {
  completeOnboarding,
  updateOwnOnboardingProfile,
  requireAuthIdentityAction,
  loadOwnAuthProfileAction,
} from "@/lib/actions/authActions";
import type { AuthProfileFormValues } from "@/types/authTypes";

/** Authenticate before loading the one local profile for the mandatory modal. */
export async function loadOnboardingWorkflow() {
  await requireAuthIdentityAction();
  return { profile: await loadOwnAuthProfileAction() };
}
/** Compose new-profile persistence through the authenticated action boundary. */
export async function completeOnboardingWorkflow(input: AuthProfileFormValues) {
  return completeOnboarding(input);
}
/** Compose profile edits without accepting another user's identifier. */
export async function editOnboardingWorkflow(input: AuthProfileFormValues) {
  return updateOwnOnboardingProfile(input);
}
