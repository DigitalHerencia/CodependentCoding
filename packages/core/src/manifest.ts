import { z } from 'zod';
import {
  applicationDefinitionSchema,
  normalizedRecipeSchema,
  productPresetSchema,
} from '@hipster-stack/schema';
import { generatedModuleIds } from './ownership.js';
import { LoadedVibesError } from './errors.js';

export const generationManifestSchema = z
  .object({
    schemaVersion: z.literal(2),
    generator: z
      .object({ name: z.literal('hipster-stack'), version: z.string() })
      .strict(),
    template: z
      .object({
        id: z.string(),
        version: z.string(),
        composition: z
          .literal('copy-one-template-retain-remove-transform')
          .default('copy-one-template-retain-remove-transform'),
      })
      .strict(),
    preset: productPresetSchema,
    modules: z.array(z.enum(generatedModuleIds)),
    excludedOwnedPaths: z.array(z.string()).default([]),
    applicationDefinition: applicationDefinitionSchema.optional(),
    recipe: normalizedRecipeSchema,
  })
  .strict();

export type GenerationManifest = z.infer<typeof generationManifestSchema>;

export function parseGenerationManifest(value: unknown): GenerationManifest {
  const result = generationManifestSchema.safeParse(value);
  if (!result.success) {
    throw new LoadedVibesError(
      'PROJECT_NOT_GENERATED',
      'The Hipster Stack manifest is missing or invalid.',
      result.error,
    );
  }
  return result.data;
}
