import { updateOrganizationSettings } from "@/lib/actions/commonActions";
import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";

export const updateOrganizationSettingsWorkflow = updateOrganizationSettings;

export async function getOrganizationWorkspaceWorkflow() {
  return getCurrentOrganization();
}
