export interface AdminMembershipDTO {
  id: string;
  role: string;
  status: string;
  user: { id: string; displayName: string | null; email: string | null };
  createdAt: string;
}
export interface AdminRecordSummaryDTO {
  resource: string;
  count: number;
}
export interface AuditEventDTO {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: unknown;
  actor: {
    id: string;
    displayName: string | null;
    email: string | null;
  } | null;
  createdAt: string;
}
