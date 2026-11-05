import { marketingRemainingCopy } from "@/content/marketing";
import { marketingPresentationCopy } from "@/content/marketing";
// Why: Templates: pure presentation for the marketing pages, laid out from DTOs; data and slots come from features.
import type { CampaignDTO, AudienceDTO } from "@/types/marketingTypes";
import {
  DashboardLayout,
  DashboardTable,
  DashboardPanel,
} from "@/components/blocks/shared-blocks";
import Link from "next/link";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
import type { ReactNode } from "react";

export function MarketingAnalyticsTemplate({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  return (
    <DashboardLayout
      title={marketingPresentationCopy.campaignOperations}
      nav={[]}
    >
      <p>
        {marketingPresentationCopy.lifecycleSnapshotOf}
        {campaigns.length}
        {
          marketingPresentationCopy.loadedCampaignsDeliveryAndEngagementRatesRequireRecordedProvider
        }
      </p>
      <DashboardTable
        columns={[
          { key: "name", label: marketingPresentationCopy.campaign },
          { key: "audience", label: marketingPresentationCopy.audience },
          { key: "status", label: marketingPresentationCopy.lifecycle },
          { key: "scheduled", label: marketingPresentationCopy.scheduled },
          { key: "steps", label: marketingPresentationCopy.steps },
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
          {marketingPresentationCopy.editSegment}
        </Link>
      }
    >
      <DashboardPanel title={marketingPresentationCopy.membershipRule}>
        <p>
          {parsed.success && parsed.data.definition.rules[0]
            ? marketingRemainingCopy.relationshipRule(
                parsed.data.definition.rules[0].value,
              )
            : marketingPresentationCopy.thisAudienceHasCustomRulesThatTheCurrentEditor}
        </p>
        <p className="mt-4">
          {marketingPresentationCopy.audienceStatus2}
          {audience.status}
        </p>
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
    <DashboardLayout
      title={marketingPresentationCopy.audienceSegments}
      nav={[]}
      toolbar={toolbar}
    >
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
                {marketingPresentationCopy.contactRelationship}{" "}
                {parsed.success && parsed.data.definition.rules[0]
                  ? parsed.data.definition.rules[0].value
                  : marketingPresentationCopy.customRules}
              </p>
              <Link
                className="type-link"
                href={`/marketing/audiences/${audience.id}/edit`}
              >
                {marketingPresentationCopy.editSegment}
              </Link>
            </article>
          );
        })}
      </div>
      {!audiences.length && (
        <p>{marketingPresentationCopy.noMatchingAudiences}</p>
      )}
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
          {marketingPresentationCopy.editPlan}
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <DashboardPanel title={marketingPresentationCopy.campaignBrief}>
          <p className="whitespace-pre-wrap">
            {campaign.description ?? marketingPresentationCopy.noBriefRecorded}
          </p>
        </DashboardPanel>
        <DashboardPanel title={marketingPresentationCopy.targetAndSchedule}>
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
          <p className="mt-3">
            {marketingPresentationCopy.status}
            {campaign.status}
          </p>
          <p>
            {marketingPresentationCopy.scheduled2}
            {campaign.scheduledAt ?? marketingPresentationCopy.notScheduled}
          </p>
          <p>
            {marketingPresentationCopy.started}
            {campaign.startedAt ?? marketingPresentationCopy.notStarted}
          </p>
          <p>
            {marketingPresentationCopy.completed}
            {campaign.completedAt ?? marketingPresentationCopy.notCompleted}
          </p>
        </DashboardPanel>
      </div>
      <DashboardPanel title={marketingPresentationCopy.workflow}>
        <ol className="space-y-3 border-l-4 border-primary pl-4">
          {steps.map((step) => (
            <li className="surface-inset p-4" key={step.id}>
              <p className="type-label">
                {step.position}
                {marketingPresentationCopy.sentenceSeparator}
                {step.type}
              </p>
              {step.templateKey && (
                <p className="mt-2">
                  {marketingPresentationCopy.template}
                  {step.templateKey}
                </p>
              )}
            </li>
          ))}
        </ol>
        {!steps.length && (
          <p>{marketingPresentationCopy.noWorkflowStepsAreConfigured}</p>
        )}
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
    <DashboardLayout
      title={marketingPresentationCopy.campaignPlanner}
      nav={[]}
      toolbar={toolbar}
    >
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
            <DashboardPanel
              key={status}
              title={marketingRemainingCopy.nameAndStatus(status, group.length)}
            >
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
                      {campaign.description ??
                        marketingPresentationCopy.noCampaignBrief}
                    </p>
                    <p>
                      {marketingPresentationCopy.audience2}
                      {campaign.audience?.name ??
                        marketingPresentationCopy.notSelected}
                    </p>
                    <p>
                      {marketingPresentationCopy.planned}{" "}
                      {campaign.scheduledAt?.slice(0, 16).replace("T", " ") ??
                        marketingPresentationCopy.unscheduled}
                    </p>
                    <p>
                      {campaign.stepCount}
                      {marketingPresentationCopy.workflowSteps}
                    </p>
                  </article>
                ))}
              </div>
              {!group.length && (
                <p>{marketingPresentationCopy.noCampaignsInThisPhase}</p>
              )}
            </DashboardPanel>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
