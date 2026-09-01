import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { completeMilestoneTx } from "../../db/transactions/projectsTransactions";

export async function completeMilestoneWorkflow(
  identity: AuthenticatedIdentity,
  command: { milestoneId: string },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "projects:write");
    const result = await completeMilestoneTx(tx, {
      organizationId: access.organizationId,
      milestoneId: command.milestoneId,
    });
    return {
      id: result.id,
      completedAt: result.completedAt?.toISOString() ?? null,
    };
  });
}
