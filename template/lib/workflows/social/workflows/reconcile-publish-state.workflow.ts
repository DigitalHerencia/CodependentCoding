import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toSocialPostDTO } from "../../db/dto/social.dto";
import { withTenantTransaction } from "../../db/tenant";
import { reconcileSocialPublicationTx } from "../../db/transactions/socialTransactions";

export async function reconcilePublishStateWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    postId: string;
    results: readonly {
      variantId: string;
      providerPostId?: string;
      errorCode?: string;
    }[];
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
    return toSocialPostDTO(
      await reconcileSocialPublicationTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
