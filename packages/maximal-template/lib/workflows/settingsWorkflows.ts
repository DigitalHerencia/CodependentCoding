import { getBillingSubscription } from "@/lib/fetchers/billingFetchers";
import {
  getCurrentOrganization,
  getOrganizationMembers,
  getOrganizationSwitcher,
} from "@/lib/fetchers/organizationFetchers";
import { loadInvitationsWorkflow } from "@/lib/workflows/invitationWorkflows";
import { getIntegrationStatuses } from "@/lib/workflows/organizationWorkflows";
import { notFound } from "next/navigation";
import "server-only";

export async function loadBillingWorkflow() {
  const subscription = await getBillingSubscription();
  return { subscription };
}

export async function loadIntegrationsWorkflow() {
  const integrations = await getIntegrationStatuses();
  if (!integrations) notFound();
  return { integrations };
}

export async function loadMembersWorkflow() {
  const [members, pending] = await Promise.all([
    getOrganizationMembers(),
    loadInvitationsWorkflow(),
  ]);
  return { members, pending };
}

export async function loadOrganizationSwitcherWorkflow() {
  const switcher = await getOrganizationSwitcher();

  return { switcher };
}

export async function loadProfileWorkflow() {
  const organization = await getCurrentOrganization();
  return { organization };
}
