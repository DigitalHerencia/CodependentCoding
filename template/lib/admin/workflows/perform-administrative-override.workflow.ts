import type { AuthenticatedIdentity } from "../../../types/access";
import type { AdminBulkOperation } from "./execute-bulk-operation.workflow";
import { executeBulkOperationWorkflow } from "./execute-bulk-operation.workflow";

export async function performAdministrativeOverrideWorkflow(
  identity: AuthenticatedIdentity,
  command: AdminBulkOperation,
) {
  const [result] = await executeBulkOperationWorkflow(identity, [command]);
  return result;
}
