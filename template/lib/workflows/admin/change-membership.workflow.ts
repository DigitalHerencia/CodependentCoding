import type { AuthenticatedIdentity } from "@/types/access";
import { assertPermission } from "@/lib/authz/permissions";
import { toAdminMembershipDTO } from "@/lib/db/dto/admin.dto";
import { withTenantTransaction } from "@/lib/db/tenant";
import { updateMembershipAdministrationTx } from "@/lib/db/transactions/adminTransactions";
import { InvariantViolationError } from "@/lib/db/transactions/errors";

export async function changeMembershipWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    membershipId: string;
    role:
      | "OWNER"
      | "ADMIN"
      | "MANAGER"
      | "MEMBER"
      | "BILLING"
      | "SUPPORT"
      | "CLIENT"
      | "VIEWER";
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");
    if (command.membershipId === access.membershipId) {
      throw new InvariantViolationError(
        "An administrator cannot change their own role.",
      );
    }
    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: command.membershipId,
      role: command.role,
    });
    return toAdminMembershipDTO(membership);
  });
}
