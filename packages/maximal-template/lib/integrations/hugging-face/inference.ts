import "server-only";

import { inferenceEnv } from "@/lib/env/inference";

import { getHuggingFaceClient } from "./client";

export function generateHuggingFaceText(input: {
  model: string;
  prompt: string;
  maxTokens?: number;
}) {
  return getHuggingFaceClient().textGeneration({
    model: input.model,
    inputs: input.prompt,
    parameters: {
      max_new_tokens: input.maxTokens ?? 512,
      return_full_text: false,
    },
  });
}

export function getConfiguredHuggingFaceModel() {
  return (
    inferenceEnv.value("HUGGINGFACE_TEXT_MODEL") ??
    "HuggingFaceH4/zephyr-7b-beta"
  );
}
