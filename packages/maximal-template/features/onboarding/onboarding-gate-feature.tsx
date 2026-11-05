import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getOnboardingState } from "@/lib/fetchers/onboardingFetchers";

// Members who have not finished onboarding never reach protected content.
export async function OnboardingGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  if ((await getOnboardingState()).status !== "active") redirect("/onboarding");

  return children;
}
