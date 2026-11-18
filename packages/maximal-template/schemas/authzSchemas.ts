/** Validation contracts for application organization access and tenancy. */
import { z } from "zod";
import { tenancies } from "@/lib/constants/authzConstants";

/** Validate an application-owned organization identifier. */
export const organizationIdSchema = z.uuid();
/** Validate the configured application tenancy mode. */
export const tenancySchema = z.enum(tenancies);

/** Accept only the target organization identifier for a switch command. */
export const switchOrganizationSchema = z
  .object({ organizationId: z.uuid() })
  .strict();
