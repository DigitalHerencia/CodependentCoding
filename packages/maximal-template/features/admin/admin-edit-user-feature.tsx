/** Edit route validates its target before mounting the RHF island. */
import { loadAdminUserEditWorkflow } from "@/lib/workflows/adminWorkflows";
import { EditAdminMembershipForm } from "./editAdminMembershipForm";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Owner/self edits fail closed before rendering a mutation form. */
export async function AdminEditUserFeature({ params }: AdminUserRouteProps) {
  const { membership } = await loadAdminUserEditWorkflow(await params);
  return (
    <EditAdminMembershipForm
      key={`${membership.id}-${membership.role}-${membership.status}`}
      membership={membership}
    />
  );
}
