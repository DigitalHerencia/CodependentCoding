"use server";

import { createSocialPostWorkflow, scheduleSocialPostWorkflow } from "../social/workflows/socialWorkflows";

export async function createSocialPost(input: unknown) { return createSocialPostWorkflow(input); }
export async function scheduleSocialPost(input: unknown) { return scheduleSocialPostWorkflow(input); }
