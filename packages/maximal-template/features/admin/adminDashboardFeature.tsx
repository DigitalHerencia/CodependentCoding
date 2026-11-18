/** Overview feature orchestrates authorized application data and presentation. */
import { AdminDashboardTemplate } from "@/components/templates/admin-templates";
import { loadAdminDashboardWorkflow } from "@/lib/workflows/adminWorkflows";

/** Query within the route's Suspense boundary and pass only serializable summary values. */
export async function AdminDashboardFeature() {
  return <AdminDashboardTemplate {...await loadAdminDashboardWorkflow()} />;
}
