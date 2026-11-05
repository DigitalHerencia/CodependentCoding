import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function InvoicesSkeleton() {
  return <WorkspaceLoadingState route="/invoices" />;
}
