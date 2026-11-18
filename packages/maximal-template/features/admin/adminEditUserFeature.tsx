/** Edit route validates its target before mounting the RHF island. */
import { loadAdminUserEditWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminEditUserForm } from "./adminEditUserForm";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Owner/self edits fail closed before rendering a mutation form. */
export async function AdminEditUserFeature({ params }: AdminUserRouteProps) {
  const view = await loadAdminUserEditWorkflow(await params);
  return (
    <AdminEditUserForm
      key={`${view.membership.id}-${view.membership.role}-${view.membership.status}-${view.membership.deniedPermissions.join()}`}
      {...view}
    />
  );
}
