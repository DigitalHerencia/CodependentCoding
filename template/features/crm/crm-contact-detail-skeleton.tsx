import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function CrmContactDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/contacts/[contactId]" />;
}
