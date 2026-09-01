import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toTaskDTO } from "../../db/dto/projects.dto";
import { withTenantTransaction } from "../../db/tenant";
import { assignTaskTx } from "../../db/transactions/projectsTransactions";

export async function assignTaskWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    taskId: string;
    assigneeMembershipId: string | null;
    expectedVersion: number;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    return toTaskDTO(
      await assignTaskTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
