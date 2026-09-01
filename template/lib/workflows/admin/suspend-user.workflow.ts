import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toAdminMembershipDTO } from "../../db/dto/admin.dto";
import { withTenantTransaction } from "../../db/tenant";
import { updateMembershipAdministrationTx } from "../../db/transactions/adminTransactions";
import { InvariantViolationError } from "../../db/transactions/errors";

export async function suspendUserWorkflow(
  identity: AuthenticatedIdentity,
  command: { membershipId: string },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    if (command.membershipId === access.membershipId) {
      throw new InvariantViolationError("An administrator cannot suspend their own membership.");
    }
    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: command.membershipId,
      status: "SUSPENDED",
    });
    return toAdminMembershipDTO(membership);
  });
}
