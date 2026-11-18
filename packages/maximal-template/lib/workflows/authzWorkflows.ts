/** Server orchestration for organization members, switching, and integrations. */

import "server-only";
import { TenantContextError } from "@/lib/db/tenancy";
import { provisionWorkspaceAccess } from "@/lib/actions/authzActions";
import { getProviderStatuses } from "@/lib/modules/status";
import {
  canViewIntegrationStatuses,
  getOrganizationMembers,
  getOrganizationSwitcher,
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
  const switcher = await getOrganizationSwitcher();

  return { switcher };
}

/** Recover delayed signup provisioning without reactivating restricted memberships. */
export async function recoverAuthzAccessWorkflow(
  error: unknown,
): Promise<void> {
  if (!(error instanceof TenantContextError)) throw error;
  const result = await provisionWorkspaceAccess();
  if (!result.ok) throw error;
}
