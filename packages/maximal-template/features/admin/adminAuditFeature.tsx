/** Server feature resolves list reads inside Suspense. */
import { loadAdminAuditWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminAuditFeatureClient } from "./adminAuditFeatureClient";
import type { AdminListFeatureProps } from "@/types/adminTypes";
/** Orchestrate authorized list data and interactive presentation. */
export async function AdminAuditFeature({ criteria }: AdminListFeatureProps) {
  const view = await loadAdminAuditWorkflow({ criteria });
  return (
    <AdminAuditFeatureClient
      key={`${view.page.query}-${view.page.page}`}
      {...view}
    />
  );
}
