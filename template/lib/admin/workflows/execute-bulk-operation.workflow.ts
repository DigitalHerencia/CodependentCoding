import type { AuthenticatedIdentity } from "../../../types/access";

import { changeMembershipWorkflow } from "./change-membership.workflow";
import { restoreUserWorkflow } from "./restore-user.workflow";
import { suspendUserWorkflow } from "./suspend-user.workflow";

export type AdminBulkOperation =
  | { kind: "suspend"; membershipId: string }
  | { kind: "restore"; membershipId: string }
  | {
      kind: "change-role";
      membershipId: string;
      role: "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "BILLING" | "SUPPORT" | "CLIENT" | "VIEWER";
    };

export async function executeBulkOperationWorkflow(
  identity: AuthenticatedIdentity,
  commands: readonly AdminBulkOperation[],
) {
  const results = [];
  for (const command of commands) {
    if (command.kind === "suspend") {
      results.push(await suspendUserWorkflow(identity, command));
    } else if (command.kind === "restore") {
      results.push(await restoreUserWorkflow(identity, command));
    } else {
      results.push(await changeMembershipWorkflow(identity, command));
    }
  }
  return results;
}
