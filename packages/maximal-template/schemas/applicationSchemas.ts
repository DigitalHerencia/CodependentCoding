import { z } from "zod";
export const applicationEmailSchema = z.object({ email: z.email().trim() });
export const applicationSearchSchema = z.object({
  query: z.string().trim().min(1).max(200),
});
