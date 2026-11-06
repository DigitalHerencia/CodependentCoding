import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function CrmAccountDetailSkeleton() {
  return <WorkspaceLoadingTemplate route="/crm/accounts/[accountId]" />;
}
