// Why: Templates: pure presentation for the admin pages, laid out from DTOs; data and slots come from features.
import type { ReactNode } from "react";
import type {
  AuditEventDTO,
  AdminRecordSummaryDTO,
  AdminMembershipDTO,
} from "@/types/adminTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
import Link from "next/link";

export function AdminAuditTemplate({
  events,
  toolbar,
}: {
  events: AuditEventDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Audit trail" nav={[]} toolbar={toolbar}>
      <ol className="space-y-3 border-l-4 border-primary pl-5">
        {events.map((event) => (
          <li key={event.id} className="surface-card p-4">
            <p className="type-label">{event.action}</p>
            <p className="mt-2">
              {event.actor?.displayName ?? "System"} · {event.resourceType}
            </p>
            <time className="text-sm text-muted-primary">
              {event.createdAt}
            </time>
            <p className="mt-2 text-xs break-all">
              Resource: {event.resourceId ?? "—"}
            </p>
          </li>
        ))}
      </ol>
      {!events.length && <p>No matching audit events.</p>}
    </DashboardLayout>
  );
}

export function AdminRecordDetailTemplate({
  record,
}: {
  record: AdminRecordSummaryDTO;
}) {
  return (
    <DashboardLayout title={record.resource} nav={[]}>
      <DashboardPanel title="Tenant inventory">
        <p className="text-3xl">{record.count}</p>
        <p className="mt-3">Persisted records in the active workspace.</p>
      </DashboardPanel>
    </DashboardLayout>
  );
}

export function AdminRecordsTemplate({
  records,
}: {
  records: AdminRecordSummaryDTO[];
}) {
  return (
    <DashboardLayout title="Workspace record inventory" nav={[]}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {records.map((record) => (
          <Link
            className="space-y-3 surface-card p-5 hover:bg-primary/10"
            key={record.resource}
            href={`/admin/records/${encodeURIComponent(record.resource)}`}
          >
            <h2 className="type-label">{record.resource}</h2>
            <p className="text-3xl">{record.count}</p>
            <p className="text-sm">Inspect resource</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function AdminUserDetailTemplate({
  membership,
  children,
}: {
  membership: AdminMembershipDTO;
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      title={membership.user.displayName ?? membership.user.email ?? "Member"}
      nav={[]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Identity">
          <p>{membership.user.email}</p>
          <p className="mt-4">Joined {membership.createdAt.slice(0, 10)}</p>
          <p>Access: {membership.status}</p>
        </DashboardPanel>
        <DashboardPanel title="Access management">{children}</DashboardPanel>
      </div>
    </DashboardLayout>
  );
}

export function AdminUsersTemplate({
  memberships,
  toolbar,
}: {
  memberships: AdminMembershipDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Member administration" nav={[]} toolbar={toolbar}>
      <DashboardTable
        columns={[
          { key: "person", label: "Member" },
          { key: "email", label: "Email" },
          { key: "role", label: "Application role" },
          { key: "status", label: "Access status" },
          { key: "joined", label: "Joined" },
        ]}
        rows={memberships.map((membership) => ({
          id: membership.id,
          href: `/admin/users/${membership.user.id}`,
          cells: {
            person:
              membership.user.displayName ??
              membership.user.email ??
              "Unnamed user",
            email: membership.user.email,
            role: membership.role,
            status: membership.status,
            joined: membership.createdAt.slice(0, 10),
          },
        }))}
      />
    </DashboardLayout>
  );
}
