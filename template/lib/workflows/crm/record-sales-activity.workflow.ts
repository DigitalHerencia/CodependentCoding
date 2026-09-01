import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { recordSalesActivityTransaction } from "../../db/transactions/recordSalesActivityTransaction";

export async function recordSalesActivityWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    recordType: "account" | "contact" | "deal";
    recordId: string;
    kind: string;
    subject: string;
    body?: string | null;
    occurredAt: Date;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "crm:write");
    const activity = await recordSalesActivityTransaction(tx, {
      organizationId: access.organizationId,
      authoredByMembershipId: access.membershipId,
      ...command,
    });
    return {
      ...activity,
      occurredAt: activity.occurredAt.toISOString(),
      createdAt: activity.createdAt.toISOString(),
    };
  });
}
