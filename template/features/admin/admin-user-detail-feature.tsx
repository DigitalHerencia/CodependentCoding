import { notFound } from "next/navigation";
import { getAdminMemberships } from "@/lib/fetchers/adminFetchers";
import { AdminUserDetailTemplate } from "@/components/templates/admin-templates";
import { AdminUserDetailFeatureClient } from "./admin-user-detail-feature.client";
export async function AdminUserDetailFeature({ userId }: { userId: string }) {
  const membership = (await getAdminMemberships()).find(
    (member) => member.user.id === userId,
  );
  if (!membership) notFound();
  return (
    <AdminUserDetailTemplate membership={membership}>
      <AdminUserDetailFeatureClient
        key={`${membership.role}-${membership.status}`}
        membership={membership}
      />
    </AdminUserDetailTemplate>
  );
}
