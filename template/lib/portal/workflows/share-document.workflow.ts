import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toPortalDocumentDTO } from "../../db/dto/portal.dto";
import { withTenantTransaction } from "../../db/tenant";
import { sharePortalDocumentTx } from "../../db/transactions/portalTransactions";

export async function shareDocumentWorkflow(
  identity: AuthenticatedIdentity,
  command: { documentId: string; expectedVersion: number },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "portal:write");
    return toPortalDocumentDTO(
      await sharePortalDocumentTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
