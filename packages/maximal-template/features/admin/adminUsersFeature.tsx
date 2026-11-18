/** Server feature resolves list reads inside Suspense. */
import { loadAdminUsersWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminUsersFeatureClient } from "./adminUsersFeatureClient";
import type { AdminListFeatureProps } from "@/types/adminTypes";
import { InvitationsFeatureClient } from "@/features/invitations/invitationsFeatureClient";
/** Orchestrate authorized list data and interactive presentation. */
export async function AdminUsersFeature({ criteria }: AdminListFeatureProps) {
  const view = await loadAdminUsersWorkflow({ criteria });
  return (
    <AdminUsersFeatureClient
      key={`${view.page.query}-${view.page.page}`}
      {...view}
      invitations={
        view.pending.canInvite ? (
          <InvitationsFeatureClient invitations={view.pending.invitations} />
        ) : null
      }
    />
  );
}
