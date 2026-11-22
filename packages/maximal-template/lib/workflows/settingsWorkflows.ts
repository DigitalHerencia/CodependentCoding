import "server-only";

import {
  canViewIntegrationStatuses,
  getOrganizationMembersPage,
} from "@/lib/fetchers/authzFetchers";
import { getBillingSubscription } from "@/lib/fetchers/billingFetchers";
import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";
import {
  getProviderConfiguration,
  getProviderStatuses,
} from "@/lib/modules/status";
import { notFound } from "next/navigation";
import type {
  SettingsBillingProps,
  SettingsMembersSearchParams,
} from "@/types/settingsTypes";

/** Resolve one bounded directory page and independent invitation capabilities in the active tenant. */
export async function loadMembersWorkflow({
  page,
}: SettingsMembersSearchParams = {}) {
  const [directory, pending] = await Promise.all([
    getOrganizationMembersPage(typeof page === "string" ? Number(page) : 1),
    getPendingInvitations(),
  ]);
  return { ...directory, pending };
}

/** Return installed-provider configuration metadata after the privileged owner check. */
export async function loadIntegrationsWorkflow() {
  if (!(await canViewIntegrationStatuses())) notFound();
  return { integrations: getProviderStatuses() };
}

/** Read the current tenant's subscription and inspect only the billing provider configuration. */
export async function loadBillingWorkflow(): Promise<SettingsBillingProps> {
  const [subscription, canInspectProvider] = await Promise.all([
    getBillingSubscription(),
    canViewIntegrationStatuses(),
  ]);
  return {
    subscription,
    providerConfiguration: canInspectProvider
      ? getProviderConfiguration("billing")
      : "restricted",
  };
}
