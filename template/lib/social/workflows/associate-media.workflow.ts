import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toSocialPostDTO } from "../../db/dto/social.dto";
import { withTenantTransaction } from "../../db/tenant";
import { associateSocialMediaTx } from "../../db/transactions/socialTransactions";

export async function associateMediaWorkflow(
  identity: AuthenticatedIdentity,
  command: { postId: string; assetId: string; position: number },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
    return toSocialPostDTO(
      await associateSocialMediaTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
