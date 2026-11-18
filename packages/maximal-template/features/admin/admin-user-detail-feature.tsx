/** Member detail has its own read-only route template. */
import { AdminUserDetailTemplate } from "@/components/templates/admin-templates";
import { loadAdminUserDetailWorkflow } from "@/lib/workflows/adminWorkflows";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Resolve membership and server-derived editability inside Suspense. */
export async function AdminUserDetailFeature({ params }: AdminUserRouteProps) {
  return (
    <AdminUserDetailTemplate
      {...await loadAdminUserDetailWorkflow(await params)}
    />
  );
}
