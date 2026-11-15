import { z } from "zod";
import { CrmAccountStatus, CrmContactStatus, CrmDealStage } from "@/generated/prisma/enums";

const uuid = z.string().uuid();
const currency = z
  .string()
  .length(3)
  .transform((value) => value.toUpperCase());
const money = z
  .string()
  .regex(/^\d+(\.\d{1,4})?$/, "Expected a non-negative decimal.");

// -----------------------------------------------------------------------------
// Contact and lead contracts
// -----------------------------------------------------------------------------

/** Validate untrusted CRM input at server and form boundaries. */
export const contactStatusSchema = z
  .enum(CrmContactStatus)
  .exclude(["ARCHIVED"]);
/** Validate untrusted CRM input at server and form boundaries. */
export const contactIdSchema = uuid;
/** Validate untrusted CRM input at server and form boundaries. */
export const dealIdSchema = uuid;
/** Validate untrusted CRM input at server and form boundaries. */
export const contactSortValues = [
  "name-asc",
  "name-desc",
  "updated-desc",
] as const;

/** Validate untrusted CRM input at server and form boundaries. */
export const contactListCriteriaSchema = z.object({
  query: z.string().trim().max(100).default(""),
  status: contactStatusSchema.optional(),
  sort: z.enum(contactSortValues).default("name-asc"),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});

/** Validate untrusted CRM input at server and form boundaries. */
export const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(100),
  lastName: z.string().trim().min(1, "Last name is required.").max(100),
  email: z.union([z.literal(""), z.string().trim().email()]),
  phone: z.string().trim().max(50),
  title: z.string().trim().max(150),
  status: contactStatusSchema,
});

/** Validate untrusted CRM input at server and form boundaries. */
export const createContactSchema = contactFormSchema;

/** Validate untrusted CRM input at server and form boundaries. */
export const updateContactSchema = contactFormSchema.extend({
  contactId: uuid,
  expectedUpdatedAt: z.coerce.date(),
});

/** Validate untrusted CRM input at server and form boundaries. */
export const archiveContactSchema = z.object({
  contactId: uuid,
  expectedUpdatedAt: z.coerce.date(),
});

// -----------------------------------------------------------------------------
// Opportunity contracts
// -----------------------------------------------------------------------------

/** Validate untrusted CRM input at server and form boundaries. */
export const createCrmDealSchema = z.object({
  accountId: uuid,
  primaryContactId: uuid.nullable().optional(),
  ownerMembershipId: uuid.nullable().optional(),
  name: z.string().trim().min(1).max(200),
  value: money.default("0"),
  currency: currency.default("USD"),
  probability: z.number().int().min(0).max(100).default(0),
  expectedCloseDate: z.preprocess(
    (value) => (value === "" ? null : value),
    z.coerce.date().nullable().optional(),
  ),
});

/** Validate untrusted CRM input at server and form boundaries. */
export const updateCrmDealStageSchema = z.object({
  dealId: dealIdSchema,
  stage: z.enum(CrmDealStage),
  expectedVersion: z.number().int().positive(),
});

// -----------------------------------------------------------------------------
// Account contracts
// -----------------------------------------------------------------------------

/** Validate untrusted CRM input at server and form boundaries. */
export const crmAccountFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  website: z.union([
    z.literal(""),
    z
      .string()
      .url()
      .regex(/^https?:\/\//),
  ]),
  industry: z.string().trim().max(200),
  notes: z.string().max(20000),
});
/** Validate untrusted CRM input at server and form boundaries. */
export const updateCrmAccountSchema = crmAccountFormSchema.extend({
  accountId: uuid,
  expectedUpdatedAt: z.coerce.date(),
});

export { CrmDealStage } from "@/generated/prisma/enums";

// -----------------------------------------------------------------------------
// CRM-specific persisted-read contracts: URL input stays untrusted.
// -----------------------------------------------------------------------------
/** Validated, bounded, stable URL pagination used by CRM tenant pages. */
export const crmPageQuerySchema = z.object({
  q: z.string().trim().max(100).catch(""),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
  pageSize: z.coerce.number().int().min(1).max(100).catch(25),
});

/** Account directory search, sort, status, and pagination. */
export const crmAccountQuerySchema = crmPageQuerySchema.extend({
  sort: z.enum(["name-asc", "name-desc", "updated-desc"]).catch("name-asc"),
  status: z.enum(CrmAccountStatus).exclude(["ARCHIVED"]).optional().catch(undefined),
});

/** Contact and lead directory search, sort, status, and pagination. */
export const crmContactQuerySchema = crmPageQuerySchema.extend({
  sort: z.enum(contactSortValues).catch("name-asc"),
  status: contactStatusSchema.optional().catch(undefined),
});

/** Opportunity pipeline search, sort, stage filter, and pagination. */
export const crmDealQuerySchema = crmPageQuerySchema.extend({
  sort: z.enum(["stage-asc", "updated-desc", "value-desc"]).catch("stage-asc"),
  stage: z.enum(CrmDealStage).optional().catch(undefined),
});

/** CRM-local identifier, bounded limit and date-range read validation. */
export const crmRecordIdSchema = uuid;
/** Validate untrusted CRM input at server and form boundaries. */
export const crmReadLimitSchema = z.coerce.number().int().min(1).max(200);
/** Validate untrusted CRM input at server and form boundaries. */
export const crmPeriodSchema = z.object({
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
}).refine((dates) => dates.periodStart <= dates.periodEnd, {
  message: "The date range ends before it starts.",
});
