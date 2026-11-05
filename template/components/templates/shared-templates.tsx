import { sharedRemainingCopy } from "@/content/shared";
import { sharedPresentationCopy } from "@/content/shared";
// Why: Templates: pure presentation for the base pages every app has (dashboard, members, integrations, onboarding, profile).
import Link from "next/link";
import type { OrganizationDTO } from "@/types/commonTypes";
import type { ModuleDashboardEntry } from "@/types/moduleTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import type { IntegrationStatus } from "@/types/integrationTypes";
import type { ReactNode } from "react";
import { AuthFormPanel } from "@/components/blocks/auth-blocks";

export function SharedDashboardTemplate({
  organization,
  workspaces,
}: {
  organization: OrganizationDTO;
  workspaces: readonly ModuleDashboardEntry[];
}) {
  return (
    <DashboardLayout title={organization.name} nav={[]}>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={sharedPresentationCopy.workspaces}>
          <nav className="grid gap-3 sm:grid-cols-2">
            {workspaces.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="space-y-2 surface-inset p-4 hover:bg-primary/10"
              >
                <h2 className="type-label">{item.title}</h2>
                <p className="text-sm text-muted-primary">{item.description}</p>
              </Link>
            ))}
          </nav>
        </DashboardPanel>
        <DashboardPanel title={sharedPresentationCopy.yourWorkspace}>
          <p>
            {organization.memberCount}
            {sharedPresentationCopy.members}
          </p>
          <p className="mt-3">
            {sharedPresentationCopy.timeZone}
            {organization.timezone}
          </p>
          <nav className="mt-6 flex flex-col gap-4">
            <Link className="type-link" href="/settings/profile">
              {sharedPresentationCopy.workspacePreferences}
            </Link>
            <Link className="type-link" href="/settings/integrations">
              {sharedPresentationCopy.integrationConfiguration}
            </Link>
          </nav>
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}

export function SharedIntegrationsTemplate({
  integrations,
}: {
  integrations: IntegrationStatus[];
}) {
  return (
    <DashboardLayout
      title={sharedPresentationCopy.integrationConfiguration}
      nav={[]}
    >
      <p>
        {
          sharedPresentationCopy.configurationPresenceOnlyTheseChecksDoNotContactProviders
        }
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <article
            key={integration.name}
            className="space-y-3 surface-card p-5"
          >
            <h2 className="type-title">{integration.name}</h2>
            <p>{integration.purpose}</p>
            <p>
              {integration.state === "CONFIGURED"
                ? sharedPresentationCopy.requiredConfigurationPresent
                : sharedRemainingCopy.configurationMissing(integration.mode)}
            </p>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function SharedMembersTemplate({
  members,
}: {
  members: { id: string; name: string; role: string; status: string }[];
}) {
  return (
    <DashboardLayout title={sharedPresentationCopy.workspaceDirectory} nav={[]}>
      <DashboardTable
        columns={[
          { key: "name", label: sharedPresentationCopy.member },
          { key: "role", label: sharedPresentationCopy.role },
          { key: "status", label: sharedPresentationCopy.access },
        ]}
        rows={members.map((member) => ({
          id: member.id,
          cells: {
            name: member.name,
            role: member.role,
            status: member.status,
          },
        }))}
      />
    </DashboardLayout>
  );
}

export function SharedOnboardingTemplate({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <AuthFormPanel title={title} description={description}>
      {children}
    </AuthFormPanel>
  );
}

export function SharedProfileSettingsTemplate({
  organization,
  children,
}: {
  organization: OrganizationDTO;
  children: ReactNode;
}) {
  return (
    <DashboardLayout title={sharedPresentationCopy.workspaceSettings} nav={[]}>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <DashboardPanel title={sharedPresentationCopy.workspace}>
          <h2 className="type-title">{organization.name}</h2>
          <p className="mt-3">{organization.slug}</p>
          <p>
            {organization.memberCount}
            {sharedPresentationCopy.members}
          </p>
        </DashboardPanel>
        <DashboardPanel title={sharedPresentationCopy.regionalPreferences}>
          {children}
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
