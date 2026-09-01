import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { rescheduleDependentTasksTx } from "../../db/transactions/projectsTransactions";

export async function rescheduleDependentTasksWorkflow(
  identity: AuthenticatedIdentity,
  command: { taskId: string; dueAt: Date },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    return {
      taskIds: await rescheduleDependentTasksTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    };
  });
}
