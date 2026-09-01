"use server";

import { updateSupportTicketStatusWorkflow } from "../support/workflows/supportWorkflows";
import { createTicketFromIntakeWorkflow } from "../support/workflows/create-ticket-from-intake.workflow";

export async function createSupportTicket(input: unknown) { return createTicketFromIntakeWorkflow(input); }
export async function updateSupportTicketStatus(input: unknown) { return updateSupportTicketStatusWorkflow(input); }
