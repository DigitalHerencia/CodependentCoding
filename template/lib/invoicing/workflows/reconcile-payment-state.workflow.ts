import { updateInvoiceStatusWorkflow } from "../../invoicing/invoicingWorkflows";

export async function reconcilePaymentStateWorkflow(command: {
  invoiceId: string;
  paid: boolean;
  expectedVersion: number;
}) {
  return updateInvoiceStatusWorkflow({
    invoiceId: command.invoiceId,
    status: command.paid ? "PAID" : "OPEN",
    expectedVersion: command.expectedVersion,
  });
}
