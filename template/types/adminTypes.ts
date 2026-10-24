import type { AppRole } from "./accessTypes";

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
export type AuditRisk = "routine" | "sensitive" | "high-risk";

export interface DisplayAuditEventDTO {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  risk: AuditRisk;
}

export type AdminRole = AppRole;

export interface ChangeAdminMembershipCommand {
  membershipId: string;
  role: AdminRole;
}

export interface UpdateAdminMembershipStatusCommand {
  membershipId: string;
}

export type AdminBulkOperation =
  | { kind: "suspend"; membershipId: string }
  | { kind: "restore"; membershipId: string }
  | {
      kind: "change-role";
      membershipId: string;
      role: AdminRole;
    };
