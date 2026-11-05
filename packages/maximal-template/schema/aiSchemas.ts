import { z } from "zod";

export const aiGenerationRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(100_000),
});
