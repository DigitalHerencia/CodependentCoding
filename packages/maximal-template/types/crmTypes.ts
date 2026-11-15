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

/** Declare a CRM-specific TypeScript data or form contract. */
export type ContactStatus = CrmContactStatus;
/** Declare a CRM-specific TypeScript data or form contract. */
export type EditableContactStatus = Exclude<ContactStatus, "ARCHIVED">;

/** Declare a CRM-specific TypeScript data or form contract. */
export type ContactSort = (typeof contactSortValues)[number];

/** Declare a CRM-specific TypeScript data or form contract. */
export type ContactListCriteria = z.output<typeof contactListCriteriaSchema>;
/** Declare a CRM-specific TypeScript data or form contract. */
export type ContactFormValues = z.input<typeof contactFormSchema>;

/** Declare a CRM-specific TypeScript data or form contract. */
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

/** Declare a CRM-specific TypeScript data or form contract. */
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

/** Declare a CRM-specific TypeScript data or form contract. */
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

/** Declare a CRM-specific TypeScript data or form contract. */
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

/** Declare a CRM-specific TypeScript data or form contract. */
export type CrmDealStage = PrismaCrmDealStage;

// -----------------------------------------------------------------------------
// CRM React Hook Form contracts (input and transformed output are distinct).
// -----------------------------------------------------------------------------
/** Declare a CRM-specific TypeScript data or form contract. */
export type CrmAccountFormApi = UseFormReturn<
  z.input<typeof crmAccountFormSchema>, unknown, z.output<typeof crmAccountFormSchema>
>;
/** Declare a CRM-specific TypeScript data or form contract. */
export type CrmContactFormApi = UseFormReturn<
  z.input<typeof contactFormSchema>, unknown, z.output<typeof contactFormSchema>
>;
/** Declare a CRM-specific TypeScript data or form contract. */
export type CrmOpportunityFormApi = UseFormReturn<
  z.input<typeof createCrmDealSchema>, unknown, z.output<typeof createCrmDealSchema>
>;
/** Declare a CRM-specific TypeScript data or form contract. */
export type CrmDealStageFormApi = UseFormReturn<
  z.input<typeof updateCrmDealStageSchema>, unknown, z.output<typeof updateCrmDealStageSchema>
>;

// -----------------------------------------------------------------------------
// CRM route pagination and persisted filter results.
// -----------------------------------------------------------------------------
/** Stable page metadata, independent of any particular CRM entity. */
export type CrmPageInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

/** A tenant-scoped page of CRM DTOs, never raw Prisma objects. */
export type CrmPage<T> = {
  items: T[];
  pageInfo: CrmPageInfo;
};


// -----------------------------------------------------------------------------
// CRM ShadCN field bindings (runtime RHF stays in CRM form features).
// -----------------------------------------------------------------------------
/** Presentation-safe structural binding from a React Hook Form Controller. */
export type CrmFieldBinding = {
  name: string;
  value: unknown;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
  ref: (...instance: unknown[]) => void;
};
