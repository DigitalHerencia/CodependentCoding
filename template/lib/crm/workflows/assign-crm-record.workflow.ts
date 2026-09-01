import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { assignCrmRecordTransaction } from "../../db/transactions/assignCrmRecordTransaction";

export async function assignCrmRecordWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    recordType: "account" | "contact" | "deal";
    recordId: string;
    ownerMembershipId: string;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "crm:write");
    return assignCrmRecordTransaction(tx, {
      organizationId: access.organizationId,
      ...command,
    });
  });
}
