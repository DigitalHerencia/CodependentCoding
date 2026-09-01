import type { AuthenticatedIdentity } from "../../../types/access";
import { assertPermission } from "../../authz/permissions";
import { toSupportTicketDTO } from "../../db/dto/support.dto";
import { withTenantTransaction } from "../../db/tenant";
import { assignSupportTicketTx } from "../../db/transactions/supportTransactions";

export async function assignTicketWorkflow(
  identity: AuthenticatedIdentity,
  command: {
    ticketId: string;
    assigneeMembershipId: string;
    expectedVersion: number;
  },
) {
  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "support:write");
    return toSupportTicketDTO(
      await assignSupportTicketTx(tx, {
        organizationId: access.organizationId,
        ...command,
      }),
    );
  });
}
