import { getCurrentOrganization } from "@/lib/fetchers/organizationFetchers";
import { SharedProfileSettingsTemplate } from "@/components/templates/shared-templates";
import { ProfileFeatureClient } from "./organization-settings-form.client";
export async function ProfileFeature() {
  const organization = await getCurrentOrganization();
  return (
    <SharedProfileSettingsTemplate organization={organization}>
      <ProfileFeatureClient organization={organization} />
    </SharedProfileSettingsTemplate>
  );
}
