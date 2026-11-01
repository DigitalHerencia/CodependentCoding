// Why: Templates: pure presentation for the base pages every app has (dashboard, members, integrations, onboarding, profile).
import Link from "next/link";
import type { OrganizationDTO } from "@/types/commonTypes";
import type { ModuleDashboardEntry } from "@/types/moduleTypes";
import {
  DashboardLayout,
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/dashboard-layout";
import type { IntegrationStatus } from "@/types/integrationTypes";
import type { ReactNode } from "react";
import { OnboardingFlow } from "@/components/blocks/onboarding-flow";

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
        <DashboardPanel title="Workspaces">
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
        <DashboardPanel title="Your workspace">
          <p>{organization.memberCount} members</p>
          <p className="mt-3">Time zone: {organization.timezone}</p>
          <nav className="mt-6 flex flex-col gap-4">
            <Link className="type-link" href="/settings/profile">
              Workspace preferences
            </Link>
            <Link className="type-link" href="/settings/integrations">
              Integration configuration
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
    <DashboardLayout title="Integration configuration" nav={[]}>
      <p>
        Configuration presence only. These checks do not contact providers or
        verify connectivity.
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
                ? "Required configuration present"
                : "Required configuration missing"}
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
    <DashboardLayout title="Workspace directory" nav={[]}>
      <DashboardTable
        columns={[
          { key: "name", label: "Member" },
          { key: "role", label: "Role" },
          { key: "status", label: "Access" },
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

const nav = [
  { label: "Workspace", active: true },
  { label: "Goals" },
  { label: "Complete" },
] as const;

export function SharedOnboardingTemplate({
  clientIsland,
}: {
  clientIsland?: ReactNode;
}) {
  return (
    <DashboardLayout nav={nav} title="Onboarding">
      {clientIsland ?? <OnboardingFlow.WorkspaceSetup />}
    </DashboardLayout>
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
    <DashboardLayout title="Workspace settings" nav={[]}>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <DashboardPanel title="Workspace">
          <h2 className="type-title">{organization.name}</h2>
          <p className="mt-3">{organization.slug}</p>
          <p>{organization.memberCount} members</p>
        </DashboardPanel>
        <DashboardPanel title="Regional preferences">{children}</DashboardPanel>
      </div>
    </DashboardLayout>
  );
}
