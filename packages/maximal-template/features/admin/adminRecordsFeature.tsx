/** Records feature composes the authorized inventory with its page template. */
import { AdminRecordsTemplate } from "@/components/templates/admin-templates";
import { loadAdminRecordsWorkflow } from "@/lib/workflows/adminWorkflows";
/** Render counts for the installed registry resources. */
export async function AdminRecordsFeature() {
  return <AdminRecordsTemplate {...await loadAdminRecordsWorkflow()} />;
}
