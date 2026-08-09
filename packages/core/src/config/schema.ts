import { z } from 'zod';
import { recipeSchema } from '@loaded-vibes/schema';

export const loadedVibesConfigSchema = z
  .object({
    recipe: recipeSchema,
    targetDirectory: z.string().min(1),
    git: z
      .object({ initialize: z.boolean() })
      .strict()
      .default({ initialize: true }),
    install: z
      .object({ enabled: z.boolean() })
      .strict()
      .default({ enabled: true }),
  })
  .strict();

export type LoadedVibesConfig = z.infer<typeof loadedVibesConfigSchema>;
