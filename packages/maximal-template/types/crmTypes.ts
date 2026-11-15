import type {
  CrmContactStatus,
  CrmDealStage as PrismaCrmDealStage,
} from "@/generated/prisma/enums";
import type { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import type {
  contactFormSchema,
  crmAccountFormSchema,
  createCrmDealSchema,
  updateCrmDealStageSchema,
  contactListCriteriaSchema,
  contactSortValues,
} from "@/schemas/crmSchemas";

export type ContactStatus = CrmContactStatus;
export type EditableContactStatus = Exclude<ContactStatus, "ARCHIVED">;

export type ContactSort = (typeof contactSortValues)[number];

export type ContactListCriteria = z.output<typeof contactListCriteriaSchema>;
export type ContactFormValues = z.input<typeof contactFormSchema>;

export type CrmContactDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  status: ContactStatus;
  account: { id: string; name: string } | null;
  owner: { membershipId: string; displayName: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmDealSummaryDTO = {
  id: string;
  name: string;
  stage: PrismaCrmDealStage;
  value: string;
  currency: string;
  probability: number;
  expectedCloseDate: string | null;
  version: number;
  account: { id: string; name: string };
  owner: { id: string; displayName: string | null } | null;
};

export interface CrmDealDTO extends CrmDealSummaryDTO {
  primaryContact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
  } | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CrmAccountDTO = {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  status: string;
  notes: string | null;
  contactCount: number;
  dealCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CrmDealStage = PrismaCrmDealStage;

// -----------------------------------------------------------------------------
// CRM React Hook Form contracts (input and transformed output are distinct).
// -----------------------------------------------------------------------------
export type CrmAccountFormApi = UseFormReturn<
  z.input<typeof crmAccountFormSchema>, unknown, z.output<typeof crmAccountFormSchema>
>;
export type CrmContactFormApi = UseFormReturn<
  z.input<typeof contactFormSchema>, unknown, z.output<typeof contactFormSchema>
>;
export type CrmOpportunityFormApi = UseFormReturn<
  z.input<typeof createCrmDealSchema>, unknown, z.output<typeof createCrmDealSchema>
>;
export type CrmDealStageFormApi = UseFormReturn<
  z.input<typeof updateCrmDealStageSchema>, unknown, z.output<typeof updateCrmDealStageSchema>
>;
