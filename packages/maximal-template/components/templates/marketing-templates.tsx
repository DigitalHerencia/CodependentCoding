import {
  MarketingPageBlock,
  MarketingFiltersBlock,
  MarketingPaginationBlock,
  MarketingCampaignsContentBlock,
  MarketingAudiencesContentBlock,
  MarketingCampaignDetailContentBlock,
  MarketingAudienceDetailContentBlock,
  MarketingAnalyticsContentBlock,
  MarketingFieldBlock,
  MarketingFormBlock,
  MarketingLifecycleBlock,
  MarketingAudienceSearchBlock,
} from "@/components/blocks/marketing-blocks";
import type {
  MarketingCampaignsProps,
  MarketingAudiencesProps,
  MarketingCampaignDetailProps,
  MarketingAudienceDetailProps,
  MarketingAnalyticsProps,
  MarketingFormFrameProps,
  MarketingFieldProps,
  MarketingLifecycleProps,
  MarketingAudienceSearchProps,
} from "@/types/marketingTypes";

/** Compose the campaign directory inside the existing tenant shell. */
export function MarketingCampaignsTemplate(props: MarketingCampaignsProps) {
  return (
    <MarketingPageBlock section="campaigns">
      <MarketingFiltersBlock
        kind="campaigns"
        criteria={props.page.criteria}
        canCreate={props.capabilities.canCreateCampaigns}
      />
      <MarketingCampaignsContentBlock {...props} />
      <MarketingPaginationBlock {...props.pagination} />
    </MarketingPageBlock>
  );
}
/** Compose the audience directory and URL-preserving pagination. */
export function MarketingAudiencesTemplate(props: MarketingAudiencesProps) {
  return (
    <MarketingPageBlock section="audiences">
      <MarketingFiltersBlock
        kind="audiences"
        criteria={props.page.criteria}
        canCreate={props.capabilities.canCreateAudiences}
      />
      <MarketingAudiencesContentBlock {...props} />
      <MarketingPaginationBlock {...props.pagination} />
    </MarketingPageBlock>
  );
}
/** Compose one campaign detail route with its lifecycle form slot. */
export function MarketingCampaignDetailTemplate(
  props: MarketingCampaignDetailProps,
) {
  return (
    <MarketingPageBlock section="campaign" title={props.campaign.name}>
      <MarketingCampaignDetailContentBlock {...props} />
      <MarketingPaginationBlock {...props.stepPagination} />
    </MarketingPageBlock>
  );
}
/** Compose one audience detail route from prepared definition semantics. */
export function MarketingAudienceDetailTemplate(
  props: MarketingAudienceDetailProps,
) {
  return (
    <MarketingPageBlock section="audience" title={props.audience.name}>
      <MarketingAudienceDetailContentBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Lay out planning cards, distributions, activity and measurement availability. */
export function MarketingAnalyticsTemplate(props: MarketingAnalyticsProps) {
  return (
    <MarketingPageBlock section="analytics">
      <MarketingAnalyticsContentBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Dedicated campaign creation page template. */
export function MarketingCampaignNewTemplate(props: MarketingFormFrameProps) {
  return (
    <MarketingPageBlock section="campaignNew">
      <MarketingFormBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Dedicated campaign editing page template. */
export function MarketingCampaignEditTemplate(props: MarketingFormFrameProps) {
  return (
    <MarketingPageBlock section="campaignEdit">
      <MarketingFormBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Dedicated audience creation page template. */
export function MarketingAudienceNewTemplate(props: MarketingFormFrameProps) {
  return (
    <MarketingPageBlock section="audienceNew">
      <MarketingFormBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Dedicated audience editing page template. */
export function MarketingAudienceEditTemplate(props: MarketingFormFrameProps) {
  return (
    <MarketingPageBlock section="audienceEdit">
      <MarketingFormBlock {...props} />
    </MarketingPageBlock>
  );
}
/** Forms compose individual field presentation through the template boundary. */
export function MarketingFieldTemplate(props: MarketingFieldProps) {
  return <MarketingFieldBlock {...props} />;
}
/** Detail lifecycle form presentation has no independent page scaffolding. */
export function MarketingLifecycleTemplate(props: MarketingLifecycleProps) {
  return <MarketingLifecycleBlock {...props} />;
}

/** Compose audience-option lookup presentation for the campaign RHF form. */
export function MarketingAudienceSearchTemplate(
  props: MarketingAudienceSearchProps,
) {
  return <MarketingAudienceSearchBlock {...props} />;
}
