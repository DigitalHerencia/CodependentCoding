import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toProjectSummaryDTO } from "../../db/dto/projects.dto";
import { withTenantTransaction } from "../../db/tenant";
import { completeProjectTx } from "../../db/transactions/projectsTransactions";

export async function completeProjectWorkflow(
  identity: AuthenticatedIdentity,
  command: { projectId: string; expectedVersion: number },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    return toProjectSummaryDTO(
      await completeProjectTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
