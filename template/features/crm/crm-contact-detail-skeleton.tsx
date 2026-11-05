import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CrmContactDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/contacts/[contactId]" />;
}
