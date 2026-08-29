export type ResourceKind =
  | "organization"
  | "crm"
  | "project"
  | "task"
  | "support-ticket"
  | "campaign"
  | "invoice"
  | "social-post"
  | "ai-generation"
  | "portal-document"
  | "audit-event";

export interface ResourceAccessDescriptor {
  kind: ResourceKind;
  organizationId: string;
  ownerMembershipId?: string | null;
  assigneeMembershipId?: string | null;
  clientVisible?: boolean;
}
