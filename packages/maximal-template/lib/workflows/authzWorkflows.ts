/** Server orchestration for organization members, switching, and integrations. */

"use server";
import { TenantContextError } from "@/lib/db/tenancy";
import {
  switchOrganization,
  provisionWorkspaceAccess,
} from "@/lib/actions/authzActions";
import { getProviderStatuses } from "@/lib/modules/status";
import {
  canViewIntegrationStatuses,
  getOrganizationMembers,
  getOrganizationSwitcher,
  getActiveMembershipRole,
} from "@/lib/fetchers/authzFetchers";
import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";
import { notFound } from "next/navigation";
/** Read provider status metadata after verifying settings permission. */
export async function getIntegrationStatuses() {
  if (!(await canViewIntegrationStatuses())) return null;
  return getProviderStatuses();
}

/** Prepare the integrations route and reject unauthorized membership access. */
export async function loadIntegrationsWorkflow() {
  const integrations = await getIntegrationStatuses();
  if (!integrations) notFound();
  return { integrations };
}

/** Load organization members and pending invitations for the members route. */
export async function loadMembersWorkflow() {
  const [members, pending] = await Promise.all([
    getOrganizationMembers(),
    getPendingInvitations(),
  ]);
  return { members, pending };
}

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
