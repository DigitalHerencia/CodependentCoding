// Why: validates the new-app choices before anything is written.
import { z } from "zod";

export const newAppRequestSchema = z.object({
  appDir: z.string().trim().min(1, "Enter a folder for the new app."),
  preset: z.string().min(1, "Pick a preset."),
  tenancy: z.enum(["multi", "single"]),
  accessControl: z.enum(["abac", "rbac"]),
  color: z
    .string()
    .trim()
    .regex(
      /^(#[0-9a-fA-F]{6})?$/,
      "Color: a 6-digit hex like #2f7a8d, or empty.",
    ),
});
