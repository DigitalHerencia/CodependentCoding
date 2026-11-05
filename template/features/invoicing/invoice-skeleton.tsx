import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function InvoiceSkeleton() {
  return <WorkspaceLoadingState route="/invoices/[invoiceId]" />;
}
