// Why: validates the template's module manifest before the app trusts it.
import { z } from "zod";

export const manifestModuleSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["domain", "addon"]),
  label: z.string().min(1),
  description: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
  packages: z.array(z.string()).optional(),
  env: z.array(z.object({ name: z.string() })).optional(),
});

export const moduleManifestSchema = z.object({
  modules: z.array(manifestModuleSchema),
  presets: z.record(z.string(), z.array(z.string())),
});

export type ManifestModule = z.infer<typeof manifestModuleSchema>;
