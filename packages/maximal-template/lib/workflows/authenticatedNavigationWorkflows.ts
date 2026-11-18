/** Authenticated Navigation Workflows contracts and composition for the owning application slice. */
import "server-only";
import { cache } from "react";
import {
  getActiveMembershipRole,
  getOrganizationSwitcher,
} from "@/lib/fetchers/authzFetchers";

/** Reuse ACTIVE-member reads; menu visibility is never an authorization boundary. */
export const loadAuthenticatedUserMenuWorkflow = cache(async () => {
  const [switcher, role] = await Promise.all([
    getOrganizationSwitcher(),
    getActiveMembershipRole(),
  ]);
  return { switcher, role };
});
