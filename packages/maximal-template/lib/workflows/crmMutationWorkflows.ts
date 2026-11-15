"use server";

/**
 * Client-callable CRM application workflows. This is a SERVER workflow module,
 * not a browser workflow. Every operation delegates to an independently
 * authorized and validated CRM action; it never handles persistence itself.
 */
import {
  createCrmAccount,
  updateCrmAccount,
  createContact,
  updateContact,
  createCrmDeal,
  updateCrmDealStage,
  qualifyCrmLead,
} from "@/lib/actions/crmActions";

// -----------------------------------------------------------------------------
// Account workflows
// -----------------------------------------------------------------------------
/** Compose the authorized account creation action. */
export async function createCrmAccountWorkflow(input: unknown) {
  return createCrmAccount(input);
}
/** Compose the authorized account update action. */
export async function updateCrmAccountWorkflow(input: unknown) {
  return updateCrmAccount(input);
}

// -----------------------------------------------------------------------------
// Contact and lead workflows
// -----------------------------------------------------------------------------
/** Compose the authorized contact creation action. */
export async function createCrmContactWorkflow(input: unknown) {
  return createContact(input);
}
/** Compose the authorized contact update action. */
export async function updateCrmContactWorkflow(input: unknown) {
  return updateContact(input);
}
/** Qualify an existing lead through the authorized action. */
export async function qualifyCrmLeadWorkflow(contactId: unknown) {
  return qualifyCrmLead(contactId);
}

// -----------------------------------------------------------------------------
// Opportunity workflows
// -----------------------------------------------------------------------------
/** Create an opportunity through the authorized action. */
export async function createCrmDealWorkflow(input: unknown) {
  return createCrmDeal(input);
}
/** Advance an opportunity stage through the authorized transaction. */
export async function updateCrmDealStageWorkflow(input: unknown) {
  return updateCrmDealStage(input);
}
