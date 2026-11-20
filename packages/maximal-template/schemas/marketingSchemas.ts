import { z } from "zod";
import { CampaignStatus, AudienceStatus } from "@/generated/prisma/enums";

/** Only explicit UTC instants may cross the persistence boundary. */
const utcInstantSchema = z.iso.datetime();
export const campaignTransitions: Record<CampaignStatus, readonly CampaignStatus[]> = {
  DRAFT: ["SCHEDULED", "ACTIVE", "CANCELED"],
  SCHEDULED: ["DRAFT", "ACTIVE", "CANCELED"],
  ACTIVE: ["PAUSED", "COMPLETED", "CANCELED"],
  PAUSED: ["ACTIVE", "COMPLETED", "CANCELED"],
  COMPLETED: [], CANCELED: [],
};

export const createCampaignSchema = z.object({
  audienceId: z
    .union([z.string().uuid(), z.literal("").transform(() => null)])
    .nullable()
    .optional(),
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000).nullable().optional(),
  scheduledAt: z.preprocess(
    (value) => value === "" ? null : value,
    utcInstantSchema.transform((value) => new Date(value)).nullable().optional(),
  ),
});

export const updateCampaignStatusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum(CampaignStatus),
  expectedVersion: z.number().int().positive(),
});

export const updateCampaignSchema = createCampaignSchema.extend({
  campaignId: z.string().uuid(),
  expectedVersion: z.number().int().positive(),
});

/** The supported editor predicate is structured data, never an executable expression. */
export const audienceDefinitionSchema = z.object({
    operator: z.literal("and"),
    rules: z
      .array(
        z.object({
          field: z.literal("status"),
          operator: z.literal("equals"),
          value: z.enum(["active", "lead", "inactive"]),
        }).strict(),
      )
      .length(1),
  }).strict();
export const audienceFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  status: z.enum(AudienceStatus),
  definition: audienceDefinitionSchema,
});
export const updateAudienceSchema = audienceFormSchema.extend({
  audienceId: z.string().uuid(),
  expectedUpdatedAt: utcInstantSchema.transform((value) => new Date(value)),
  definition: audienceDefinitionSchema.optional(),
});

/** datetime-local values are explicitly labeled UTC by the editor. */
export const campaignEditorSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(10_000),
  audienceId: z.union([z.uuid(), z.literal("")]),
  scheduledAt: z.string().refine((value) => value === "" || /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value) && utcInstantSchema.safeParse(`${value}:00.000Z`).success, "Enter a valid UTC date and time."),
});
const listCriteria = z.object({
  search: z.string().trim().max(200).default(""),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export const campaignListSchema = listCriteria.extend({ status: z.union([z.enum(CampaignStatus), z.literal("ALL")]).default("ALL") });
export const audienceListSchema = listCriteria.extend({ status: z.union([z.enum(AudienceStatus), z.literal("ALL")]).default("ALL") });
/** Include createdAt >= from and createdAt < to, independently of lifecycle dates. */
export const marketingAnalyticsSchema = z.object({ from: utcInstantSchema.optional(), to: utcInstantSchema.optional() }).refine((value) => !value.from || !value.to || new Date(value.from) < new Date(value.to), { path: ["to"], message: "End must follow start." });

/** Calendar inputs are explicitly UTC day boundaries, with an exclusive end date. */
export const marketingAnalyticsQuerySchema = z.object({ from: z.iso.date().optional(), to: z.iso.date().optional() }).refine((value) => !value.from || !value.to || value.from < value.to, { path: ["to"], message: "End must follow start." });

/** Event metadata cannot supply identity, arbitrary audit action syntax, or provider diagnostics. */
export const marketingCampaignEventSchema = z.object({ campaignId: z.uuid(), eventType: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/), idempotencyKey: z.string().trim().min(1).max(200) }).strict();

export { CampaignStatus } from "@/generated/prisma/enums";

/** UI command tokens are validated independently of the trusted tenant identity. */
export const campaignEditorCommandSchema = z.object({ values: campaignEditorSchema, record: z.object({ id: z.uuid(), version: z.number().int().positive() }).nullable() });
export const audienceEditorCommandSchema = z.object({ values: audienceFormSchema, record: z.object({ id: z.uuid(), updatedAt: z.iso.datetime() }).nullable() });

/** A blank lifecycle command stays invalid in the editor and at the action boundary. */
export const campaignLifecycleEditorSchema = updateCampaignStatusSchema.extend({ status: z.union([z.enum(CampaignStatus), z.literal("")]).refine((value) => value !== "", "Choose a permitted lifecycle change.") });
