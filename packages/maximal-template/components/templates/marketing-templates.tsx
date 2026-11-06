import {
  MarketingAnalyticsContentBlock,
  MarketingAudienceDetailContentBlock,
  MarketingAudienceDetailToolbarBlock,
  MarketingAudiencesContentBlock,
  MarketingAudiencesToolbarBlock,
  MarketingCampaignDetailContentBlock,
  MarketingCampaignDetailToolbarBlock,
  MarketingCampaignsContentBlock,
  MarketingCampaignsToolbarBlock,
} from "@/components/blocks/marketing-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { marketingPresentationCopy } from "@/content/marketing";
import type { ComponentProps } from "react";

export function MarketingAnalyticsTemplate(
  props: ComponentProps<typeof MarketingAnalyticsContentBlock>,
) {
  return (
    <DashboardLayout
      title={marketingPresentationCopy.campaignOperations}
      nav={[]}
    >
      <MarketingAnalyticsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function MarketingAudienceDetailTemplate(
  props: ComponentProps<typeof MarketingAudienceDetailContentBlock>,
) {
  const { audience } = props;
  return (
    <DashboardLayout
      title={audience.name}
      nav={[]}
      toolbar={<MarketingAudienceDetailToolbarBlock {...props} />}
    >
      <MarketingAudienceDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function MarketingAudiencesTemplate(
  props: ComponentProps<typeof MarketingAudiencesContentBlock>,
) {
  return (
    <DashboardLayout
      title={marketingPresentationCopy.audienceSegments}
      nav={[]}
      toolbar={<MarketingAudiencesToolbarBlock {...props} />}
    >
      <MarketingAudiencesContentBlock {...props} />
    </DashboardLayout>
  );
}
export function MarketingCampaignDetailTemplate(
  props: ComponentProps<typeof MarketingCampaignDetailContentBlock>,
) {
  const { campaign } = props;
  return (
    <DashboardLayout
      title={campaign.name}
      nav={[]}
      toolbar={<MarketingCampaignDetailToolbarBlock {...props} />}
    >
      <MarketingCampaignDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function MarketingCampaignsTemplate(
  props: ComponentProps<typeof MarketingCampaignsContentBlock>,
) {
  return (
    <DashboardLayout
      title={marketingPresentationCopy.campaignPlanner}
      nav={[]}
      toolbar={<MarketingCampaignsToolbarBlock {...props} />}
    >
      <MarketingCampaignsContentBlock {...props} />
    </DashboardLayout>
  );
}
