/** Record detail feature resolves asynchronous route parameters inside Suspense. */
import { AdminRecordDetailTemplate } from "@/components/templates/admin-templates";
import { loadAdminRecordDetailWorkflow } from "@/lib/workflows/adminWorkflows";
import type { AdminRecordRouteProps } from "@/types/adminTypes";
/** Render only a resource present in the installed module registry. */
export async function AdminRecordDetailFeature({
  params,
}: AdminRecordRouteProps) {
  return (
    <AdminRecordDetailTemplate
      {...await loadAdminRecordDetailWorkflow(await params)}
    />
  );
}
