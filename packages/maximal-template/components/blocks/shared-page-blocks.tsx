import { AuthFormPanel } from "@/components/blocks/auth-blocks";
import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import { Card } from "@/components/ui/card";
import { settingsPresentationCopy } from "@/content/settings";
import { sharedPresentationCopy, sharedRemainingCopy } from "@/content/shared";
import type { OrganizationDTO } from "@/types/commonTypes";
import type { IntegrationStatus } from "@/types/integrationTypes";
import type { ModuleDashboardEntry } from "@/types/moduleTypes";
import Link from "next/link";
import type { ReactNode } from "react";

// Why: Templates: pure presentation for the base pages every app has (dashboard, members, integrations, onboarding, profile).

export function SharedDashboardContentBlock({
  organization,
  workspaces,
}: {
  organization: OrganizationDTO;
  workspaces: readonly ModuleDashboardEntry[];
}) {
  return (
    <>
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
    </>
  );
}

export function SharedIntegrationsContentBlock({
  integrations,
}: {
  integrations: IntegrationStatus[];
}) {
  return (
    <>
      <p>
        {
          sharedPresentationCopy.configurationPresenceOnlyTheseChecksDoNotContactProviders
        }
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name} className="space-y-3 p-5">
            <h2 className="type-title">{integration.name}</h2>
            <p>{integration.purpose}</p>
            <p>
              {integration.state === "CONFIGURED"
                ? sharedPresentationCopy.requiredConfigurationPresent
                : sharedRemainingCopy.configurationMissing(integration.mode)}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}

export function SharedMembersContentBlock({
  members,
  invitations,
}: {
  invitations?: ReactNode;
  members: { id: string; name: string; role: string; status: string }[];
}) {
  return (
    <>
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
      {invitations && (
        <section aria-labelledby="invitations-heading" className="space-y-3">
          <h2 className="type-heading" id="invitations-heading">
            {settingsPresentationCopy.pendingInvitations}
          </h2>
          {invitations}
        </section>
      )}
    </>
  );
}

export function SharedOnboardingPageBlock({
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

export function SharedProfileSettingsContentBlock({
  organization,
  children,
}: {
  organization: OrganizationDTO;
  children: ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
