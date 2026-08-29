import {
  AuditLogBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getAuditEvents } from "@/lib/fetchers/adminFetchers";
import { classifyAuditEvent } from "@/lib/workflows/admin/classifyAuditEvent";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function AuditFeature() {
  const events = await getAuditEvents();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Administration"
        title="Audit trail"
        description="Uncached tenant-scoped administrative activity."
      />
      <AuditLogBlock
        events={events.map((event) => ({
          id: event.id,
          action: `${event.action} · ${classifyAuditEvent(event.action)}`,
          resource: `${event.resourceType}${event.resourceId ? ` · ${event.resourceId}` : ""}`,
          timestamp: new Date(event.createdAt).toLocaleString(),
        }))}
      />
    </div>
  );
}
