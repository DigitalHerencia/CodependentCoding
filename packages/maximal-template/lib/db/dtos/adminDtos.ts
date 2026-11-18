/** Admin DTO mapping; persistence records never cross directly into presentation. */
import "server-only";

import type {
  AdminMembershipDTO,
  AuditEventDTO,
  AdminMembershipRecord,
  AuditEventRecord,
} from "@/types/adminTypes";

/** Convert persisted audit data into a serializable authorized projection. */
export function toAuditEventDTO(record: AuditEventRecord): AuditEventDTO {
  return {
    id: record.id,
    action: record.action,
    resourceType: record.resourceType,
    resourceId: record.resourceId,
    actor: record.actor
      ? {
          id: record.actor.id,
          displayName: record.actor.displayName,
          email: record.actor.email,
        }
      : null,
    createdAt: record.createdAt.toISOString(),
  };
}

/** Project a membership and actor-specific editability without exposing the actor ID. */
export function toAdminMembershipDTO(
  record: AdminMembershipRecord,
  actorUserId: string,
): AdminMembershipDTO {
  return {
    id: record.id,
    role: record.role,
    organizationId: record.organizationId,
    deniedPermissions: record.deniedPermissions,
    canManage: record.role !== "OWNER" && record.user.id !== actorUserId,
    status: record.status,
    user: record.user,
    createdAt: record.createdAt.toISOString(),
  };
}
