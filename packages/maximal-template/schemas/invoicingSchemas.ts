import { z } from "zod";
import { InvoiceStatus, ExpenseStatus } from "@/generated/prisma/enums";
import { calculateInvoiceTotals } from "@/lib/utils/invoicingMoney";

const currency = z
  .string()
  .regex(/^[A-Za-z]{3}$/)
  .transform((value) => value.toUpperCase());
const money = z
  .string()
  .regex(
    /^\d{1,15}(\.\d{1,4})?$/,
    "Expected a non-negative decimal with at most four places.",
  );
/** Calendar days are parsed at UTC midnight; offset-bearing timestamps are rejected. */
export const invoicingDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Expected a valid calendar date.");
const date = invoicingDateSchema;
const optionalDate = z.preprocess(
  (value) => (value === "" ? null : value),
  date.nullable().optional(),
);
export const createInvoiceSchema = z
  .object({
    customerName: z.string().trim().min(1).max(200),
    customerEmail: z
      .union([z.string().email().max(320), z.literal("").transform(() => null)])
      .nullable()
      .optional(),
    currency: currency.default("USD"),
    issuedAt: optionalDate,
    dueAt: optionalDate,
    lines: z
      .array(
        z.object({
          description: z.string().trim().min(1).max(500),
          quantity: z
            .string()
            .regex(/^\d{1,9}(\.\d{1,3})?$/)
            .refine(
              (value) => /[1-9]/.test(value),
              "Quantity must be positive.",
            ),
          unitPrice: money,
          taxRate: z
            .string()
            .regex(/^(0(\.\d{1,6})?|1(\.0{1,6})?)$/)
            .default("0"),
        }),
      )
      .min(1)
      .max(500),
  })
  .superRefine((value, context) => {
    try {
      calculateInvoiceTotals(value.lines);
    } catch {
      context.addIssue({
        code: "custom",
        path: ["lines"],
        message: "Invoice amounts exceed supported precision.",
      });
    }
  });
export const updateInvoiceSchema = createInvoiceSchema.safeExtend({
  invoiceId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});
export const invoiceCommandSchema = z.object({
  invoiceId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});
/** Compatibility terminal-command validation; execution is disabled pending owner policy. */
export const updateInvoiceStatusSchema = invoiceCommandSchema.extend({
  status: z.enum(["PAID", "VOID"]),
});
export const expenseFormSchema = z.object({
  vendor: z.string().trim().min(1).max(200),
  description: z.string().max(10000),
  amount: money.refine(
    (value) => /[1-9]/.test(value),
    "Amount must be positive.",
  ),
  currency,
  incurredAt: date,
});
export const updateExpenseSchema = expenseFormSchema.extend({
  expenseId: z.string().uuid(),
  expectedUpdatedAt: z.coerce.date(),
});
const listQuery = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().trim().max(200).default(""),
  currency: z.union([currency, z.literal("")]).default(""),
  sort: z
    .enum(["created-desc", "created-asc", "amount-desc", "amount-asc"])
    .default("created-desc"),
  from: z.union([invoicingDateSchema, z.literal("")]).default(""),
  to: z.union([invoicingDateSchema, z.literal("")]).default(""),
});
export const invoiceListQuerySchema = listQuery
  .extend({
    status: z.union([z.enum(InvoiceStatus), z.literal("")]).default(""),
  })
  .refine(
    (value) => !value.from || !value.to || value.from <= value.to,
    "Date range is invalid.",
  );
export const expenseListQuerySchema = listQuery
  .extend({
    status: z.union([z.enum(ExpenseStatus), z.literal("")]).default(""),
  })
  .refine(
    (value) => !value.from || !value.to || value.from <= value.to,
    "Date range is invalid.",
  );
