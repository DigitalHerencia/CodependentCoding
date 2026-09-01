"use server";

import { createSocialPostWorkflow } from "../social/workflows/socialWorkflows";
import { schedulePostWorkflow } from "../social/workflows/schedule-post.workflow";
import { approvePostWorkflow } from "../social/workflows/approve-post.workflow";
import { requireIdentity } from "../auth/auth";
import { approveSocialPostSchema } from "../../schemas/socialSchemas";

export async function createSocialPost(input: unknown) { return createSocialPostWorkflow(input); }
export async function scheduleSocialPost(input: unknown) { return schedulePostWorkflow(input); }
export async function approveSocialPost(input: unknown) {
  const command = approveSocialPostSchema.parse(input);
  const identity = await requireIdentity();
  return approvePostWorkflow(identity, command);
}
