"use server";

import { updateOrganizationSettingsWorkflow } from "../organization/organizationWorkflows";

export async function updateOrganizationSettings(rawInput: unknown) {
  return updateOrganizationSettingsWorkflow(rawInput);
}
