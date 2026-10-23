import "server-only";

import { InferenceClient } from "@huggingface/inference";

import { inferenceEnv } from "@/lib/env/inference";

let client: InferenceClient | undefined;

export function isHuggingFaceConfigured() {
  return inferenceEnv.configured();
}

export function getHuggingFaceClient() {
  client ??= new InferenceClient(inferenceEnv.read().HUGGINGFACE_ACCESS_TOKEN);
  return client;
}
