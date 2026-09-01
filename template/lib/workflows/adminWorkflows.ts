import {
  changeAdminMembership,
  reconcileAdminProviderState,
  restoreAdminMembership,
  suspendAdminMembership,
} from "@/lib/actions/adminActions";
import { getDisplayAuditEvents } from "@/lib/fetchers/adminFetchers";
import type { AdminBulkOperation } from "@/types/adminTypes";

export const changeMembershipWorkflow = changeAdminMembership;
export const suspendUserWorkflow = suspendAdminMembership;
export const restoreUserWorkflow = restoreAdminMembership;
export const reconcileAdministrativeProviderStateWorkflow =
  reconcileAdminProviderState;

export async function classifyAuditEventWorkflow(limit = 100) {
  return getDisplayAuditEvents(limit);
}

export async function executeBulkOperationWorkflow(
  commands: readonly AdminBulkOperation[],
) {
  const results = [];
  for (const command of commands) {
    if (command.kind === "suspend") {
      results.push(await suspendAdminMembership(command));
    } else if (command.kind === "restore") {
      results.push(await restoreAdminMembership(command));
    } else {
      results.push(await changeAdminMembership(command));
    }
  }
  return results;
}

export async function performAdministrativeOverrideWorkflow(
  command: AdminBulkOperation,
) {
  const [result] = await executeBulkOperationWorkflow([command]);
  return result;
}
