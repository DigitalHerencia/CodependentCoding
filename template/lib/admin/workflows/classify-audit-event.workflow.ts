import { getAuditEvents } from "../../fetchers/adminFetchers";
import { classifyAuditEvent } from "../../admin/logic/classify-audit-event.logic";
export async function classifyAuditEventWorkflow(limit = 100) {
  const events = await getAuditEvents(limit);
  return events.map((event) => ({
    ...event,
    risk: classifyAuditEvent(event.action),
  }));
}
