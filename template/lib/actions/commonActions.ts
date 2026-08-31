"use server";

import { updateOrganizationSettingsWorkflow } from "../organization/workflows/organizationWorkflows";

export async function updateOrganizationSettings(rawInput: unknown) {
  return updateOrganizationSettingsWorkflow(rawInput);
}
