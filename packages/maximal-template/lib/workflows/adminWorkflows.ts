import { getAdminSessionState } from "@/lib/auth/auth";
import {
  canAccessAdmin,
  getAdminMembership,
  getAdminMemberships,
  getAdminRecordSummary,
  getAuditEvents,
} from "@/lib/fetchers/adminFetchers";
import { notFound, redirect } from "next/navigation";
import "server-only";

export async function getAdminWorkspaceWorkflow() {
  const [auditEvents, memberships, records] = await Promise.all([
    getAuditEvents(),
    getAdminMemberships(),
    getAdminRecordSummary(),
  ]);
  return { auditEvents, memberships, records };
}

export async function loadAdminAuditWorkflow({
  criteria,
}: {
  criteria: unknown;
}) {
  const page = await getAuditEvents(criteria);
  return { page };
}

export async function loadAdminRecordDetailWorkflow({
  recordId,
}: {
  recordId: string;
}) {
  const record = (await getAdminRecordSummary()).find(
    (item) => item.resource === recordId,
  );
  if (!record) notFound();
  return { record };
}

export async function loadAdminRecordsWorkflow() {
  const records = await getAdminRecordSummary();
  return { records };
}

export async function loadAdminUserDetailWorkflow({
  userId,
}: {
  userId: string;
}) {
  const membership = await getAdminMembership(userId);
  if (!membership) notFound();
  return { membership };
}

export async function loadAdminUsersWorkflow({
  criteria,
}: {
  criteria: unknown;
}) {
  const page = await getAdminMemberships(criteria);
  return { page };
}

export async function guardAdminWorkflow() {
  if (!(await canAccessAdmin())) notFound();
  return getAdminSessionState();
}
export async function loadAdminVerificationWorkflow() {
  const state = await guardAdminWorkflow();
  if (state === "verified") redirect("/admin/users");
  return state;
}
