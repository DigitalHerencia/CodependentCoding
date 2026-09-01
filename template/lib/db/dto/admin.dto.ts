import type {
  AdminMembershipDTO,
  AuditEventDTO,
  AuditRisk,
  DisplayAuditEventDTO,
} from "../../../types/adminTypes";
import type {
  AdminMembershipRecord,
  AuditEventRecord,
} from "../selects/admin.selects";

export function toAuditEventDTO(record: AuditEventRecord): AuditEventDTO {
  return {
    id: record.id,
    action: record.action,
    resourceType: record.resourceType,
    resourceId: record.resourceId,
    metadata: record.metadata,
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

function classifyAuditEvent(action: string): AuditRisk {
  const normalized = action.toLowerCase();
  if (/(delete|revoke|role|permission|bulk|export)/.test(normalized)) {
    return "high-risk";
  }
  if (/(update|approve|reject|invite|publish)/.test(normalized)) {
    return "sensitive";
  }
  return "routine";
}

export function toDisplayAuditEventDTO(
  event: AuditEventDTO,
): DisplayAuditEventDTO {
  return {
    id: event.id,
    action: event.action,
    resource: `${event.resourceType}${event.resourceId ? ` · ${event.resourceId}` : ""}`,
    timestamp: new Date(event.createdAt).toLocaleString(),
    risk: classifyAuditEvent(event.action),
  };
}

export function toAdminMembershipDTO(
  record: AdminMembershipRecord,
): AdminMembershipDTO {
  return {
    id: record.id,
    role: record.role,
    status: record.status,
    user: record.user,
    createdAt: record.createdAt.toISOString(),
  };
}
