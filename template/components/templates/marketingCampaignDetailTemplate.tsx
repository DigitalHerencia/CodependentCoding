import type { ReactNode } from "react";
import Link from "next/link";
import type { CampaignDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
export function MarketingCampaignDetailTemplate({
  campaign,
  children,
  steps,
}: {
  campaign: CampaignDTO;
  children: ReactNode;
  steps: {
    id: string;
    position: number;
    type: string;
    templateKey: string | null;
  }[];
}) {
  return (
    <DashboardLayout
      title={campaign.name}
      nav={[]}
      toolbar={
        <Link
          className="type-link"
          href={`/marketing/campaigns/${campaign.id}/edit`}
        >
          Edit plan
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title="Campaign brief">
          <p className="whitespace-pre-wrap">
            {campaign.description ?? "No brief recorded."}
          </p>
        </DashboardPanel>
        <DashboardPanel title="Target and schedule">
          <p>
            {campaign.audience ? (
              <Link
                className="type-link"
                href={`/marketing/audiences/${campaign.audience.id}`}
              >
                {campaign.audience.name}
              </Link>
            ) : (
              "No audience selected"
            )}
          </p>
          <p className="mt-3">Status: {campaign.status}</p>
          <p>Scheduled: {campaign.scheduledAt ?? "Not scheduled"}</p>
          <p>Started: {campaign.startedAt ?? "Not started"}</p>
          <p>Completed: {campaign.completedAt ?? "Not completed"}</p>
        </DashboardPanel>
      </div>
      <DashboardPanel title="Workflow">
        <ol className="space-y-3 border-l-4 border-primary pl-4">
          {steps.map((step) => (
            <li className="surface-inset p-4" key={step.id}>
              <p className="type-label">
                {step.position}. {step.type}
              </p>
              {step.templateKey && (
                <p className="mt-2">Template: {step.templateKey}</p>
              )}
            </li>
          ))}
        </ol>
        {!steps.length && <p>No workflow steps are configured.</p>}
        {children}
      </DashboardPanel>
    </DashboardLayout>
  );
}
