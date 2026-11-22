import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { settingsCopy } from "@/content/settings";
import type {
  SettingsPageProps,
  SettingsMembersProps,
  SettingsIntegrationsProps,
  SettingsBillingConfigurationProps,
  SettingsSkeletonProps,
} from "@/types/settingsTypes";

/** Frame a settings page inside the established tenant shell. */
export function SettingsPageBlock({ page, children }: SettingsPageProps) {
  return (
    <section className="w-full space-y-4 bg-background p-4 text-foreground">
      <header className="border-b border-border pb-4">
        <h1 className="type-title">{settingsCopy[page]}</h1>
      </header>
      {children}
    </section>
  );
}

/** Display only the membership rows authorized by the owning domain. */
export function SettingsMembersBlock({
  members,
  invitations,
  page,
  hasNextPage,
}: SettingsMembersProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{settingsCopy.member}</TableHead>
            <TableHead scope="col">{settingsCopy.role}</TableHead>
            <TableHead scope="col">{settingsCopy.access}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.status}</TableCell>
            </TableRow>
          ))}
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>{settingsCopy.emptyDirectory}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {(page > 1 || hasNextPage) && (
        <nav
          aria-label={settingsCopy.directoryPages}
          className="flex flex-wrap items-center gap-3"
        >
          {page > 1 && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`/settings/members?page=${page - 1}`}
            >
              {settingsCopy.previous}
            </Link>
          )}
          <span aria-current="page">{settingsCopy.page(page)}</span>
          {hasNextPage && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`/settings/members?page=${page + 1}`}
            >
              {settingsCopy.next}
            </Link>
          )}
        </nav>
      )}
      {invitations && (
        <section aria-labelledby="invitations-heading" className="space-y-3">
          <h2 className="type-heading" id="invitations-heading">
            {settingsCopy.pendingInvitations}
          </h2>
          {invitations}
        </section>
      )}
    </>
  );
}

/** Show installed inventory and configuration observations without implying provider health. */
export function SettingsIntegrationsBlock({
  integrations,
}: SettingsIntegrationsProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        {settingsCopy.configurationNotice}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name} className="space-y-3 p-5">
            <h2 className="type-heading">{integration.name}</h2>
            <p>{integration.purpose}</p>
            <p>{settingsCopy.installed}</p>
            <p>
              {integration.configuration === "present"
                ? settingsCopy.configurationPresent
                : settingsCopy.configurationMissing}
            </p>
          </Card>
        ))}
      </div>
      {integrations.length === 0 && <p>{settingsCopy.noIntegrations}</p>}
    </>
  );
}

/** Describe configuration independently of the persisted billing subscription. */
export function SettingsBillingConfigurationBlock({
  providerConfiguration,
}: SettingsBillingConfigurationProps) {
  const message = {
    present: settingsCopy.billingConfigurationPresent,
    missing: settingsCopy.billingConfigurationMissing,
    unavailable: settingsCopy.billingProviderUnavailable,
  }[providerConfiguration];
  return <p className="text-sm text-muted-foreground">{message}</p>;
}

/** Match the route's actual content while announcing its pending state. */
export function SettingsSkeletonBlock({ page }: SettingsSkeletonProps) {
  const label = {
    members: settingsCopy.loadingMembers,
    integrations: settingsCopy.loadingIntegrations,
    billing: settingsCopy.loadingBilling,
  }[page];
  return (
    <div role="status" aria-label={label} className="space-y-4 p-4">
      <Skeleton className="h-9 w-56" />
      <div
        className={
          page === "integrations" ? "grid gap-4 md:grid-cols-2" : "space-y-3"
        }
      >
        {Array.from({ length: page === "billing" ? 1 : 4 }, (_, index) => (
          <Skeleton
            key={index}
            className={page === "integrations" ? "h-44" : "h-16"}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
