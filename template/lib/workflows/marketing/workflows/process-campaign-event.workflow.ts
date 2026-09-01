import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { processCampaignEventTx } from "../../db/transactions/marketingTransactions";

export async function processCampaignEventWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    campaignId: string;
    eventType: string;
    idempotencyKey: string;
    payload: JsonValue;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "marketing:write");
    return processCampaignEventTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      ...command,
    });
  });
}
type JsonValue =
  | string
  | number
  | boolean
  | { [key: string]: JsonValue }
  | JsonValue[];
