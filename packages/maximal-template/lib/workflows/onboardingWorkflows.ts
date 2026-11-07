import { provisionWorkspaceAccess } from "@/lib/actions/onboardingActions";
import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";
import { redirect } from "next/navigation";
import "server-only";

export async function loadOnboardingWorkflow() {
  const state = await getOnboardingState();
  if (state.status === "active") redirect("/dashboard");
  // A finished profile without access (or a bootstrap owner not yet OWNER)
  // is provisioned here; no button. It stays pending only when suspended,
  // revoked, or (multi tenancy) an invitation link is waiting.
  if (state.status === "pending" && (await provisionWorkspaceAccess()).ok)
    redirect("/dashboard");
  return { state };
}

export async function guardOnboardingWorkflow() {
  if ((await getOnboardingState()).status !== "active") redirect("/onboarding");
}
