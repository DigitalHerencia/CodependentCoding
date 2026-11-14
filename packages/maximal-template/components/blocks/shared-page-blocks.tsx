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
import type { ReactNode } from "react";

// Shared presentation for integrations, members, onboarding and profile.

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
