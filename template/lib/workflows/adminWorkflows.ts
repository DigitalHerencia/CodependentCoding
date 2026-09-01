import {
  changeAdminMembership,
  restoreAdminMembership,
  suspendAdminMembership,
} from "@/lib/actions/adminActions";
import type { AdminBulkOperation } from "@/types/adminTypes";

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
