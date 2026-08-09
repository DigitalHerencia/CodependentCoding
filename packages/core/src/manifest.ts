import { z } from 'zod';
import {
  normalizedRecipeSchema,
  productPresetSchema,
} from '@loaded-vibes/schema';
import { generatedModuleIds } from './modules.js';
import { LoadedVibesError } from './errors.js';

export const generationManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    generator: z
      .object({ name: z.literal('create-loaded-vibes'), version: z.string() })
      .strict(),
    template: z
      .object({ revision: z.string(), sourceRevision: z.string() })
      .strict(),
    preset: productPresetSchema,
    modules: z.array(z.enum(generatedModuleIds)),
    recipe: normalizedRecipeSchema,
  })
  .strict();

export type GenerationManifest = z.infer<typeof generationManifestSchema>;

export function parseGenerationManifest(value: unknown): GenerationManifest {
  const result = generationManifestSchema.safeParse(value);
  if (!result.success) {
    throw new LoadedVibesError(
      'PROJECT_NOT_GENERATED',
      'The Loaded Vibes manifest is missing or invalid.',
      result.error,
    );
  }
  return result.data;
}
