// Why: Templates: pure presentation for the marketing pages, laid out from DTOs; data and slots come from features.
import type { CampaignDTO, AudienceDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardTable,
  DashboardPanel,
} from "@/components/blocks/dashboard-layout";
import Link from "next/link";
import { audienceFormSchema } from "@/schema/marketingSchemas";
import type { ReactNode } from "react";

export function MarketingAnalyticsTemplate({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  return (
    <DashboardLayout title="Campaign operations" nav={[]}>
      <p>
        Lifecycle snapshot of {campaigns.length} loaded campaigns. Delivery and
        engagement rates require recorded provider events.
      </p>
      <DashboardTable
        columns={[
          { key: "name", label: "Campaign" },
          { key: "audience", label: "Audience" },
          { key: "status", label: "Lifecycle" },
          { key: "scheduled", label: "Scheduled" },
          { key: "steps", label: "Steps" },
        ]}
        rows={campaigns.map((campaign) => ({
          id: campaign.id,
          href: `/marketing/campaigns/${campaign.id}`,
          cells: {
            name: campaign.name,
            audience: campaign.audience?.name,
            status: campaign.status,
            scheduled: campaign.scheduledAt,
            steps: campaign.stepCount,
          },
        }))}
      />
    </DashboardLayout>
  );
}

export function MarketingAudienceDetailTemplate({
  audience,
}: {
  audience: AudienceDTO;
}) {
  const parsed = audienceFormSchema.safeParse(audience);
  return (
    <DashboardLayout
      title={audience.name}
      nav={[]}
      toolbar={
        <Link
          className="type-link"
          href={`/marketing/audiences/${audience.id}/edit`}
        >
          Edit segment
        </Link>
      }
    >
      <DashboardPanel title="Membership rule">
        <p>
          {parsed.success && parsed.data.definition.rules[0]
            ? `Include contacts whose relationship is ${parsed.data.definition.rules[0].value}.`
            : "This audience has custom rules that the current editor cannot modify."}
        </p>
        <p className="mt-4">Audience status: {audience.status}</p>
      </DashboardPanel>
    </DashboardLayout>
  );
}

export function MarketingAudiencesTemplate({
  audiences,
  toolbar,
}: {
  audiences: AudienceDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Audience segments" nav={[]} toolbar={toolbar}>
      <div className="grid gap-4 md:grid-cols-2">
        {audiences.map((audience) => {
          const parsed = audienceFormSchema.safeParse(audience);
          return (
            <article key={audience.id} className="space-y-4 surface-card p-5">
              <Link
                className="type-title hover:underline"
                href={`/marketing/audiences/${audience.id}`}
              >
                {audience.name}
              </Link>
              <p>{audience.status}</p>
              <p>
                Contact relationship:{" "}
                {parsed.success && parsed.data.definition.rules[0]
                  ? parsed.data.definition.rules[0].value
                  : "Custom rules"}
              </p>
              <Link
                className="type-link"
                href={`/marketing/audiences/${audience.id}/edit`}
              >
                Edit segment
              </Link>
            </article>
          );
        })}
      </div>
      {!audiences.length && <p>No matching audiences.</p>}
    </DashboardLayout>
  );
}

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

export function MarketingCampaignsTemplate({
  campaigns,
  toolbar,
}: {
  campaigns: CampaignDTO[];
  toolbar: ReactNode;
}) {
  return (
    <DashboardLayout title="Campaign planner" nav={[]} toolbar={toolbar}>
      <div className="space-y-4">
        {[
          "DRAFT",
          "SCHEDULED",
          "ACTIVE",
          "PAUSED",
          "COMPLETED",
          "CANCELED",
        ].map((status) => {
          const group = campaigns.filter(
            (campaign) => campaign.status === status,
          );
          return (
            <DashboardPanel key={status} title={`${status} · ${group.length}`}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.map((campaign) => (
                  <article
                    className="space-y-3 surface-inset p-4"
                    key={campaign.id}
                  >
                    <Link
                      className="type-label hover:underline"
                      href={`/marketing/campaigns/${campaign.id}`}
                    >
                      {campaign.name}
                    </Link>
                    <p className="line-clamp-2 text-muted-primary">
                      {campaign.description ?? "No campaign brief."}
                    </p>
                    <p>Audience: {campaign.audience?.name ?? "Not selected"}</p>
                    <p>
                      Planned:{" "}
                      {campaign.scheduledAt?.slice(0, 16).replace("T", " ") ??
                        "Unscheduled"}
                    </p>
                    <p>{campaign.stepCount} workflow steps</p>
                  </article>
                ))}
              </div>
              {!group.length && <p>No campaigns in this phase.</p>}
            </DashboardPanel>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
