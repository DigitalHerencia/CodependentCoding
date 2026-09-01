import type { AuthenticatedIdentity } from "../../../types/access";
import { enforceRateLimit } from "../../ai/logic/enforce-rate-limit.logic";
import { assertPermission } from "../../authz/permissions";
import { withTenantTransaction } from "../../db/tenant";
import { countRecentAiGenerationsTx } from "../../db/transactions/aiTransactions";
export async function enforceRateLimitWorkflow(
  identity: AuthenticatedIdentity,
  limit = 5,
  windowStart = new Date(Date.now() - 60_000),
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "ai:write");
    const recentGenerationCount = await countRecentAiGenerationsTx(tx, {
      organizationId: access.organizationId,
      userId: access.userId,
      windowStart,
    });
    enforceRateLimit({ recentGenerationCount, limit });
    return { recentGenerationCount, limit };
  });
}
