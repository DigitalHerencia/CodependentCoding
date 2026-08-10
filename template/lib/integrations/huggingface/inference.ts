import "server-only"

import { getOptionalEnv, getRequiredEnv } from "@/lib/env"
import type { InferenceResult } from "@/types/capabilityTypes"

export async function runHuggingFaceInference(prompt: string): Promise<InferenceResult> {
  const model = getOptionalEnv("HUGGINGFACE_MODEL") ?? "openai/gpt-oss-120b"
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${getRequiredEnv("HUGGINGFACE_TOKEN")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    signal: AbortSignal.timeout(60_000),
  })
  const value: unknown = await response.json()
  const content = (value as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]
    ?.message?.content
  if (!response.ok || typeof content !== "string")
    throw new Error("Inference provider request failed.")
  return { model, text: content }
}
