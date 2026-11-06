import { OnboardingAccessTemplate } from "@/components/templates/shared-templates";
import { guardOnboardingAccessWorkflow } from "@/lib/workflows/onboardingWorkflows";
import type { ReactNode } from "react";

export async function OnboardingAccessFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  await guardOnboardingAccessWorkflow();
  return <OnboardingAccessTemplate>{children}</OnboardingAccessTemplate>;
}
