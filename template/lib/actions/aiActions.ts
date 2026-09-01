"use server";

import {
  createAiGenerationRecordWorkflow,
} from "../ai/workflows/aiWorkflows";
import { recordGenerationUsageWorkflow } from "../ai/workflows/record-generation-usage.workflow";

export async function createAiGenerationRecord(rawInput: unknown) {
  return createAiGenerationRecordWorkflow(rawInput);
}

export async function completeAiGenerationRecord(rawInput: unknown) {
  return recordGenerationUsageWorkflow(rawInput);
}
