import { AdminRecordDetailTemplate } from "@/components/templates/admin-templates";
import { loadAdminRecordDetailWorkflow } from "@/lib/workflows/adminWorkflows";

export async function AdminRecordDetailFeature({
  recordId,
}: {
  recordId: string;
}) {
  const { record } = await loadAdminRecordDetailWorkflow({ recordId });
  return <AdminRecordDetailTemplate record={record} />;
}
