import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function CrmLeadDetailSkeleton() {
  return <WorkspaceLoadingTemplate route="/crm/leads/[leadId]" />;
}
