"use server";

import {
  archiveContactWorkflow,
  createContactWorkflow,
  createCrmDealWorkflow,
  updateContactWorkflow,
} from "../crm/crmWorkflows";
import { advanceDealStageWorkflow } from "../crm/workflows/advance-deal-stage.workflow";

export async function createCrmDeal(input: unknown) {
  return createCrmDealWorkflow(input);
}
export async function updateCrmDealStage(input: unknown) {
  return advanceDealStageWorkflow(input);
}
export async function createContact(input: unknown) {
  return createContactWorkflow(input);
}
export async function updateContact(input: unknown) {
  return updateContactWorkflow(input);
}
export async function archiveContact(input: unknown) {
  return archiveContactWorkflow(input);
}
