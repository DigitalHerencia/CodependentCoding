import { updateInvoiceStatusWorkflow } from "../../invoicing/invoicingWorkflows";
export async function finalizeInvoiceWorkflow(input: {
  invoiceId: string;
  expectedVersion: number;
}) {
  return updateInvoiceStatusWorkflow({ ...input, status: "OPEN" });
}
