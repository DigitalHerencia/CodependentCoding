// Why: Schemas: one Zod contract per write, shared by client forms and server actions.
import { z } from "zod";
{{enumImport}}
const {{entity}}Fields = z.object({
{{zodFields}}
});

export const create{{Entity}}Schema = {{entity}}Fields;

export const update{{Entity}}Schema = {{entity}}Fields.extend({
  {{param}}: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});
