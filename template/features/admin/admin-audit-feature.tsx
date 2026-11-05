import { getAuditEvents } from "@/lib/fetchers/adminFetchers";
import { AdminAuditFeatureClient } from "./admin-audit-feature.client";
export async function AdminAuditFeature() {
  return <AdminAuditFeatureClient events={await getAuditEvents()} />;
}
