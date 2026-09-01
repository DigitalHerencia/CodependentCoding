import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";

export async function getOrganizationWorkspaceWorkflow() {
  return getCurrentOrganization();
}
