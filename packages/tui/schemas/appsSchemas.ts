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

/** The parts of an app's hipster.json the apps screen shows. */
export const hipsterJsonSchema = z.object({
  template: z.object({ commit: z.string().nullable() }).partial().optional(),
  cli: z.string().optional(),
  createdAt: z.string().optional(),
  modules: z.array(z.string()).default([]),
  color: z.string().nullable().optional(),
  tenancy: z.string().optional(),
  accessControl: z.string().optional(),
});

export type HipsterJson = z.infer<typeof hipsterJsonSchema>;
