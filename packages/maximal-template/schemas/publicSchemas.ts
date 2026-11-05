import { z } from "zod";
export const publicEmailSchema = z.object({ email: z.email().trim() });
export const publicSearchSchema = z.object({
  query: z.string().trim().min(1).max(200),
});
