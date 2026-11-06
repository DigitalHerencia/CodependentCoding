import { AdminRecordsTemplate } from "@/components/templates/admin-templates";
import { loadAdminRecordsWorkflow } from "@/lib/workflows/adminWorkflows";

export async function AdminRecordsFeature() {
  const { records } = await loadAdminRecordsWorkflow();
  return <AdminRecordsTemplate records={records} />;
}
