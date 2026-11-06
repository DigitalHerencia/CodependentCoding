import { canViewIntegrationStatuses } from "@/lib/fetchers/organizationFetchers";
import { getProviderStatuses } from "@/lib/modules/status";
import "server-only";

export async function getIntegrationStatuses() {
  if (!(await canViewIntegrationStatuses())) return null;
  return getProviderStatuses();
}
