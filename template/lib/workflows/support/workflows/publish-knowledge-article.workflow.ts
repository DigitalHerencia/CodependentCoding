import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toKnowledgeArticleDTO } from "../../db/dto/support.dto";
import { withTenantTransaction } from "../../db/tenant";
import { publishKnowledgeArticleTx } from "../../db/transactions/supportTransactions";

export async function publishKnowledgeArticleWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    articleId?: string;
    slug: string;
    title: string;
    body: string;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    return toKnowledgeArticleDTO(
      await publishKnowledgeArticleTx(tx, {
        organizationId: access.organizationId,
        authorMembershipId: access.membershipId,
        ...command,
      }),
    );
  });
}
