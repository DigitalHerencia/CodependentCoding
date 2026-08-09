import { z } from 'zod';

export const loadedVibesConfigSchema = z
  .object({
    schemaVersion: z.literal(1).default(1),
    projectName: z.string().min(1),
    targetDirectory: z.string().min(1),
    preset: z.literal('standard').default('standard'),
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
