import {
  AuditLogBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getAuditEvents } from "@/lib/fetchers/adminFetchers";
import type { AuditRisk } from "@/types/adminTypes";

function classifyAuditRisk(action: string): AuditRisk {
  const normalized = action.toLowerCase();
  if (/(delete|revoke|role|permission|bulk|export)/.test(normalized)) {
    return "high-risk";
  }
  if (/(update|approve|reject|invite|publish)/.test(normalized)) {
    return "sensitive";
  }
  return "routine";
}

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function AuditFeature() {
  const auditEvents = await getAuditEvents();
  const events = auditEvents.map((event) => ({
    id: event.id,
    action: event.action,
    resource: `${event.resourceType}${event.resourceId ? ` · ${event.resourceId}` : ""}`,
    timestamp: new Date(event.createdAt).toLocaleString(),
    risk: classifyAuditRisk(event.action),
  }));
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Administration"
        title="Audit trail"
        description="Uncached tenant-scoped administrative activity."
      />
      <AuditLogBlock events={events} />
    </div>
  );
}
