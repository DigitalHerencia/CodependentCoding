import { getCampaigns } from "../../fetchers/marketingFetchers";
export async function applyDripTimingWorkflow(command: {
  campaignId: string;
  startsAt: Date;
  delayMinutes: readonly number[];
}) {
  const campaigns = await getCampaigns(100);
  if (!campaigns.some((campaign) => campaign.id === command.campaignId)) {
    throw new Error("Campaign was not found.");
  }
  let scheduledAt = command.startsAt.getTime();
  return command.delayMinutes.map((delayMinutes, index) => {
    if (!Number.isFinite(delayMinutes) || delayMinutes < 0) {
      throw new Error("Campaign drip delays must be non-negative.");
    }
    scheduledAt += delayMinutes * 60_000;
    return { position: index, scheduledAt: new Date(scheduledAt) };
  });
}
