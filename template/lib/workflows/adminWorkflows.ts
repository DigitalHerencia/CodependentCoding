import "server-only";

import {
  getAdminMemberships,
  getAdminRecordSummary,
  getAuditEvents,
} from "@/lib/fetchers/adminFetchers";

export async function getAdminWorkspaceWorkflow() {
  const [auditEvents, memberships, records] = await Promise.all([
    getAuditEvents(),
    getAdminMemberships(),
    getAdminRecordSummary(),
  ]);
  return { auditEvents, memberships, records };
}
