import type {
  CrmContactStatus,
  CrmDealStage as PrismaCrmDealStage,
} from "@/generated/prisma/enums";
import type { z } from "zod";
import type {
  contactFormSchema,
  contactListCriteriaSchema,
  contactSortValues,
} from "@/schema/crmSchemas";

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
