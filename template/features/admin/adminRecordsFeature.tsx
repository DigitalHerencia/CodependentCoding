import { getAdminRecordSummary } from "@/lib/fetchers/adminFetchers";
import { AdminRecordsTemplate } from "@/components/templates/admin-templates";
export async function AdminRecordsFeature() {
  return <AdminRecordsTemplate records={await getAdminRecordSummary()} />;
}
