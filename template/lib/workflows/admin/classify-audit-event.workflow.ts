import { getAuditEvents } from "@/lib/fetchers/adminFetchers";
import type { AuditRisk } from "@/types/adminTypes";

const classifyAuditEvent = (action: string): AuditRisk => {
  const normalized = action.toLowerCase();
  if (/(delete|revoke|role|permission|bulk|export)/.test(normalized))
    return "high-risk";
  if (/(update|approve|reject|invite|publish)/.test(normalized))
    return "sensitive";
  return "routine";
};

export async function classifyAuditEventWorkflow(limit = 100) {
  const events = await getAuditEvents(limit);
  return events.map((event: (typeof events)[number]) => ({
    ...event,
    risk: classifyAuditEvent(event.action),
  }));
}
