import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toAdminMembershipDTO } from "../../db/dto/admin.dto";
import { withTenantTransaction } from "../../db/tenant";
import { updateMembershipAdministrationTx } from "../../db/transactions/adminTransactions";

export async function grantClientAccessWorkflow(
  identity: AuthenticatedIdentity,
  command: { membershipId: string },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    return toAdminMembershipDTO(
      await updateMembershipAdministrationTx(tx, {
        organizationId: access.organizationId,
        actorUserId: access.userId,
        membershipId: command.membershipId,
        role: "CLIENT",
        status: "ACTIVE",
      }),
    );
  });
}
