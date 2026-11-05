import { notFound } from "next/navigation";
import { getAdminMembership } from "@/lib/fetchers/adminFetchers";
import { AdminUserDetailTemplate } from "@/components/templates/admin-templates";
import { AdminUserDetailFeatureClient } from "./admin-membership-form.client";
export async function AdminUserDetailFeature({ userId }: { userId: string }) {
  const membership = await getAdminMembership(userId);
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
