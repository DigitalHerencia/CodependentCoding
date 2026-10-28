// Why: the terminal app's environment, validated once at startup.
import { z } from "zod";

export const tuiEnv = z
  .object({ CODEPENDENT_ROOT: z.string().min(1).optional() })
  .parse(process.env);
