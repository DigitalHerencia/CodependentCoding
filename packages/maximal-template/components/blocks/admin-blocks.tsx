"use client";
/** Admin shadcn compositions; copy and primitive imports terminate here.
 * Loading/error presentation follows the existing BoldKit patterns.
 * @see https://boldkit.dev
 */
import Link from "next/link";
import {
  RefreshCw,
  ServerCrash,
  Download,
  UserPlus,
  Users,
  Activity,
  Mail,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/charts/container";
import { ChartTooltip, ChartTooltipContent } from "@/components/charts/tooltip";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Wordmark } from "@/components/brand/wordmark";
import { AdminHeader } from "@/components/nav/admin-header";
import { AdminFooter } from "@/components/nav/admin-footer";
import { AdminNavigationLinks } from "@/components/nav/admin-navigation";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarToggle,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  adminCopy as copy,
  adminPageCopy,
  adminLoadingCopy,
  adminNavigationCopy,
  adminNavigationItems,
} from "@/content/admin";
import { formResultCopy } from "@/content/application";
import type {
  AdminHeaderBlockProps,
  AdminChildrenProps,
  AdminMetricsProps,
  AdminAuditContentProps,
  AdminUsersContentProps,
  AdminSearchToolbarProps,
  AdminPageFrameProps,
  AdminPaginationProps,
  AdminRecordsProps,
  AdminRecordDetailProps,
  AdminMembershipProps,
  AdminEditUserTemplateProps,
  AdminFormFeedbackProps,
  AdminSkeletonProps,
  AdminErrorProps,
  AdminDashboardView,
} from "@/types/adminTypes";

/** Overview actions retain the supplied export affordance as navigation to the authorized audit report. */
export function AdminDashboardToolbarBlock() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" asChild>
        <Link href="/admin/audit">
          <Download aria-hidden />
          {copy.export}
        </Link>
      </Button>
      <Button asChild>
        <Link href="/admin/users/new">
          <UserPlus aria-hidden />
          {copy.inviteUser}
        </Link>
      </Button>
    </div>
  );
}

/** Admin owns the invitation section's location; invitations owns its form and commands. */
export function AdminInvitationsSectionBlock({ children }: AdminChildrenProps) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="type-heading">{copy.sentInvitations}</h2>
      {children}
    </section>
  );
}

/** Adapt the supplied statistics and chart using real workspace data and installed BoldKit primitives.
 * @see https://recharts.github.io/en-US/api/BarChart/
 */
export function AdminDashboardContentBlock({
  members,
  activeMembers,
  invitations,
  events,
  activity,
}: AdminDashboardView) {
  const statistics = [
    { label: copy.totalMembers, value: members, icon: Users },
    { label: copy.activeMembers, value: activeMembers, icon: Activity },
    { label: copy.pendingInvitations, value: invitations, icon: Mail },
    { label: copy.recentEvents, value: events, icon: Activity },
  ];
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardDescription className="font-bold uppercase">
                {label}
              </CardDescription>
              <Icon aria-hidden className="size-8 shrink-0 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>{copy.activityOverview}</CardTitle>
            <CardDescription>{copy.activityDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              aria-label={copy.activityDescription}
              config={{
                count: { label: copy.events, color: "var(--primary)" },
              }}
              className="h-64 w-full"
            >
              <BarChart data={activity} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date: string) => date.slice(5)}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} width={40} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
            <details>
              <summary className="type-link cursor-pointer">
                {copy.activityOverview}
              </summary>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.date}</TableHead>
                    <TableHead>{copy.events}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activity.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </details>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.membershipOverview}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p>
              {copy.activeMembers}: {activeMembers} / {members}
            </p>
            <Progress
              value={activeMembers}
              max={Math.max(members, 1)}
              aria-label={copy.activeMembers}
            />
            <p>{copy.invitationsDescription}</p>
            <Button asChild variant="outline">
              <Link href="/admin/users">{copy.memberAdministration}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** Consistent page frame with headings and a route-specific toolbar. */
