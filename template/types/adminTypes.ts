import type { MembershipStatus } from "@/generated/prisma/enums";
import type { z } from "zod";
import type {
  changeAdminMembershipSchema,
  updateAdminMembershipStatusSchema,
  adminBulkOperationSchema,
} from "@/schema/adminSchemas";
import type { AppRole } from "./accessTypes";

export type AdminMembershipDTO = {
  id: string;
  role: AppRole;
  status: MembershipStatus;
  user: { id: string; displayName: string | null; email: string | null };
  createdAt: string;
};
export type AdminRecordSummaryDTO = {
  resource: string;
  count: number;
};
export type AuditEventDTO = {
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
};
export type AuditRisk = "routine" | "sensitive" | "high-risk";

export type DisplayAuditEventDTO = {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  risk: AuditRisk;
};

export type AdminRole = AppRole;

export type ChangeAdminMembershipCommand = z.input<
  typeof changeAdminMembershipSchema
>;

export type UpdateAdminMembershipStatusCommand = z.input<
  typeof updateAdminMembershipStatusSchema
>;

export type AdminBulkOperation = z.input<typeof adminBulkOperationSchema>;
