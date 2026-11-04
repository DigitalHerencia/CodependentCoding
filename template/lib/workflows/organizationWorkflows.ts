import "server-only";

import { canViewIntegrationStatuses } from "@/lib/fetchers/organizationFetchers";
import { getProviderStatuses } from "@/lib/integrations/status";

export async function getIntegrationStatuses() {
  if (!(await canViewIntegrationStatuses())) return null;
  return getProviderStatuses();
}
