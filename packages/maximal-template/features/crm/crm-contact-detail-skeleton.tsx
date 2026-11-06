import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function CrmContactDetailSkeleton() {
  return <WorkspaceLoadingTemplate route="/crm/contacts/[contactId]" />;
}
