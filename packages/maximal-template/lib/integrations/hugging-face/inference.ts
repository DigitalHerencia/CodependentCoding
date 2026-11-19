import "server-only";
import { huggingFaceEnv } from "@/lib/integrations/hugging-face/env";
import { getHuggingFaceClient } from "./client";
import {
  aiInferenceResultSchema,
  aiProviderTextResponseSchema,
} from "@/schemas/aiSchemas";
import type { AiInferenceResult, AiInferenceInput } from "@/types/aiTypes";

/**
 * Call the installed SDK with server-owned bounds and map only reported measurements.
 * Provider failures are deliberately replaced so diagnostics, prompts and credentials
 * cannot enter action error reporting. No pricing or token estimates are introduced.
 * @see https://huggingface.co/docs/huggingface.js/inference/classes/InferenceClient
 */
export async function generateHuggingFaceText(
  input: AiInferenceInput,
): Promise<AiInferenceResult> {
  try {
    const response = await getHuggingFaceClient().textGeneration(
      {
        model: input.model,
        inputs: input.prompt,
        parameters: {
          max_new_tokens: 512,
          return_full_text: false,
          details: true,
        },
      },
      { signal: AbortSignal.timeout(60_000), retry_on_error: false },
    );
    const parsed = aiProviderTextResponseSchema.parse(response);
    return aiInferenceResultSchema.parse({
      text: parsed.generated_text,
      inputTokens: null,
      outputTokens: parsed.details?.generated_tokens ?? null,
      cost: null,
    });
  } catch {
    throw new Error("AI inference is unavailable.");
  }
}

/** Resolve the existing deployment model; never accept a client-selected model or endpoint. */
export function getConfiguredHuggingFaceModel() {
  return (
    huggingFaceEnv.value("HUGGINGFACE_TEXT_MODEL") ??
    "HuggingFaceH4/zephyr-7b-beta"
  );
}
