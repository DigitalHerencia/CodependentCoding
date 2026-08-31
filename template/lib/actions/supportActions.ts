"use server";

import { createSupportTicketWorkflow, updateSupportTicketStatusWorkflow } from "../support/workflows/supportWorkflows";

export async function createSupportTicket(input: unknown) { return createSupportTicketWorkflow(input); }
export async function updateSupportTicketStatus(input: unknown) { return updateSupportTicketStatusWorkflow(input); }
