import "server-only";

import { assertPermission } from "@/lib/authz/permissions";
import { withAuthenticatedRead } from "@/lib/db/tenant";
import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";
import { getProviderStatuses } from "@/lib/integrations/status";

// Provider status comes from configuration, not persisted reads, so it lives here rather than in a fetcher.
export async function getIntegrationStatuses() {
  return withAuthenticatedRead(async (_tx, access) => {
    assertPermission(access, "organization:read");
    return getProviderStatuses();
  });
}

export async function getOrganizationWorkspaceWorkflow() {
  return getCurrentOrganization();
}

export async function getOrganizationSettingsWorkflow() {
  const [organization, integrations] = await Promise.all([
    getCurrentOrganization(),
    getIntegrationStatuses(),
  ]);
  return { organization, integrations };
}
