import { getAdminMemberships } from "@/lib/fetchers/adminFetchers";
import { AdminUsersFeatureClient } from "./admin-users-feature.client";
export async function AdminUsersFeature({ criteria }: { criteria: unknown }) {
  const page = await getAdminMemberships(criteria);
  return (
    <AdminUsersFeatureClient key={page.query + "-" + page.page} page={page} />
  );
}
