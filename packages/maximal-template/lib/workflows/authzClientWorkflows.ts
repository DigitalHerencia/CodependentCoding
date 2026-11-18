/** Browser-safe command bindings for organization switching. */
import { switchOrganization } from "@/lib/actions/authzActions";

/** Bind the authorized organization-switch command for client orchestration. */
export function getOrganizationSwitcherCommandsWorkflow() {
  return { switchOrganization };
}
