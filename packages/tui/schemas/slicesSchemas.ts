// Why: validates the slice form before anything is planned or written.
import { z } from "zod";

export const sliceRequestSchema = z.object({
  appDir: z.string().trim().min(1, "Enter the folder of a generated app."),
  entity: z
    .string()
    .trim()
    .regex(/^[a-z][A-Za-z0-9]*$/, "Entity: singular camelCase, like invoice."),
  moduleId: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9]*$/, "Module: lowercase letters and digits."),
  fields: z
    .string()
    .trim()
    .min(1, 'Fields: like "number:string, amount:decimal?".'),
});
