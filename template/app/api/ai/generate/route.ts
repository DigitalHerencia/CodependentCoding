import { NextResponse } from "next/server";

import { executeGenerationFeature } from "@/features/ai/generationFeature";
import { aiGenerationRequestSchema } from "@/schemas/aiSchemas";

export async function POST(request: Request) {
  try {
    const { prompt } = aiGenerationRequestSchema.parse(await request.json());
    return NextResponse.json(await executeGenerationFeature({ prompt }));
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "AI generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
