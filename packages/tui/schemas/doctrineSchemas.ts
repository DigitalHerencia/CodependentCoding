// Why: validates the doctrine contract file before the app trusts its rows.
import { z } from "zod";

export const doctrineRuleRowSchema = z.object({
  id: z.string().regex(/^CC-[A-Z]+-\d{3}$/),
  layer: z.string().optional(),
  text: z.string().min(1),
  enforcement: z.string().optional(),
});

export const validationContractSchema = z.object({
  rules: z.array(doctrineRuleRowSchema),
});

export type DoctrineRuleRow = z.infer<typeof doctrineRuleRowSchema>;
