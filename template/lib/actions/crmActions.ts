"use server";

import {
  archiveContactWorkflow,
  createContactWorkflow,
  createCrmDealWorkflow,
  updateContactWorkflow,
  updateCrmDealStageWorkflow,
} from "../crm/workflows/crmWorkflows";

export async function createCrmDeal(input: unknown) { return createCrmDealWorkflow(input); }
export async function updateCrmDealStage(input: unknown) { return updateCrmDealStageWorkflow(input); }
export async function createContact(input: unknown) { return createContactWorkflow(input); }
export async function updateContact(input: unknown) { return updateContactWorkflow(input); }
export async function archiveContact(input: unknown) { return archiveContactWorkflow(input); }
