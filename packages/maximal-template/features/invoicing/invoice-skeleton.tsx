import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function InvoiceSkeleton() {
  return <WorkspaceLoadingTemplate route="/invoices/[invoiceId]" />;
}
