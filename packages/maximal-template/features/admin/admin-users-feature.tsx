/** Server feature resolves list reads inside Suspense. */
import { loadAdminUsersWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminUsersFeatureClient } from "./admin-users-feature.client";
import type { AdminListFeatureProps } from "@/types/adminTypes";
/** Orchestrate authorized list data and interactive presentation. */
export async function AdminUsersFeature({ criteria }: AdminListFeatureProps) {
  const view = await loadAdminUsersWorkflow({ criteria });
  return (
    <AdminUsersFeatureClient
      key={`${view.page.query}-${view.page.page}`}
      {...view}
    />
  );
}
