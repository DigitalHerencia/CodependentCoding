import { guardOnboardingWorkflow } from "@/lib/workflows/onboardingWorkflows";
import type { ReactNode } from "react";

// Members who have not finished onboarding never reach protected content.
export async function OnboardingGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  await guardOnboardingWorkflow();

  return children;
}
