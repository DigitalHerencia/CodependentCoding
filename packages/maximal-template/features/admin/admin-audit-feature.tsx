import { loadAdminAuditWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminAuditFeatureClient } from "./admin-audit-feature.client";

export async function AdminAuditFeature({ criteria }: { criteria: unknown }) {
  const { page } = await loadAdminAuditWorkflow({ criteria });
  return (
    <AdminAuditFeatureClient key={page.query + "-" + page.page} page={page} />
  );
}
