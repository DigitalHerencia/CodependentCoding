import Link from "next/link";
import type { OrganizationDTO } from "@/types/commonTypes";
import type { ModuleDashboardEntry } from "@/types/moduleTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
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
