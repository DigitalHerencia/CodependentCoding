import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { dashboardCopy } from "@/content/dashboard";
import type {
  DashboardActivityDTO,
  DashboardOrganizationDTO,
  DashboardPreferencesDTO,
} from "@/types/dashboardTypes";
import type { ModuleDashboardEntry } from "@/types/moduleTypes";

// ---------------------------------------------------------------------------
// DASHBOARD OVERVIEW
// ---------------------------------------------------------------------------

/** Present the organization context without reading application state. */
export function DashboardOverviewBlock({
  organization,
}: {
  organization: DashboardOrganizationDTO;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-primary">{dashboardCopy.subtitle}</p>
      <Badge variant="outline">
        {dashboardCopy.timezone}: {organization.timezone}
      </Badge>
    </div>
  );
}

/** Three small read-only counts from the prepared dashboard model. */
export function DashboardMetricsBlock({
  memberCount,
  workspaceCount,
  activityCount,
}: {
  memberCount: number;
  workspaceCount: number;
  activityCount: number;
}) {
  const metrics = [
    { label: dashboardCopy.members, value: memberCount },
    { label: dashboardCopy.modules, value: workspaceCount },
    { label: dashboardCopy.activityCount, value: activityCount },
  ] as const;

  return (
    <section aria-label={dashboardCopy.section} className="grid gap-3 sm:grid-cols-3">
      {metrics.map(({ label, value }) => (
        <Card key={label}>
          <CardContent className="space-y-2 p-4">
            <p className="text-sm text-muted-primary">{label}</p>
            <p className="text-3xl font-semibold tabular-nums">{value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// INSTALLED WORKSPACES
// ---------------------------------------------------------------------------

/** Generic empty state reused by dashboard panels. */
export function DashboardEmptyStateBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1 border border-dashed p-5">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-primary">{description}</p>
    </div>
  );
}

/** Installed-module navigation, supplied as a safe presentation contract. */
export function DashboardWorkspacesBlock({
  workspaces,
  compact,
}: {
  workspaces: readonly ModuleDashboardEntry[];
  compact: boolean;
}) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>{dashboardCopy.workspacesHeading}</CardTitle>
        <CardDescription>{dashboardCopy.workspacesDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {workspaces.length === 0 ? (
          <DashboardEmptyStateBlock
            title={dashboardCopy.workspacesEmptyTitle}
            description={dashboardCopy.workspacesEmptyDescription}
          />
        ) : (
          <nav
            aria-label={dashboardCopy.workspacesHeading}
            className={compact ? "grid gap-2 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}
          >
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={workspace.href}
                className="surface-inset block space-y-2 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <h3 className="font-semibold">{workspace.title}</h3>
                <p className="text-sm text-muted-primary">{workspace.description}</p>
              </Link>
            ))}
          </nav>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// MEMBER ACTIVITY
// ---------------------------------------------------------------------------

/** Recent audit events limited to the current member's identity. */
export function DashboardActivityBlock({
  activities,
}: {
  activities: readonly DashboardActivityDTO[];
}) {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>{dashboardCopy.activityHeading}</CardTitle>
        <CardDescription>{dashboardCopy.activityDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {activities.length === 0 ? (
          <DashboardEmptyStateBlock
            title={dashboardCopy.activityEmptyTitle}
            description={dashboardCopy.activityEmptyDescription}
          />
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((activity) => (
              <li key={activity.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-primary">{activity.resourceType}</p>
                </div>
                <time dateTime={activity.createdAt} className="text-xs text-muted-primary">
                  {activity.createdAt.slice(0, 10)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// DASHBOARD PREFERENCES
// ---------------------------------------------------------------------------

/** Controlled shadcn switches; state and action handling stay in the client feature. */
export function DashboardPreferencesBlock({
  preferences,
  onChange,
  onSave,
  pending,
  dirty,
  message,
}: {
  preferences: DashboardPreferencesDTO;
  onChange: (next: DashboardPreferencesDTO) => void;
  onSave: () => void;
  pending: boolean;
  dirty: boolean;
  message: string | null;
}) {
  const controls = [
    {
      key: "showWorkspaces",
      label: dashboardCopy.showWorkspaces,
      description: dashboardCopy.showWorkspacesDescription,
    },
    {
      key: "showActivity",
      label: dashboardCopy.showActivity,
      description: dashboardCopy.showActivityDescription,
    },
    {
      key: "compactView",
      label: dashboardCopy.compactView,
      description: dashboardCopy.compactViewDescription,
    },
  ] as const;

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>{dashboardCopy.preferencesHeading}</CardTitle>
        <CardDescription>{dashboardCopy.preferencesDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        {controls.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0">
            <div className="space-y-1">
              <label htmlFor={`dashboard-${key}`} className="font-medium">
                {label}
              </label>
              <p className="text-sm text-muted-primary">{description}</p>
            </div>
            <Switch
              id={`dashboard-${key}`}
              checked={preferences[key]}
              onCheckedChange={(checked) => onChange({ ...preferences, [key]: checked })}
              disabled={pending}
            />
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="button" onClick={onSave} disabled={pending || !dirty}>
            {pending ? dashboardCopy.saving : dashboardCopy.save}
          </Button>
          <p aria-live="polite" role="status" className="text-sm text-muted-primary">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
