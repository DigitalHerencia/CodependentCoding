"use server";

import {
  createInvoiceWorkflow,
  updateInvoiceStatusWorkflow,
} from "../invoicing/invoicingWorkflows";

export async function createInvoice(input: unknown) {
  return createInvoiceWorkflow(input);
}
export async function updateInvoiceStatus(input: unknown) {
  return updateInvoiceStatusWorkflow(input);
}
