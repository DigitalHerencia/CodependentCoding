import { AdminUserDetailTemplate } from "@/components/templates/admin-templates";
import { loadAdminUserDetailWorkflow } from "@/lib/workflows/adminWorkflows";
import { EditAdminMembershipForm } from "./editAdminMembershipForm";

export async function AdminUserDetailFeature({ userId }: { userId: string }) {
  const { membership } = await loadAdminUserDetailWorkflow({ userId });
  return (
    <AdminUserDetailTemplate membership={membership}>
      <EditAdminMembershipForm
        key={`${membership.role}-${membership.status}`}
        membership={membership}
      />
    </AdminUserDetailTemplate>
  );
}
