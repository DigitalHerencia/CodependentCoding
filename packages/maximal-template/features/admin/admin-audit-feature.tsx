import { getAuditEvents } from "@/lib/fetchers/adminFetchers";
import { AdminAuditFeatureClient } from "./admin-audit-feature.client";
export async function AdminAuditFeature({ criteria }: { criteria: unknown }) {
  const page = await getAuditEvents(criteria);
  return (
    <AdminAuditFeatureClient key={page.query + "-" + page.page} page={page} />
  );
}
