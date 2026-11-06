import {
  revokeInvitation,
  switchOrganization,
} from "@/lib/actions/commonActions";

export function getInvitationCommandsWorkflow() {
  return { revokeInvitation };
}

export function getOrganizationSwitcherCommandsWorkflow() {
  return { switchOrganization };
}
