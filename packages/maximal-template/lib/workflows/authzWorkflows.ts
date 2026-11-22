/** Server orchestration for organization members, switching, and integrations. */

"use server";
import { TenantContextError } from "@/lib/db/tenancy";
import {
  switchOrganization,
  provisionWorkspaceAccess,
} from "@/lib/actions/authzActions";
import {
  getOrganizationSwitcher,
  getActiveMembershipRole,
} from "@/lib/fetchers/authzFetchers";
/** Prepare the signed-in caller's authorized organization choices. */
export async function loadOrganizationSwitcherWorkflow() {
  const [switcher, role] = await Promise.all([
    getOrganizationSwitcher(),
    getActiveMembershipRole(),
  ]);
  return { switcher, role };
}

/** Recover delayed signup provisioning without reactivating restricted memberships. */
export async function recoverAuthzAccessWorkflow(
  error: unknown,
): Promise<void> {
  if (!(error instanceof TenantContextError)) throw error;
  const result = await provisionWorkspaceAccess();
  if (!result.ok) throw error;
}

/** Switch only to an ACTIVE membership through the authenticated mutation boundary. */
export async function switchOrganizationWorkflow(input: unknown) {
  return switchOrganization(input);
}
