import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CrmContactsSkeleton() {
  return <WorkspaceLoadingState route="/crm/contacts" />;
}
