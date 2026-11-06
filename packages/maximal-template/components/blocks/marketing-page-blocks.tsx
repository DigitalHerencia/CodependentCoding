import {
  AudiencesToolbar,
  CampaignsToolbar,
} from "@/components/blocks/marketing-blocks";
import {
  DashboardPanel,
  DashboardTable,
} from "@/components/blocks/shared-blocks";
import { Card } from "@/components/ui/card";
import {
  marketingPresentationCopy,
  marketingRemainingCopy,
} from "@/content/marketing";
import type { AudienceView, CampaignDTO } from "@/types/marketingTypes";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Why: Templates: pure presentation for the marketing pages, laid out from DTOs; data and slots come from features.

export function MarketingAnalyticsContentBlock({
  campaigns,
}: {
  campaigns: CampaignDTO[];
}) {
  return (
    <>
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
    </>
  );
}

export function MarketingAudienceDetailContentBlock({
  audience,
}: {
  audience: AudienceView;
}) {
  return (
    <>
      <DashboardPanel title={marketingPresentationCopy.membershipRule}>
        <p>{audience.ruleDescription}</p>
        <p className="mt-4">
          {marketingPresentationCopy.audienceStatus2}
          {audience.status}
        </p>
      </DashboardPanel>
    </>
  );
}

export function MarketingAudiencesContentBlock({
  audiences,
}: {
  audiences: AudienceView[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof AudiencesToolbar>;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {audiences.map((audience) => {
          return (
            <Card key={audience.id} className="space-y-4 p-5">
              <Link
                className="type-title hover:underline"
                href={`/marketing/audiences/${audience.id}`}
              >
                {audience.name}
              </Link>
              <p>{audience.status}</p>
              <p>
                {marketingPresentationCopy.contactRelationship}{" "}
                {audience.relationshipLabel}
              </p>
              <Link
                className="type-link"
                href={`/marketing/audiences/${audience.id}/edit`}
              >
                {marketingPresentationCopy.editSegment}
              </Link>
            </Card>
          );
        })}
      </div>
      {!audiences.length && (
        <p>{marketingPresentationCopy.noMatchingAudiences}</p>
      )}
    </>
  );
}

export function MarketingCampaignDetailContentBlock({
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
    <>
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
    </>
  );
}

export function MarketingCampaignsContentBlock({
  groups,
}: {
  groups: readonly { status: string; items: CampaignDTO[] }[];
  toolbar?: ReactNode;
  toolbarProps?: ComponentProps<typeof CampaignsToolbar>;
}) {
  return (
    <>
      <div className="space-y-4">
        {groups.map(({ status, items: group }) => {
          return (
            <DashboardPanel
              key={status}
              title={marketingRemainingCopy.nameAndStatus(status, group.length)}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.map((campaign) => (
                  <Card
                    variant="inset"
                    className="space-y-3 p-4"
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
                  </Card>
                ))}
              </div>
              {!group.length && (
                <p>{marketingPresentationCopy.noCampaignsInThisPhase}</p>
              )}
            </DashboardPanel>
          );
        })}
      </div>
    </>
  );
}

export function MarketingAudienceDetailToolbarBlock(
  props: ComponentProps<typeof MarketingAudienceDetailContentBlock>,
) {
  const { audience } = props;
  return (
    <Link
      className="type-link"
      href={`/marketing/audiences/${audience.id}/edit`}
    >
      {marketingPresentationCopy.editSegment}
    </Link>
  );
}
export function MarketingAudiencesToolbarBlock(
  props: ComponentProps<typeof MarketingAudiencesContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <AudiencesToolbar {...toolbarProps} /> : toolbarSlot;
}
export function MarketingCampaignDetailToolbarBlock(
  props: ComponentProps<typeof MarketingCampaignDetailContentBlock>,
) {
  const { campaign } = props;
  return (
    <Link
      className="type-link"
      href={`/marketing/campaigns/${campaign.id}/edit`}
    >
      {marketingPresentationCopy.editPlan}
    </Link>
  );
}
export function MarketingCampaignsToolbarBlock(
  props: ComponentProps<typeof MarketingCampaignsContentBlock>,
) {
  const { toolbar: toolbarSlot, toolbarProps } = props;
  return toolbarProps ? <CampaignsToolbar {...toolbarProps} /> : toolbarSlot;
}
