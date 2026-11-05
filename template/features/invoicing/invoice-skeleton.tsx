import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function InvoiceSkeleton() {
  return <WorkspaceLoadingState route="/invoices/[invoiceId]" />;
}
