"use client";
/** Admin shadcn compositions; copy and primitive imports terminate here.
 * Loading/error presentation follows the existing BoldKit patterns.
 * @see https://boldkit.dev
 */
import Link from "next/link";
import { RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AdminNavigation } from "@/components/nav/admin-navigation";
import { AdminMobile } from "@/components/nav/admin-mobile";
import {
  adminNavigationCopy,
  adminNavigationItems,
} from "@/content/admin-navigation";
import {
  adminCopy as copy,
  adminPageCopy,
  adminLoadingCopy,
} from "@/content/admin";
import { formResultCopy } from "@/content/application";
import type {
  AdminHeaderBlockProps,
  AdminAuditContentProps,
  AdminUsersContentProps,
  AdminSearchToolbarProps,
  AdminPageFrameProps,
  AdminPaginationProps,
  AdminRecordsProps,
  AdminRecordDetailProps,
  AdminMembershipProps,
  AdminNewUserTemplateProps,
  AdminEditUserTemplateProps,
  AdminFormFeedbackProps,
  AdminSkeletonProps,
  AdminErrorProps,
} from "@/types/adminTypes";

/** Consistent page frame with headings and a route-specific toolbar. */
export function AdminPageBlock({
  variant,
  title,
  toolbar,
  children,
}: AdminPageFrameProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-6 p-4 lg:p-6">
      <header className="space-y-4">
        <h1 className="type-title">{title ?? adminPageCopy[variant]}</h1>
        {toolbar}
      </header>
      {children}
    </section>
  );
}
/** Admin navigation labels enter only at the block boundary. */
export function AdminHeaderBlock({
  accountMenu,
  mobileAccountMenu,
}: AdminHeaderBlockProps) {
  const navigation = (
    <AdminNavigation
      label={adminNavigationCopy.navigation}
      items={adminNavigationItems}
    />
  );
  return (
    <AdminHeader
      brand={<Wordmark />}
      navigation={navigation}
      accountMenu={accountMenu}
      mobile={
        <AdminMobile title={adminNavigationCopy.navigation}>
          {navigation}
          {mobileAccountMenu}
        </AdminMobile>
      }
    />
  );
}
/** Footer keeps navigation inside the authenticated admin shell. */
export function AdminFooterBlock() {
  return (
    <AdminFooter>
      <p>{copy.footer}</p>
      <Link href="/dashboard" className="type-link">
        {adminNavigationItems[3].label}
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
      className="flex flex-wrap gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      {!audit && (
        <Button asChild variant="outline">
          <Link href="/admin/users/new">{copy.addRegisteredMember}</Link>
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
    <ol className="space-y-3 border-l-4 border-primary pl-5">
      {events.map((event) => (
        <li key={event.id}>
          <Card>
            <CardHeader>
              <CardTitle>{event.action}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
export function AdminRecordsContentBlock({ records }: AdminRecordsProps) {
  return records.length ? (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <CardTitle>{record.resource}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl">{record.count}</p>
            <Button asChild variant="outline">
              <Link href={`/admin/records/${encodeURIComponent(record.id)}`}>
                {copy.inspectResource}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <p role="status">{copy.noRecords}</p>
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
      <CardContent className="space-y-3">
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
      <CardContent className="space-y-4">
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
  approved,
  result,
}: AdminFormFeedbackProps) {
  return (
    <>
      {error && (
        <FieldError>{error.message ?? formResultCopy.failed}</FieldError>
      )}
      {result === "failed" && <FieldError>{formResultCopy.failed}</FieldError>}
      <p role="status" aria-live="polite">
        {approved
          ? copy.approvalComplete
          : result === "role"
            ? copy.roleUpdated
            : result === "access"
              ? copy.accessUpdated
              : null}
      </p>
    </>
  );
}
/** New-access form binds presentation to RHF-controlled fields supplied by the form island. */
export function AdminNewUserFormBlock({
  email,
  role,
  errors,
  roles,
  pending,
  onSubmit,
}: AdminNewUserTemplateProps) {
  return (
    <form
      id="admin-new-user"
      className="max-w-3xl space-y-5"
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
    >
      <p>{copy.approvalDescription}</p>
      <Field data-invalid={Boolean(errors.email)}>
        <FieldLabel htmlFor="member-email">{copy.registeredEmail}</FieldLabel>
        <Input
          {...email}
          id="member-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "member-email-error" : undefined}
        />
        {errors.email && (
          <FieldError id="member-email-error">
            {errors.email.message}
          </FieldError>
        )}
      </Field>
      <Field data-invalid={Boolean(errors.role)}>
        <FieldLabel htmlFor="new-member-role">
          {copy.applicationRole}
        </FieldLabel>
        <NativeSelect
          {...role}
          id="new-member-role"
          disabled={pending}
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? "new-member-role-error" : undefined}
        >
          {roles.map((value) => (
            <NativeSelectOption key={value} value={value}>
              {value}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {errors.role && (
          <FieldError id="new-member-role-error">
            {errors.role.message}
          </FieldError>
        )}
      </Field>
      <Button type="submit" disabled={pending}>
        {copy.approveAccess}
      </Button>
    </form>
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
}: AdminEditUserTemplateProps) {
  return (
    <div className="max-w-3xl space-y-5">
      <p>
        {membership.user.displayName ?? membership.user.email ?? copy.member}
      </p>
      <form
        className="space-y-3"
        onSubmit={onSubmit}
        noValidate
        aria-busy={pending}
      >
        <Field data-invalid={Boolean(errors.role)}>
          <FieldLabel htmlFor="member-role">{copy.applicationRole}</FieldLabel>
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
      className="space-y-4 p-4"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-4">
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
      className="mx-auto flex min-h-[60vh] max-w-3xl items-center p-4"
    >
      <Card className="w-full">
        <CardHeader>
          <ServerCrash
            aria-hidden
            className="mx-auto size-12 text-destructive"
          />
          <CardTitle>{adminNavigationCopy.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{adminNavigationCopy.errorDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={reset}>
              <RefreshCw aria-hidden />
              {adminNavigationCopy.tryAgain}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">
                {adminNavigationCopy.returnToAdmin}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
