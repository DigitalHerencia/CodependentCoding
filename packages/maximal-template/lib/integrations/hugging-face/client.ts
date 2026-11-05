import "server-only";

import { InferenceClient } from "@huggingface/inference";

import { huggingFaceEnv } from "@/lib/integrations/hugging-face/env";

let client: InferenceClient | undefined;

export function isHuggingFaceConfigured() {
  return huggingFaceEnv.configured();
}

export function getHuggingFaceClient() {
  client ??= new InferenceClient(
    huggingFaceEnv.read().HUGGINGFACE_ACCESS_TOKEN,
  );
  return client;
}
