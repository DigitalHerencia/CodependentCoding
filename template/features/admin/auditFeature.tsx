import {
  AuditLogBlock,
  PageHeaderBlock,
} from "@/components/blocks/application-sections";
import { getDisplayAuditEvents } from "@/lib/fetchers/adminFetchers";

// Features orchestrate blocks and lib helpers; they never import raw UI primitives.
export async function AuditFeature() {
  const events = await getDisplayAuditEvents();
  return (
    <div className="space-y-6">
      <PageHeaderBlock
        eyebrow="Administration"
        title="Audit trail"
        description="Uncached tenant-scoped administrative activity."
      />
      <AuditLogBlock
        events={events}
      />
    </div>
  );
}
