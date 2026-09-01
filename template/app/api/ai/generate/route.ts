import { NextResponse } from "next/server";
import { z } from "zod";

import { requireIdentity } from "@/lib/auth/auth";
import { executeGenerationWorkflow } from "@/lib/ai/workflows/execute-generation.workflow";

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(100_000),
});

export async function POST(request: Request) {
  try {
    const { prompt } = requestSchema.parse(await request.json());
    const identity = await requireIdentity();
    return NextResponse.json(
      await executeGenerationWorkflow(identity, { prompt }),
    );
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "AI generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
