import { loadAdminUsersWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminUsersFeatureClient } from "./admin-users-feature.client";

export async function AdminUsersFeature({ criteria }: { criteria: unknown }) {
  const { page } = await loadAdminUsersWorkflow({ criteria });
  return (
    <AdminUsersFeatureClient key={page.query + "-" + page.page} page={page} />
  );
}