export function AdminPageBlock({
  variant,
  title,
  toolbar,
  children,
}: AdminPageFrameProps) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 p-4 md:p-8">
      <header className="flex flex-col gap-4">
        <h1 className="type-title uppercase">
          {title ?? adminPageCopy[variant]}
        </h1>
        <p className="text-muted-foreground">{copy.descriptions[variant]}</p>
        {toolbar}
      </header>
      {children}
    </section>
  );
}
/** BoldKit's provider owns responsive sheet/collapse behavior for the whole admin frame.
 * @see https://boldkit.dev/docs/components/sidebar
 */
export function AdminFrameBlock({ children }: AdminChildrenProps) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
/** Header controls share the sidebar provider rather than mounting another mobile menu. */
export function AdminHeaderBlock() {
  return (
    <AdminHeader
      brand={<Wordmark />}
      controls={
        <>
          <SidebarToggle aria-label={adminNavigationCopy.navigation} />
          <form action="/admin/users" method="get" className="min-w-0 flex-1">
            <Input
              type="search"
              name="query"
              maxLength={200}
              aria-label={copy.searchMembers}
              placeholder={copy.searchNameOrEmail}
            />
          </form>
        </>
      }
    />
  );
}
/** One responsive sidebar contains navigation and an independently owned account sheet. */
export function AdminSidebarBlock({ accountMenu }: AdminHeaderBlockProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar collapsible="hidden" className="sticky top-0 h-dvh">
      <SidebarHeader>
        <span className="type-heading">{copy.footer}</span>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavigationLinks
          label={adminNavigationCopy.navigation}
          items={adminNavigationItems}
          onNavigate={() => setOpenMobile(false)}
        />
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t-3 border-foreground">
        {accountMenu}
      </SidebarFooter>
    </Sidebar>
  );
}
/** Dashboard cards expose only real values and describe the count's scope. */
export function AdminMetricsBlock({ metrics }: AdminMetricsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardDescription className="font-bold uppercase">
              {copy.metrics[metric.label]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black tabular-nums">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
/** Footer keeps navigation inside the authenticated admin shell. */
export function AdminFooterBlock() {
  return (
    <AdminFooter>
      <div className="flex flex-wrap items-center gap-4">
        <Wordmark compact />
        <p>{copy.footerCopyright}</p>
      </div>
      <Link href="/dashboard" className="type-link">
        {copy.workspace}
      </Link>
    </AdminFooter>
  );
}
/** Keyboard access bypasses repeated admin navigation. */
export function AdminSkipLinkBlock() {
  return (
    <a
      href="#admin-main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2"
    >
      {adminNavigationCopy.skipToContent}
    </a>
  );
}
/** Shared search behavior renders copy for its route without application imports. */
export function AdminSearchToolbarBlock({
  variant,
  query,
  onQueryChange,
  onSearch,
}: AdminSearchToolbarProps) {
  const audit = variant === "audit";
  return (
    <form
      className="flex flex-wrap gap-3 [&_input]:w-auto [&_input]:min-w-0 [&_input]:flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      {!audit && (
        <Button asChild variant="outline">
          <Link href="/admin/users/new">{copy.inviteUser}</Link>
        </Button>
      )}
      <Input
        type="search"
        maxLength={200}
        aria-label={audit ? copy.searchAuditEvents : copy.searchMembers}
        placeholder={
          audit ? copy.searchActionResourceOrActor : copy.searchNameOrEmail
        }
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Button type="submit">{copy.search}</Button>
    </form>
  );
}
/** Server-composed pagination avoids rebuilding domain URLs in presentation. */
export function AdminPaginationBlock({
  page,
  previous,
  next,
}: AdminPaginationProps) {
  return (
    <nav aria-label={copy.pagination} className="flex items-center gap-4 p-4">
      {previous && (
        <Button variant="outline" asChild>
          <Link href={previous}>{copy.previous}</Link>
        </Button>
      )}
      <span>
        {copy.page} {page}
      </span>
      {next && (
        <Button variant="outline" asChild>
          <Link href={next}>{copy.next}</Link>
        </Button>
      )}
    </nav>
  );
}
/** Audit data is escaped text; metadata never renders as arbitrary markup. */
export function AdminAuditContentBlock({ events }: AdminAuditContentProps) {
  return events.length ? (
    <ol className="flex flex-col gap-3 border-l-4 border-primary pl-5">
      {events.map((event) => (
        <li key={event.id}>
          <Card>
            <CardHeader>
              <CardTitle>{event.action}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p>
                {event.actor?.displayName ?? event.actor?.email ?? copy.system}
                {copy.separator}
                {event.resourceType}
              </p>
              <time
                dateTime={event.createdAt}
                className="text-sm text-muted-foreground"
              >
                {event.createdAt}
              </time>
              <p className="text-xs break-all">
                {copy.resource}
                {event.resourceId ?? copy.emptyValue}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  ) : (
    <p role="status">{copy.noMatchingAuditEvents}</p>
  );
}
/** Inventory links use stable registry identifiers. */
export function AdminRecordsContentBlock({
  records,
}: Pick<AdminRecordsProps, "records">) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.workspaceRecordInventory}</CardTitle>
        <CardDescription>
          {copy.persistedRecordsInTheActiveWorkspace}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {records.length ? copy.tenantInventory : copy.noRecords}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.resource}</TableHead>
              <TableHead>{copy.records}</TableHead>
              <TableHead>{copy.inspect}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.resource}</TableCell>
                <TableCell className="tabular-nums">{record.count}</TableCell>
                <TableCell>
                  <Button asChild variant="outline">
                    <Link
                      href={`/admin/records/${encodeURIComponent(record.id)}`}
                    >
                      {copy.inspectResource}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
