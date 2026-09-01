import { z } from "zod";
import { InvoiceStatus } from "@/generated/prisma/enums";

const currency = z
  .string()
  .length(3)
  .transform((value) => value.toUpperCase());
const money = z
  .string()
  .regex(/^\d+(\.\d{1,4})?$/, "Expected a non-negative decimal.");
const taxRate = z
  .string()
  .regex(/^0(\.\d{1,6})?$|^1(\.0{1,6})?$/, "Expected a rate from 0 to 1.");

export const createInvoiceSchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerEmail: z.string().email().nullable().optional(),
  currency: currency.default("USD"),
  issuedAt: z.coerce.date().nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
  lines: z
    .array(
      z.object({
        description: z.string().trim().min(1).max(500),
        quantity: z.string().regex(/^\d+(\.\d{1,3})?$/),
        unitPrice: money,
        taxRate: taxRate.default("0"),
      }),
    )
    .min(1)
    .max(500),
});

export const updateInvoiceStatusSchema = z.object({
  invoiceId: z.string().uuid(),
  status: z.enum(InvoiceStatus),
  expectedVersion: z.number().int().positive(),
});
