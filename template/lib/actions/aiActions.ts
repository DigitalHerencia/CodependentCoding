"use server";

import {
  completeAiGenerationRecordWorkflow,
  createAiGenerationRecordWorkflow,
} from "../ai/workflows/aiWorkflows";

export async function createAiGenerationRecord(rawInput: unknown) {
  return createAiGenerationRecordWorkflow(rawInput);
}

export async function completeAiGenerationRecord(rawInput: unknown) {
  return completeAiGenerationRecordWorkflow(rawInput);
}