/** One organization's persisted count, with no mutation affordance. */
export function AdminRecordDetailContentBlock({
  record,
}: AdminRecordDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.tenantInventory}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-3xl">{record.count}</p>
        <p>{copy.persistedRecordsInTheActiveWorkspace}</p>
      </CardContent>
    </Card>
  );
}
/** Membership details link to the dedicated edit page rather than duplicating a form. */
export function AdminUserDetailContentBlock({
  membership,
}: AdminMembershipProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.identity}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p>{membership.user.email ?? copy.emptyValue}</p>
        <p>
          {copy.joined}
          <time dateTime={membership.createdAt}>
            {membership.createdAt.slice(0, 10)}
          </time>
        </p>
        <p>
          {copy.applicationRole}: {membership.role}
        </p>
        <p>
          {copy.access}
          {membership.status}
        </p>
        {!membership.canManage ? (
          <p>{membership.role === "OWNER" ? copy.owner : copy.self}</p>
        ) : (
          <Button asChild variant="outline">
            <Link
              href={`/admin/users/${encodeURIComponent(membership.user.id)}/edit`}
            >
              {copy.edit}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
/** Accessible member table displays only the authorized DTO projection. */
export function AdminUsersContentBlock({
  memberships,
}: AdminUsersContentProps) {
  return (
    <Table>
      <TableCaption>
        {memberships.length ? copy.memberAdministration : copy.noMembers}
      </TableCaption>
      <TableHeader>
        <TableRow>
          {[
            copy.member,
            copy.email,
            copy.applicationRole,
            copy.accessStatus,
            copy.joinedHeading,
          ].map((label) => (
            <TableHead key={label}>{label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => (
          <TableRow key={membership.id}>
            <TableCell>
              <Link
                className="type-link"
                href={`/admin/users/${encodeURIComponent(membership.user.id)}`}
              >
                {membership.user.displayName ??
                  membership.user.email ??
                  copy.unnamedUser}
              </Link>
            </TableCell>
            <TableCell>{membership.user.email ?? copy.emptyValue}</TableCell>
            <TableCell>{membership.role}</TableCell>
            <TableCell>{membership.status}</TableCell>
            <TableCell>
              <time dateTime={membership.createdAt}>
                {membership.createdAt.slice(0, 10)}
              </time>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
/** Server validation errors and safe transport failure copy have a single presentation owner. */
export function AdminFormFeedbackBlock({
  error,
  result,
}: AdminFormFeedbackProps) {
  return (
    <>
      {error && (
        <FieldError>{error.message ?? formResultCopy.failed}</FieldError>
      )}
      {result === "failed" && <FieldError>{formResultCopy.failed}</FieldError>}
      <p role="status" aria-live="polite">
        {result === "role"
          ? copy.roleUpdated
          : result === "access"
            ? copy.accessUpdated
            : null}
      </p>
    </>
  );
}
/** Membership edit presentation excludes ownership from assignable roles. */
export function AdminEditUserFormBlock({
  membership,
  role,
  roles,
  errors,
  pending,
  onSubmit,
  onToggleAccess,
  organizationId,
  organizations,
  deniedPermissions,
  permissions,
}: AdminEditUserTemplateProps) {
  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <p>
        {membership.user.displayName ?? membership.user.email ?? copy.member}
      </p>
      <form
        method="post"
        className="flex flex-col gap-3"
        onSubmit={onSubmit}
        noValidate
        aria-busy={pending}
      >
        <FieldGroup>
          <Field data-invalid={Boolean(errors.role)}>
            <FieldLabel htmlFor="member-role">
              {copy.applicationRole}
            </FieldLabel>
            <NativeSelect
              {...role}
              id="member-role"
              disabled={pending}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? "member-role-error" : undefined}
            >
              {roles.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {value}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.role && (
              <FieldError id="member-role-error">
                {errors.role.message}
              </FieldError>
            )}
          </Field>
          <Field data-invalid={Boolean(errors.organizationId)}>
            <FieldLabel htmlFor="member-organization">
              {copy.organization}
            </FieldLabel>
            <NativeSelect
              {...organizationId}
              id="member-organization"
              disabled={pending}
              aria-invalid={Boolean(errors.organizationId)}
              aria-describedby="member-organization-help member-organization-error"
            >
              {organizations.map((organization) => (
                <NativeSelectOption
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldDescription id="member-organization-help">
              {copy.organizationHelp}
            </FieldDescription>
            <FieldError id="member-organization-error">
              {errors.organizationId?.message}
            </FieldError>
          </Field>
          <fieldset
            disabled={pending}
            className="flex flex-col gap-3"
            aria-describedby="member-permissions-help member-permissions-error"
          >
            <legend className="font-bold">{copy.permissionRestrictions}</legend>
            <FieldDescription id="member-permissions-help">
              {copy.permissionHelp}
            </FieldDescription>
            <div className="grid max-h-64 gap-3 overflow-y-auto sm:grid-cols-2">
              {permissions.map((permission) => (
                <Field key={permission}>
                  <FieldLabel className="flex items-center gap-2">
                    <Checkbox
                      checked={deniedPermissions.value.includes(permission)}
                      onCheckedChange={(checked) =>
                        deniedPermissions.onChange(
                          checked === true
                            ? [...deniedPermissions.value, permission]
                            : deniedPermissions.value.filter(
                                (value) => value !== permission,
                              ),
                        )
                      }
                      onBlur={deniedPermissions.onBlur}
                    />
                    {permission}
                  </FieldLabel>
                </Field>
              ))}
            </div>
            <FieldError id="member-permissions-error">
              {errors.deniedPermissions?.message}
            </FieldError>
          </fieldset>
        </FieldGroup>
        <Button type="submit" disabled={pending}>
          {copy.saveRole}
        </Button>
      </form>
      <Button
        variant="outline"
        type="button"
        disabled={pending}
        onClick={onToggleAccess}
      >
        {membership.status === "SUSPENDED" ? copy.restore : copy.suspend}
      </Button>
    </div>
  );
}
/** Direct skeleton block: no skeleton templates or application imports.
 * @see https://boldkit.dev
 */
export function AdminSkeletonBlock({ variant }: AdminSkeletonProps) {
  const label = variant
    ? adminLoadingCopy[variant]
    : adminNavigationCopy.loadingContent;
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label={label}
      className="flex flex-col gap-4 p-4"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="flex flex-col gap-4">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </section>
  );
}
/** Safe retry block uses the local BoldKit error presentation without leaking errors.
 * @see https://boldkit.dev
 */
export function AdminErrorBlock({ reset }: AdminErrorProps) {
  return (
    <section
      role="alert"
      className="mx-auto flex min-h-[70vh] max-w-3xl items-center p-4 text-center"
    >
      <Card className="w-full">
        <CardHeader>
          <p
            aria-hidden
            className="text-8xl font-black text-muted-foreground/30"
          >
            {copy.errorCode}
          </p>
          <ServerCrash
            aria-hidden
            className="mx-auto size-12 text-destructive"
          />
          <CardTitle>{adminNavigationCopy.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>{adminNavigationCopy.errorDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={reset}>
              <RefreshCw aria-hidden />
              {adminNavigationCopy.tryAgain}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">{adminNavigationCopy.returnToAdmin}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
