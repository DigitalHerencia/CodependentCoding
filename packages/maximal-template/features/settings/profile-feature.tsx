import { SharedProfileSettingsTemplate } from "@/components/templates/shared-templates";
import { loadProfileWorkflow } from "@/lib/workflows/settingsWorkflows";
import { EditOrganizationSettingsForm } from "./editOrganizationSettingsForm";

export async function ProfileFeature() {
  const { organization } = await loadProfileWorkflow();
  return (
    <SharedProfileSettingsTemplate organization={organization}>
      <EditOrganizationSettingsForm organization={organization} />
    </SharedProfileSettingsTemplate>
  );
}
