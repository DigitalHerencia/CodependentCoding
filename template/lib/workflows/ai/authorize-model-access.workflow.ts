import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
export async function authorizeModelAccessWorkflow(
  identity: AuthenticatedIdentity,
) {
  return withTenantTransaction(identity, async (_tx, access) => {
    assertPermission(access, "ai:write");
    return {
      organizationId: access.organizationId,
      userId: access.userId,
    };
  });
}
