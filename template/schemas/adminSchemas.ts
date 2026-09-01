import { z } from "zod";

export const adminRoleSchema = z.enum([
  "OWNER",
  "ADMIN",
  "MANAGER",
  "MEMBER",
  "BILLING",
  "SUPPORT",
  "CLIENT",
  "VIEWER",
]);

export const changeAdminMembershipSchema = z.object({
  membershipId: z.string().uuid(),
  role: adminRoleSchema,
});

export const updateAdminMembershipStatusSchema = z.object({
  membershipId: z.string().uuid(),
});

export const reconcileAdminProviderStateSchema = z.object({
  provider: z.string().trim().min(1).max(100),
  providerCustomerId: z.string().trim().min(1).max(255).nullable().optional(),
  providerSubscriptionId: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .nullable()
    .optional(),
  planKey: z.string().trim().min(1).max(100),
  status: z.enum(["TRIALING", "ACTIVE", "PAST_DUE", "PAUSED", "CANCELED"]),
  currentPeriodEnd: z.coerce.date().nullable().optional(),
  cancelAtPeriodEnd: z.boolean(),
});
