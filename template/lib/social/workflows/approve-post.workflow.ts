import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toSocialPostDTO } from "../../db/dto/social.dto";
import { withTenantTransaction } from "../../db/tenant";
import { approveSocialPostTx } from "../../db/transactions/socialTransactions";

export async function approvePostWorkflow(
  identity: AuthenticatedIdentity,
  command: { postId: string; expectedVersion: number },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "social:write");
    return toSocialPostDTO(
      await approveSocialPostTx(tx, {
        organizationId: access.organizationId,
        approverMembershipId: access.membershipId,
        ...command,
      }),
    );
  });
}
