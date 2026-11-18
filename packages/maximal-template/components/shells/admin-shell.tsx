/** Admin shell feature orchestrates the frame after layout authorization. */
import { AdminShellTemplate } from "@/components/templates/admin-templates";
import { AuthAccountFeature } from "@/features/auth/authAccountFeature";
import type { AdminChildrenProps } from "@/types/adminTypes";

/** Keep presentation in templates and profile/identity behavior in auth. */
export function AdminShellFeature({ children }: AdminChildrenProps) {
  return (
    <AdminShellTemplate accountMenu={<AuthAccountFeature />}>
      {children}
    </AdminShellTemplate>
  );
}
