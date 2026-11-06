import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";
import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";
import { redirect } from "next/navigation";
import "server-only";

export async function loadOnboardingWorkflow() {
  const state = await getOnboardingState();
  if (state.status === "active") redirect("/dashboard");
  return { state };
}

export async function guardOnboardingAccessWorkflow() {
  if (!(await getIdentity())) redirectToSignIn();
}
export async function guardOnboardingWorkflow() {
  if ((await getOnboardingState()).status !== "active") redirect("/onboarding");
}
