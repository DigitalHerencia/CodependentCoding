import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function InvoicesSkeleton() {
  return <WorkspaceLoadingState route="/invoices" />;
}
