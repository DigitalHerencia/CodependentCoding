import { z } from "zod";

export const organizationIdSchema = z.uuid();
export const tenancies = ["multi", "single"] as const;
export const tenancySchema = z.enum(tenancies);
