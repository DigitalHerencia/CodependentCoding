import type { AuthenticatedIdentity } from "@/types/access";
import { assertPermission } from "@/lib/authz/permissions";
import { withTenantTransaction } from "@/lib/db/tenant";
import { countRecentAiGenerationsTx } from "@/lib/db/transactions/aiTransactions";

export class AiRateLimitError extends Error {
  constructor(message = "AI generation rate limit exceeded.") {
    super(message);
    this.name = "AiRateLimitError";
  }
}

export function enforceRateLimit({
  recentGenerationCount,
  limit,
}: {
  recentGenerationCount: number;
  limit: number;
}) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("The AI rate limit must be a positive integer.");
  }
  if (recentGenerationCount >= limit) throw new AiRateLimitError();
}

export async function enforceRateLimitWorkflow(
  identity: AuthenticatedIdentity,
  limit = 5,
  windowStart = new Date(Date.now() - 60_000),
) {
  return withTenantTransaction(identity, async (tx: any, access) => {
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
