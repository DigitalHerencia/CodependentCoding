import {
  marketingPresentationCopy,
  marketingRemainingCopy,
} from "@/content/marketing";
import { audienceFormSchema } from "@/schemas/marketingSchemas";
import type { AudienceDTO, CampaignDTO } from "@/types/marketingTypes";

export function selectAudiencesWorkflow(
  audiences: AudienceDTO[],
  query: string,
) {
  return audiences
    .filter((audience) =>
      audience.name.toLowerCase().includes(query.toLowerCase()),
    )
    .map(describeAudienceWorkflow);
}

export function selectCampaignsWorkflow(
  campaigns: CampaignDTO[],
  query: string,
) {
  const visible = campaigns.filter((campaign) =>
    `${campaign.name} ${campaign.audience?.name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return {
    campaigns: visible,
    groups: [
      "DRAFT",
      "SCHEDULED",
      "ACTIVE",
      "PAUSED",
      "COMPLETED",
      "CANCELED",
    ].map((status) => ({
      status,
      items: visible.filter((campaign) => campaign.status === status),
    })),
  };
}

export function describeAudienceWorkflow(audience: AudienceDTO) {
  const parsed = audienceFormSchema.safeParse(audience);
  const relationship = parsed.success
    ? parsed.data.definition.rules[0]?.value
    : undefined;
  return {
    ...audience,
    relationshipLabel: relationship ?? marketingPresentationCopy.customRules,
    ruleDescription: relationship
      ? marketingRemainingCopy.relationshipRule(relationship)
      : marketingPresentationCopy.thisAudienceHasCustomRulesThatTheCurrentEditor,
  };
}
