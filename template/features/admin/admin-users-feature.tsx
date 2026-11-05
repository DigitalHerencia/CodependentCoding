import { getAdminMemberships } from "@/lib/fetchers/adminFetchers";
import { AdminUsersFeatureClient } from "./admin-users-feature.client";
export async function AdminUsersFeature() {
  return <AdminUsersFeatureClient memberships={await getAdminMemberships()} />;
}
