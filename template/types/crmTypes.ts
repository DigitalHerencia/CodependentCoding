export type ContactStatus = "LEAD" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type EditableContactStatus = Exclude<ContactStatus, "ARCHIVED">;

export type ContactSort = "name-asc" | "name-desc" | "updated-desc";

export interface ContactListCriteria {
  query: string;
  status?: EditableContactStatus;
  sort: ContactSort;
  limit: number;
}

export interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  status: EditableContactStatus;
}

export interface CrmContactDTO {
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
}

export interface CrmDealSummaryDTO {
  id: string;
  name: string;
  stage: string;
  value: string;
  currency: string;
  probability: number;
  expectedCloseDate: string | null;
  version: number;
  account: { id: string; name: string };
  owner: { id: string; displayName: string | null } | null;
}

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

export interface CrmAccountDTO {
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
}
