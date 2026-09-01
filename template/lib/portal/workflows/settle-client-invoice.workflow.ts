import { updateInvoiceStatusWorkflow } from "../../invoicing/invoicingWorkflows";

export async function settleClientInvoiceWorkflow(command: {
  invoiceId: string;
  expectedVersion: number;
}) {
  return updateInvoiceStatusWorkflow({
    ...command,
    status: "PAID",
  });
}
