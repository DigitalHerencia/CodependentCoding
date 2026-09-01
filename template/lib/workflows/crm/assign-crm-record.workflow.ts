import type { AuthenticatedIdentity } from "@/types/access";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantTransaction } from "@/lib/db/tenant";
import { assignCrmRecordTransaction } from "@/lib/db/transactions/assignCrmRecordTransaction";

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
