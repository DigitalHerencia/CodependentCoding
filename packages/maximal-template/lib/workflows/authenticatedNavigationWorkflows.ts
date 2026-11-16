import "server-only";
import { cache } from "react";
import { getOwnOnboardingProfile } from "@/lib/fetchers/onboardingFetchers";
import {
  getActiveMembershipRole,
  getOrganizationSwitcher,
} from "@/lib/fetchers/organizationFetchers";

/** Reuse ACTIVE-member reads; menu visibility is never an authorization boundary. */
export const loadAuthenticatedUserMenuWorkflow = cache(async () => {
  const [profile, switcher, role] = await Promise.all([
    getOwnOnboardingProfile(),
    getOrganizationSwitcher(),
    getActiveMembershipRole(),
  ]);
  return { profile, switcher, role };
});
