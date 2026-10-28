// Why: validates settings.json on read and the folder a person adds.
import { z } from "zod";

export const tuiSettingsSchema = z.object({
  apps: z.array(z.string().min(1)).default([]),
});

export const appFolderSchema = z.object({
  dir: z.string().trim().min(1, "Enter the folder of an app."),
});
